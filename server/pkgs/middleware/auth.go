// server/pkgs/middleware/auth.go
package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired() fiber.Handler {
	return func(c fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"data":    nil,
				"message": "Token no proporcionado",
				"status":  fiber.StatusUnauthorized,
			})
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"data":    nil,
				"message": "Formato de token inválido",
				"status":  fiber.StatusUnauthorized,
			})
		}

		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"data":    nil,
				"message": "Error interno: JWT_SECRET no configurado",
				"status":  fiber.StatusInternalServerError,
			})
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"data":    nil,
				"message": "Token inválido o expirado",
				"status":  fiber.StatusUnauthorized,
			})
		}

		claims := token.Claims.(jwt.MapClaims)

		c.Locals("userID", claims["id"])
		c.Locals("userEmail", claims["email"])
		c.Locals("userRole", claims["role"])

		if office, ok := claims["office"]; ok {
			c.Locals("userOffice", office)
		}

		return c.Next()
	}
}
