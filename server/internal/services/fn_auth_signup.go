package services

import (
	"server/internal/dto"
	"server/internal/models"
)

func (s *authServiceImpl) Signup(req dto.SignupRequest) (*dto.AuthResponse, error) {
	if req.Email == "" {
		return nil, ErrSignupEmailRequired
	}
	if !emailRx.MatchString(req.Email) {
		return nil, ErrSignupEmailInvalid
	}
	if req.Password == "" && req.Provider == "" {
		return nil, ErrSignupPasswordOrProviderNeeded
	}
	if req.Provider != "" {
		return nil, ErrGoogleSignupNotAllowed
	}

	var count int64
	s.db.Model(&models.User{}).Where("email = ?", req.Email).Count(&count)
	if count > 0 {
		return nil, ErrSignupEmailTaken
	}

	hashed, err := s.argon.HashPassword(req.Password)
	if err != nil {
		return nil, err
	}

	name := ""
	if req.Name != nil {
		name = *req.Name
	}

	user := models.User{
		Email:    req.Email,
		Name:     name,
		Password: hashed,
		Rol:      models.RolPollingStationChief,
		IsActive: true,
	}

	if err := s.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return s.buildAuthResponseWithToken(&user)
}
