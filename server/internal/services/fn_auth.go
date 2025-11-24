// server/fn_auth.go
package services

import (

	"gorm.io/gorm"
	"server/internal/dto"
	"server/pkgs/security"
)



type authServiceImpl struct {
	db    *gorm.DB
	argon *security.Argon2Service
}

type AuthService interface {
	Signin(req dto.SigninRequest) (*dto.AuthResponse, error)
}

func NewAuthService(db *gorm.DB, argon *security.Argon2Service) AuthService {
	return &authServiceImpl{db, argon}
}
