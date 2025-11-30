package handlers

import (
	"path/filepath"

	"server/internal/dto"
	"server/internal/models"
	"server/internal/services"
	"server/pkgs/logger"

	"github.com/gofiber/fiber/v3"
)

type CandidateHandler struct {
	service      services.CandidateService
	imageService services.ImageService
}

func NewCandidateHandler(service services.CandidateService, imageService services.ImageService) *CandidateHandler {
	return &CandidateHandler{
		service:      service,
		imageService: imageService,
	}
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
	candidates, err := h.service.GetAll()
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

	name := c.FormValue("name")
	if name == "" {
		return nil, "Campo requerido", fiber.NewError(fiber.StatusBadRequest, "El campo 'name' es requerido")
	}

	description := c.FormValue("description")
	positionID := c.FormValue("positionId")

	typeCandidateStr := c.FormValue("typeCandidate")
	if typeCandidateStr == "" {
		typeCandidateStr = string(models.TCcandidate)
	}
	typeCandidate := models.TypeCandidates(typeCandidateStr)

	var isActive *bool
	if isActiveStr := c.FormValue("isActive"); isActiveStr != "" {
		val := isActiveStr == "true"
		isActive = &val
	}

	var imageID string
	file, err := c.FormFile("image")
	if err == nil && file != nil {
		image, err := h.imageService.SaveImage(file)
		if err != nil {
			logger.Log.Errorf("❌ Save image failed: %v", err)
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		filepath := filepath.Join("./uploads", image.Filename)
		if err := c.SaveFile(file, filepath); err != nil {
			logger.Log.Errorf("❌ Save file failed: %v", err)
			h.imageService.Delete(image.ID)
			return nil, "Error al guardar archivo", fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		imageID = image.ID
	}

	var descPtr *string
	if description != "" {
		descPtr = &description
	}

	req := dto.CreateCandidateRequest{
		Name:          name,
		Description:   descPtr,
		ImageID:       imageID,
		IsActive:      isActive,
		PositionID:    positionID,
		TypeCandidate: typeCandidate,
	}

	candidate, err := h.service.Create(req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Create candidate failed: %v", err)
		if imageID != "" {
			h.imageService.Delete(imageID)
		}
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

	currentCandidate, err := h.service.GetOne(id, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Candidate not found: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusNotFound, err.Error())
	}

	var req dto.UpdateCandidateRequest

	if name := c.FormValue("name"); name != "" {
		req.Name = &name
	}

	if description := c.FormValue("description"); description != "" {
		req.Description = &description
	}

	if positionID := c.FormValue("positionId"); positionID != "" {
		req.PositionID = &positionID
	}

	if isActiveStr := c.FormValue("isActive"); isActiveStr != "" {
		val := isActiveStr == "true"
		req.IsActive = &val
	}

	file, err := c.FormFile("image")
	if err == nil && file != nil {
		newImage, err := h.imageService.SaveImage(file)
		if err != nil {
			logger.Log.Errorf("❌ Save image failed: %v", err)
			return nil, err.Error(), fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		filepath := filepath.Join("./uploads", newImage.Filename)
		if err := c.SaveFile(file, filepath); err != nil {
			logger.Log.Errorf("❌ Save file failed: %v", err)
			h.imageService.Delete(newImage.ID)
			return nil, "Error al guardar archivo", fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		req.ImageID = &newImage.ID

		if currentCandidate.ImageID != nil && *currentCandidate.ImageID != "" {
			oldImageID := *currentCandidate.ImageID
			if err := h.imageService.Delete(oldImageID); err != nil {
				logger.Log.Warnf("⚠️ No se pudo eliminar imagen anterior: %v", err)
			}
		}
	}

	candidate, err := h.service.Update(id, req, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Update candidate failed: %v", err)
		if req.ImageID != nil && *req.ImageID != "" {
			h.imageService.Delete(*req.ImageID)
		}
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

	currentCandidate, err := h.service.GetOne(id, userID, userRole)
	if err != nil {
		logger.Log.Errorf("❌ Candidate not found: %v", err)
		return nil, err.Error(), fiber.NewError(fiber.StatusNotFound, err.Error())
	}

	if currentCandidate.ImageID != nil && *currentCandidate.ImageID != "" {
		if err := h.imageService.Delete(*currentCandidate.ImageID); err != nil {
			logger.Log.Warnf("⚠️ No se pudo eliminar la imagen asociada: %v", err)
		}
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
