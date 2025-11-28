// server/internal/routes/image_routes.go
package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
)

func RegisterImageRoutes(app *fiber.App, db *gorm.DB) {
	imageService := services.NewImageService(db)
	imageHandler := handlers.NewImageHandler(imageService)

	app.Get("/images/:id", imageHandler.GetImage)

	println("✅ Image routes registered")
}