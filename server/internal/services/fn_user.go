package services

import (
	"crypto/rand"
	"errors"
	"math/big"
	"server/pkgs/security"
	"time"

	"gorm.io/gorm"

	"server/internal/dto"
	"server/internal/models"
)

var (
	ErrCreateUserEmailRequired      = errors.New("email is required")
	ErrCreateUserEmailInvalid       = errors.New("email is invalid")
	ErrCreateUserEmailTaken         = errors.New("el correo ya está registrado")
	ErrCreateUserOfficeRequired     = errors.New("office is required")
	ErrManagerCanOnlyCreateEmployee = errors.New("manager can only create employees")
	ErrUnauthorizedAccess           = errors.New("no tienes permisos para acceder a esta acción")
)

type UserManagementService struct {
	db            *gorm.DB
	argon2Service *security.Argon2Service
}

func NewUserManagementService(db *gorm.DB, argon2Service *security.Argon2Service) *UserManagementService {
	return &UserManagementService{db: db, argon2Service: argon2Service}
}

func generateRandomPassword(length int) (string, error) {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
	password := make([]byte, length)
	for i := range password {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(chars))))
		if err != nil {
			return "", err
		}
		password[i] = chars[num.Int64()]
	}
	return string(password), nil
}

func (s *UserManagementService) UserAll(requesterID string, requesterRole string, requesterOffice string) ([]dto.UserResponse, error) {
	var users []models.User

	switch requesterRole {
	case string(models.RolAdmin):
		if err := s.db.Where("id != ?", requesterID).Find(&users).Error; err != nil {
			return nil, err
		}
	default:
		return nil, ErrUnauthorizedAccess
	}

	var result []dto.UserResponse
	for _, u := range users {
		result = append(result, dto.UserResponse{
			ID:       u.ID,
			Name:     u.Name,
			Email:    u.Email,
			Role:     string(u.Rol),
			IsActive: u.IsActive,
			HasVoted: u.HasVoted,
		})
	}
	return result, nil
}

func (s *UserManagementService) UserOne(targetID, requesterID, requesterRole, requesterOffice string) (*dto.UserOneResponse, error) {
	var user models.User
	if err := s.db.Where("id = ?", targetID).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	switch requesterRole {
	case string(models.RolAdmin):
	default:
		return nil, ErrUnauthorizedAccess
	}

	createdByName := "SYSTEM"
	if user.CreatedByID != nil {
		var creator models.User
		if err := s.db.Select("name").Where("id = ?", *user.CreatedByID).First(&creator).Error; err == nil {
			createdByName = creator.Name
		}
	}

	return &dto.UserOneResponse{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		Role:      string(user.Rol),
		IsActive:  user.IsActive,
		HasVoted:  user.HasVoted,
		CreatedBy: createdByName,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (s *UserManagementService) CreateUser(req dto.CreateUserRequest, createdByID string) (*dto.CreateUserResponse, error) {
	if req.Email == "" {
		return nil, ErrCreateUserEmailRequired
	}

	var creator models.User
	if err := s.db.Where("id = ?", createdByID).First(&creator).Error; err != nil {
		return nil, errors.New("usuario creador no encontrado")
	}

	var newUserRole models.Rol
	switch creator.Rol {
	case models.RolAdmin:
		newUserRole = models.RolPollingStationChief
	default:
		return nil, ErrUnauthorizedAccess
	}

	var existingUser models.User
	if err := s.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return nil, ErrCreateUserEmailTaken
	}

	randomPassword, err := generateRandomPassword(12)
	if err != nil {
		return nil, errors.New("error al generar contraseña")
	}

	hashedPassword, err := s.argon2Service.HashPassword(randomPassword)
	if err != nil {
		return nil, errors.New("error al hashear la contraseña")
	}

	name := ""
	if req.Name != nil {
		name = *req.Name
	}

	user := models.User{
		Name:        name,
		Email:       req.Email,
		Password:    hashedPassword,
		Rol:         newUserRole,
		IsActive:    true,
		HasVoted:    false,
		CreatedByID: &createdByID,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &dto.CreateUserResponse{
		ID:                user.ID,
		Name:              user.Name,
		Email:             user.Email,
		Role:              string(user.Rol),
		GeneratedPassword: &randomPassword,
	}, nil
}

func (s *UserManagementService) DeleteUser(targetID string, requesterID string, requesterRole string) error {

	var targetUser models.User
	if err := s.db.Where("id = ?", targetID).First(&targetUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ErrUserNotFound
		}
		return err
	}

	if targetID == requesterID {
		return ErrUnauthorizedAccess
	}

	switch requesterRole {
	case string(models.RolAdmin):
	default:
		return ErrUnauthorizedAccess
	}

	if err := s.db.Delete(&targetUser).Error; err != nil {
		return err
	}

	return nil
}

func (s *UserManagementService) UpdateUser(targetID, requesterID, requesterRole, requesterOffice string, req dto.UpdateUserRequest) (*dto.UserResponse, error) {
	var targetUser models.User
	if err := s.db.Where("id = ?", targetID).First(&targetUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}

	// Reglas de permisos
	switch requesterRole {
	case string(models.RolAdmin):
	default:
		return nil, ErrUnauthorizedAccess
	}

	// Modificaciones permitidas
	if req.Name != nil {
		targetUser.Name = *req.Name
	}
	if req.Email != nil {
		targetUser.Email = *req.Email
	}
	if req.IsActive != nil {
		targetUser.IsActive = *req.IsActive
	}

	if err := s.db.Save(&targetUser).Error; err != nil {
		return nil, err
	}

	return &dto.UserResponse{
		ID:       targetUser.ID,
		Name:     targetUser.Name,
		Email:    targetUser.Email,
		Role:     string(targetUser.Rol),
		IsActive: targetUser.IsActive,
		HasVoted: targetUser.HasVoted,
	}, nil
}
