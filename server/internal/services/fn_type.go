package services

import (
	"errors"
)


var (
	ErrSigninEmailRequired     = errors.New("email is required")
	ErrSigninPasswordRequired  = errors.New("password is required")
	ErrSigninEmailInvalid      = errors.New("email is invalid")
	ErrInvalidCredentials      = errors.New("invalid credentials")
	ErrUserInactive            = errors.New("user is inactive")
	ErrInvalidLoginMethod      = errors.New("invalid login method, use OAuth provider")
	ErrGoogleUserNotRegistered = errors.New("google user not registered")
	ErrUserNotFound            = errors.New("user not found")
	ErrInvalidRequestBody = errors.New("invalid request body")

	ErrSignupEmailRequired            = errors.New("email is required")
	ErrSignupEmailInvalid             = errors.New("email is invalid")
	ErrSignupPasswordOrProviderNeeded = errors.New("password or provider is required")
	ErrSignupProviderInvalid          = errors.New("provider is invalid")
	ErrSignupEmailTaken               = errors.New("email is already in use")
	ErrGoogleSignupNotAllowed         = errors.New("google signup is not allowed, user must be created by admin")
)
