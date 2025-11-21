package middlewares

import "github.com/gofiber/fiber/v3"

func JSONErrorHandler(ctx fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}

	return ctx.Status(code).JSON(fiber.Map{
		"error":   true,
		"message": err.Error(),
	})
}
