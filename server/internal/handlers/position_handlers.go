package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"
)

type PositionHandler struct {
	service services.PositionService
}

func NewPositionHandler(service services.PositionService) *PositionHandler {
	return &PositionHandler{service: service}
}

func (h *PositionHandler) GetAll(c fiber.Ctx) (interface{}, string, error) {
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
	}

	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible")
	}

	positions, err := h.service.GetAll(userID.(string), userRole.(string))
	if err != nil {
		logger.Log.Errorf("❌ GetAll positions failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return positions, "Positions obtenidas correctamente", nil
}

func (h *PositionHandler) GetOne(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
	}
	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible")
	}

	position, err := h.service.GetOne(id, userID.(string), userRole.(string))
	if err != nil {
		logger.Log.Errorf("❌ GetOne position failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return position, "Position obtenida correctamente", nil
}

func (h *PositionHandler) Create(c fiber.Ctx) (interface{}, string, error) {
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
	}
	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible")
	}

	var req dto.CreatePositionRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido o formato incorrecto: "+err.Error())
	}

	position, err := h.service.Create(req, userID.(string), userRole.(string))
	if err != nil {
		logger.Log.Errorf("❌ Create position failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return position, "Position creada correctamente", nil
}

func (h *PositionHandler) Update(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
	}
	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible")
	}

	var req dto.UpdatePositionRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido o formato incorrecto: "+err.Error())
	}

	position, err := h.service.Update(id, req, userID.(string), userRole.(string))
	if err != nil {
		logger.Log.Errorf("❌ Update position failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return position, "Position actualizada correctamente", nil
}

func (h *PositionHandler) Delete(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID := c.Locals("userID")
	if userID == nil {
		return nil, "Usuario no autenticado", fiber.NewError(fiber.StatusUnauthorized, "Token inválido")
	}
	userRole := c.Locals("userRole")
	if userRole == nil {
		return nil, "Rol no encontrado", fiber.NewError(fiber.StatusUnauthorized, "Rol no disponible")
	}

	if err := h.service.Delete(id, userID.(string), userRole.(string)); err != nil {
		logger.Log.Errorf("❌ Delete position failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return nil, "Position eliminada correctamente", nil
}
