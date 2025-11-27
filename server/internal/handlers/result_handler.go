// server/internal/handlers/result_handler.go
package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/services"
	"server/pkgs/logger"
)

type ResultHandler struct {
	service services.ResultService
}

func NewResultHandler(service services.ResultService) *ResultHandler {
	return &ResultHandler{service: service}
}

func (h *ResultHandler) GetAllResults(c fiber.Ctx) error {
	results, err := h.service.GetAllResults()
	if err != nil {
		logger.Log.Errorf("❌ GetAllResults failed: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Error al obtener resultados",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"data":    results,
		"message": "Resultados obtenidos correctamente",
		"status":  200,
	})
}

func (h *ResultHandler) GetResultsSummary(c fiber.Ctx) error {
	summary, err := h.service.GetResultsSummary()
	if err != nil {
		logger.Log.Errorf("❌ GetResultsSummary failed: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Error al obtener resumen",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"data":    summary,
		"message": "Resumen obtenido correctamente",
		"status":  200,
	})
}

func (h *ResultHandler) GetResultsByPosition(c fiber.Ctx) error {
	positionID := c.Params("positionId")

	results, err := h.service.GetResultsByPosition(positionID)
	if err != nil {
		logger.Log.Errorf("❌ GetResultsByPosition failed: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":   "Error al obtener resultados por posición",
			"message": err.Error(),
		})
	}

	return c.JSON(fiber.Map{
		"data":    results,
		"message": "Resultados obtenidos correctamente",
		"status":  200,
	})
}