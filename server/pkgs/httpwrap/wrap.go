package httpwrap

import "github.com/gofiber/fiber/v3"

func Wrap(fn func(fiber.Ctx) (interface{}, string, error)) fiber.Handler {
	return func(c fiber.Ctx) error {
		data, msg, err := fn(c)
		if err != nil {
			if fe, ok := err.(*fiber.Error); ok {
				return c.Status(fe.Code).JSON(fiber.Map{
					"status":  fe.Code,
					"message": fe.Message,
					"data":    nil,
				})
			}
			code := fiber.StatusInternalServerError
			if msg == "" {
				msg = err.Error()
			}
			return c.Status(code).JSON(fiber.Map{
				"status":  code,
				"message": msg,
				"data":    nil,
			})
		}

		return c.Status(fiber.StatusOK).JSON(fiber.Map{
			"status":  fiber.StatusOK,
			"message": msg,
			"data":    data,
		})
	}
}

func WrapStandard(fn func(fiber.Ctx) error) fiber.Handler {
	return fn
}
