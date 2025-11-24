package services

import (
	"errors"
	"regexp"
)

var (
	emailRx                    = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	ErrSigninEmailRequired     = errors.New("email is required")
	ErrSigninPasswordRequired  = errors.New("password is required")
	ErrSigninEmailInvalid      = errors.New("email is invalid")
	ErrInvalidCredentials      = errors.New("invalid credentials")
	ErrUserInactive            = errors.New("user is inactive")
	ErrInvalidLoginMethod      = errors.New("invalid login method, use OAuth provider")
	ErrGoogleUserNotRegistered = errors.New("google user not registered")
	ErrInvalidRequestBody      = errors.New("invalid request body")
	ErrUserNotFound            = errors.New("user not found")

	ErrSignupEmailRequired            = errors.New("email is required")
	ErrSignupEmailInvalid             = errors.New("email is invalid")
	ErrSignupPasswordOrProviderNeeded = errors.New("password or provider is required")
	ErrSignupProviderInvalid          = errors.New("provider is invalid")
	ErrSignupEmailTaken               = errors.New("email is already in use")
	ErrGoogleSignupNotAllowed         = errors.New("google signup is not allowed, user must be created by admin")

	ErrVoteNotFound       = errors.New("voto no encontrado")
	ErrUnauthorizedAction = errors.New("no tienes permisos para esta acción")
	ErrPositionNotFound   = errors.New("position not found")

	ErrMesaNotFound     = errors.New("mesa no encontrada")
	ErrDuplicateVote    = errors.New("ya existe un voto para este candidato en esta mesa")
	ErrInvalidVoteCount = errors.New("el número de votos no puede ser negativo")
)
