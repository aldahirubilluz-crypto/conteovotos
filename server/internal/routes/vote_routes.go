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

	voteGroup := app.Group("/votes", middleware.AuthRequired())
	{
		voteGroup.Get("/", httpwrap.Wrap(voteHandler.GetAll))
		voteGroup.Get("/:id", httpwrap.Wrap(voteHandler.GetOne))
		voteGroup.Post("/", httpwrap.Wrap(voteHandler.Create))
		voteGroup.Put("/:id", httpwrap.Wrap(voteHandler.Update))
		voteGroup.Patch("/:id", httpwrap.Wrap(voteHandler.Update))
		voteGroup.Delete("/:id", httpwrap.Wrap(voteHandler.Delete))
	}

	println("✅ Vote routes registered")
}
