package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/middleware"
	"server/pkgs/security"
)

func RegisterUserRoutes(app *fiber.App, db *gorm.DB) {
	argon2Service := security.NewArgon2Service()
	userManagementService := services.NewUserManagementService(db, argon2Service)
	userManagementHandler := handlers.NewUserManagementHandler(userManagementService)

	userGroup := app.Group("/users", middleware.AuthRequired())
	{
		userGroup.Get("/", httpwrap.Wrap(userManagementHandler.UserAll))
		userGroup.Get("/:id", httpwrap.Wrap(userManagementHandler.UserOne))
		userGroup.Post("/create", httpwrap.Wrap(userManagementHandler.CreateUser))
		userGroup.Delete("/delete/:id", httpwrap.Wrap(userManagementHandler.DeleteUser))
		userGroup.Patch("/update/:id", httpwrap.Wrap(userManagementHandler.UpdateUser))
	}

	println("✅ User management routes registered: POST /users/create")
}
