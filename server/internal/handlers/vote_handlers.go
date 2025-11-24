package handlers

import (
	"github.com/gofiber/fiber/v3"
	"server/internal/dto"
	"server/internal/services"
	"server/pkgs/logger"
)

type VoteHandler struct {
	service services.VoteService
}

func NewVoteHandler(service services.VoteService) *VoteHandler {
	return &VoteHandler{service: service}
}

func getVoteAuthLocals(c fiber.Ctx) (string, string, error) {
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

func (h *VoteHandler) Create(c fiber.Ctx) (interface{}, string, error) {
	userID, userRole, err := getVoteAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede crear votos")
	}

	var req dto.CreateVoteRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido: "+err.Error())
	}

	vote, err := h.service.Create(req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Create vote failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return vote, "Voto creado correctamente", nil
}

func (h *VoteHandler) GetAll(c fiber.Ctx) (interface{}, string, error) {
	userID, userRole, err := getVoteAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	// Query params opcionales para filtrar
	mesa := c.Query("mesa")
	candidateID := c.Query("candidateId")

	// Si se especifica mesa, obtener votos de esa mesa
	if mesa != "" {
		votes, err := h.service.GetByMesa(mesa, userID, userRole)
		if err != nil {
			logger.Log.Errorf("❌ GetByMesa failed: %v", err)
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		return votes, "Votos de la mesa obtenidos correctamente", nil
	}

	// Si se especifica candidateID, obtener votos de ese candidato
	if candidateID != "" {
		votes, err := h.service.GetByCandidate(candidateID, userID, userRole)
		if err != nil {
			logger.Log.Errorf("❌ GetByCandidate failed: %v", err)
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}
		return votes, "Votos del candidato obtenidos correctamente", nil
	}

	// Sin filtros, obtener todos los votos
	votes, err := h.service.GetAll(userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ GetAll votes failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return votes, "Votos obtenidos correctamente", nil
}

func (h *VoteHandler) GetOne(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getVoteAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	vote, err := h.service.GetOne(id, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ GetOne vote failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return vote, "Voto obtenido correctamente", nil
}

func (h *VoteHandler) Update(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getVoteAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede actualizar votos")
	}

	var req dto.UpdateVoteRequest
	if err := c.Bind().Body(&req); err != nil {
		return nil, "Solicitud inválida", fiber.NewError(fiber.StatusBadRequest, "Body inválido: "+err.Error())
	}

	vote, err := h.service.Update(id, req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Update vote failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return vote, "Voto actualizado correctamente", nil
}

func (h *VoteHandler) Delete(c fiber.Ctx) (interface{}, string, error) {
	id := c.Params("id")
	userID, userRole, err := getVoteAuthLocals(c)
	if err != nil {
		return nil, "", err
	}

	if userRole != "ADMIN" {
		return nil, "No autorizado", fiber.NewError(fiber.StatusForbidden, "Solo ADMIN puede eliminar votos")
	}

	if err := h.service.Delete(id, userID, userRole); err != nil {
		logger.Log.Errorf("❌ Delete vote failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return nil, "Voto eliminado correctamente", nil
}
