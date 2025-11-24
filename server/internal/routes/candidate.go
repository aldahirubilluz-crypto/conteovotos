// server/internal/routes/candidate_routes.go
package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/middleware"
)

func RegisterCandidateRoutes(app *fiber.App, db *gorm.DB) {
    candidateService := services.NewCandidateService(db)
    candidateHandler := handlers.NewCandidateHandler(candidateService)

    candidateGroup := app.Group("/candidates", middleware.AuthRequired())
    {
        candidateGroup.Get("/", httpwrap.Wrap(candidateHandler.GetAll))
        candidateGroup.Get("/:id", httpwrap.Wrap(candidateHandler.GetOne))
        candidateGroup.Post("/", httpwrap.Wrap(candidateHandler.Create))
        candidateGroup.Put("/:id", httpwrap.Wrap(candidateHandler.Update))
        candidateGroup.Patch("/:id", httpwrap.Wrap(candidateHandler.Update))
        candidateGroup.Delete("/:id", httpwrap.Wrap(candidateHandler.Delete))

        candidateGroup.Get("/:id/position", httpwrap.Wrap(candidateHandler.GetPosition))
    }
    println("✅ Candidate routes registered")
}