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

func (h *VoteHandler) GetAll(c fiber.Ctx) (interface{}, string, error) {
	votes, err := h.service.GetAll()
	if err != nil {
		logger.Log.Errorf("❌ GetAll votes failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return votes, "Votos obtenidos correctamente", nil
}

func (h *VoteHandler) GetByCandidate(c fiber.Ctx) (interface{}, string, error) {
	candidateID := c.Params("candidateId")

	votes, err := h.service.GetByCandidate(candidateID)
	if err != nil {
		logger.Log.Errorf("❌ GetByCandidate failed: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	return votes, "Votos del candidato obtenidos correctamente", nil
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
