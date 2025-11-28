package routes

import (
	"github.com/gofiber/fiber/v3"
	"gorm.io/gorm"
	"server/internal/handlers"
	"server/internal/services"
	"server/pkgs/httpwrap"
	"server/pkgs/middleware"
)

func RegisterVoteRoutes(app *fiber.App, db *gorm.DB) {

	voteService := services.NewVoteService(db)
	voteHandler := handlers.NewVoteHandler(voteService)

	app.Get("/votes", httpwrap.Wrap(voteHandler.GetAll))
	app.Get("/votes/candidate/:candidateId", httpwrap.Wrap(voteHandler.GetByCandidate))

	voteGroup := app.Group("/votes", middleware.AuthRequired())
	{
		voteGroup.Post("/", httpwrap.Wrap(voteHandler.Create))
	}

	println("✅ Vote routes registered")
}
