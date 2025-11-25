// server/internal/handlers/image_handler.go
package handlers

import (
	"os"
	"path/filepath"

	"github.com/gofiber/fiber/v3"
	"server/internal/services"
	"server/pkgs/logger"
)

type ImageHandler struct {
	service services.ImageService
}

func NewImageHandler(service services.ImageService) *ImageHandler {
	return &ImageHandler{service: service}
}

func (h *ImageHandler) GetImage(c fiber.Ctx) error {
	id := c.Params("id")

	// Obtener info de la imagen desde BD
	image, err := h.service.GetByID(id)
	if err != nil {
		logger.Log.Errorf("❌ GetImage failed: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Imagen no encontrada",
		})
	}

	// Leer archivo desde disco
	filePath := filepath.Join("./uploads", image.Filename)
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		logger.Log.Errorf("❌ ReadFile failed: %v", err)
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Archivo no encontrado",
		})
	}

	// Determinar content-type según extensión
	ext := filepath.Ext(image.Filename)
	contentType := "image/jpeg"
	switch ext {
	case ".png":
		contentType = "image/png"
	case ".gif":
		contentType = "image/gif"
	case ".webp":
		contentType = "image/webp"
	}

	c.Set("Content-Type", contentType)
	return c.Send(fileData)
}