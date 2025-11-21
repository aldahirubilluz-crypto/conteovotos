// server/internal/routes/auth.go
package routes

import (
	"server/internal/config"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/security"

	"github.com/gofiber/fiber/v3"
)

func RegisterAuthRoutes(app *fiber.App) {
	argon := security.NewArgon2Service()
	authSvc := services.NewAuthService(config.DB, argon)
	authH := handlers.NewAuthHandler(authSvc)

	app.Post("/auth/signin", httpwrap.Wrap(authH.Signin))

	println("✅ Auth routes registered: POST /auth/signin")
}
