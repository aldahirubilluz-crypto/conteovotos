package services

import (
	"errors"
	"os"
	"server/internal/dto"
	"server/internal/models"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

// Signin: maneja login con provider "credentials" o "google"
func (s *authServiceImpl) Signin(req dto.SigninRequest) (*dto.AuthResponse, error) {
	if req.Provider == nil || *req.Provider == "" {
		return nil, ErrInvalidRequestBody
	}

	switch *req.Provider {
	case "google":
		if req.Email == "" {
			return nil, ErrSigninEmailRequired
		}
		return s.signinWithGoogle(req.Email)

	case "credentials":
		if req.Email == "" {
			return nil, ErrSigninEmailRequired
		}
		if !emailRx.MatchString(req.Email) {
			return nil, ErrSigninEmailInvalid
		}
		if req.Password == "" {
			return nil, ErrSigninPasswordRequired
		}

		var user models.User
		if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, ErrUserNotFound
			}
			return nil, err
		}

		if !user.IsActive {
			return nil, ErrUserInactive
		}

		if err := s.argon.ComparePassword(user.Password, req.Password); err != nil {
			return nil, ErrInvalidCredentials
		}

		return s.buildAuthResponseWithToken(&user)

	default:
		return nil, ErrInvalidRequestBody
	}
}

// signinWithGoogle: login mediante Google
func (s *authServiceImpl) signinWithGoogle(email string) (*dto.AuthResponse, error) {
	var user models.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrGoogleUserNotRegistered
		}
		return nil, err
	}

	if !user.IsActive {
		return nil, ErrUserInactive
	}

	return s.buildAuthResponseWithToken(&user)
}

// buildAuthResponseWithToken: genera JWT y construye la respuesta
func (s *authServiceImpl) buildAuthResponseWithToken(u *models.User) (*dto.AuthResponse, error) {
	jwtSecret := []byte(os.Getenv("JWT_SECRET"))
	if len(jwtSecret) == 0 {
		return nil, errors.New("JWT_SECRET not set")
	}

	claims := jwt.MapClaims{
		"id":    u.ID,
		"email": u.Email,
		"role":  string(u.Rol),
		"exp":   time.Now().Add(365 * 24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		ID:    u.ID,
		Email: u.Email,
		Name:  &u.Name,
		Role:  string(u.Rol),
		Token: tokenString,
	}, nil
}
