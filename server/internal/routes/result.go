// server/internal/routes/result_routes.go
package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
)

func RegisterResultRoutes(app *fiber.App, db *gorm.DB) {
	resultService := services.NewResultService(db)
	resultHandler := handlers.NewResultHandler(resultService)

	// Rutas públicas (sin autenticación)
	resultGroup := app.Group("/results")
	{
		resultGroup.Get("/", resultHandler.GetAllResults)
		resultGroup.Get("/summary", resultHandler.GetResultsSummary)
		resultGroup.Get("/position/:positionId", resultHandler.GetResultsByPosition)
	}

	println("✅ Result routes registered")
}
