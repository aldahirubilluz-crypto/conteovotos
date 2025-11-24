package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/middleware"
)

func RegisterPositionRoutes(app *fiber.App, db *gorm.DB) {
	positionService := services.NewPositionService(db)
	positionHandler := handlers.NewPositionHandler(positionService)

	positionGroup := app.Group("/positions", middleware.AuthRequired())
	{
		positionGroup.Get("/", httpwrap.Wrap(positionHandler.GetAll))
		positionGroup.Get("/:id", httpwrap.Wrap(positionHandler.GetOne))
		positionGroup.Post("/", httpwrap.Wrap(positionHandler.Create))
		positionGroup.Patch("/:id", httpwrap.Wrap(positionHandler.Update))
		positionGroup.Delete("/:id", httpwrap.Wrap(positionHandler.Delete))
	}

	println("✅ Position CRUD routes registered")
}
