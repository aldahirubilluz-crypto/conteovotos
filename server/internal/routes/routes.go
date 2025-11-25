package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
)

func RegisterRoutes(app *fiber.App, db *gorm.DB) {

	app.Get("/health", func(c fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	RegisterAuthRoutes(app)
	RegisterPositionRoutes(app, db)
	RegisterCandidateRoutes(app, db)
	RegisterVoteRoutes(app, db)
	RegisterImageRoutes(app, db)
}
