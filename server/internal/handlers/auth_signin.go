// server/internal/handlers/auth_signin.go
package handlers

import (
	"errors"
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"

	"github.com/gofiber/fiber/v3"
)

type AuthHandler struct {
	authService services.AuthService
}

func NewAuthHandler(authService services.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

func (h *AuthHandler) Signin(c fiber.Ctx) (interface{}, string, error) {
	logger.Log.Info("📥 Signin request received")

	var req dto.SigninRequest
	if err := c.Bind().JSON(&req); err != nil {
		logger.Log.Errorf("❌ Invalid request body: %v", err)
		return nil, "Invalid request body", fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	logger.Log.Infof("📧 Email: %s, Provider: %v", req.Email, req.Provider)

	response, err := h.authService.Signin(req)
	if err != nil {
		logger.Log.Errorf("❌ Signin failed: %v", err)

		if errors.Is(err, services.ErrGoogleUserNotRegistered) {
			return nil, err.Error(), fiber.NewError(fiber.StatusForbidden, err.Error())
		}

		return nil, err.Error(), fiber.NewError(fiber.StatusUnauthorized, err.Error())
	}

	logger.Log.Infof("✅ Signin successful for %s", response.Email)
	return response, "Login successful", nil
}
