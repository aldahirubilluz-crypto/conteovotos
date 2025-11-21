// server/fn_auth.go
package services

import (
	"regexp"

	"gorm.io/gorm"
	"server/internal/dto"
	"server/pkgs/security"
)

var emailRx = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

type authServiceImpl struct {
	db    *gorm.DB
	argon *security.Argon2Service
}

// // Signin implements AuthService.
// func (a *authServiceImpl) Signin(req dto.SigninRequest) (*dto.AuthResponse, error) {
// 	panic("unimplemented")
// }

// // Signup implements AuthService.
// func (a *authServiceImpl) Signup(req dto.SignupRequest) (*dto.AuthResponse, error) {
// 	panic("unimplemented")
// }

type AuthService interface {
	Signin(req dto.SigninRequest) (*dto.AuthResponse, error)
	Signup(req dto.SignupRequest) (*dto.AuthResponse, error)
}

func NewAuthService(db *gorm.DB, argon *security.Argon2Service) AuthService {
	return &authServiceImpl{db, argon}
}
