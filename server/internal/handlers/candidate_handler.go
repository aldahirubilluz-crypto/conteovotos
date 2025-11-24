package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"
)

type CandidateHandler struct {
	service services.CandidateService
}

func NewCandidateHandler(service services.CandidateService) *CandidateHandler {
	return &CandidateHandler{service: service}
}

func getAuthLocals(c fiber.Ctx) (string, string, error) {
	userID, ok := c.Locals("userID").(string)
	if !ok {
		return "", "", fiber.NewError(fiber.StatusUnauthorized, "Token inválido o userID no encontrado")
	}
	userRole, ok := c.Locals("userRole").(string)
	if !ok {
		return "", "", fiber.NewError(fiber.StatusUnauthorized, "userRole no disponible")
	}
	return userID, userRole, nil
}

func (h *CandidateHandler) GetAll(c fiber.Ctx) (interface{}, string, error) {
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	candidates, err := h.service.GetAll(userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ GetAll candidates failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return candidates, "Candidates obtenidos correctamente", nil
}

func (h *CandidateHandler) GetOne(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	candidate, err := h.service.GetOne(id, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ GetOne candidate failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return candidate, "Candidate obtenido correctamente", nil
}

func (h *CandidateHandler) Create(c fiber.Ctx) (interface{}, string, error) {
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede crear candidatos")
	}

	var req dto.CreateCandidateRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido o formato incorrecto: "+err.Error())
	}

	candidate, err := h.service.Create(req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Create candidate failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return candidate, "Candidate creado correctamente", nil
}

func (h *CandidateHandler) Update(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede actualizar candidatos")
	}

	var req dto.UpdateCandidateRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido o formato incorrecto: "+err.Error())
	}

	candidate, err := h.service.Update(id, req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Update candidate failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return candidate, "Candidate actualizado correctamente", nil
}

func (h *CandidateHandler) Delete(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede eliminar candidatos")
	}

	if err := h.service.Delete(id, userID, userRole); err != nil {
		logger.Log.Errorf("❌ Delete candidate failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return nil, "Candidate eliminado correctamente", nil
}


func (h *CandidateHandler) GetPosition(c fiber.Ctx) (interface{}, string, error) {
	candidateID := c.Params("id")
	userID, userRole, err := getAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	position, err := h.service.GetPosition(candidateID, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ GetPosition failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	if position == nil {
		return nil, "El candidato no tiene puesto asignado", nil
	}

	return position, "Posición obtenida correctamente", nil
}