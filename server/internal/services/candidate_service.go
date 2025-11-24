package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

type CandidateService interface {
	Create(req dto.CreateCandidateRequest, userID, userRole string) (*dto.CandidateResponse, error)
	GetAll(userID, userRole string) ([]dto.CandidateResponse, error)
	GetOne(id, userID, userRole string) (*dto.CandidateResponse, error)
	Update(id string, req dto.UpdateCandidateRequest, userID, userRole string) (*dto.CandidateResponse, error)
	Delete(id, userID, userRole string) error
	GetPosition(candidateID, userID, userRole string) (*dto.PositionSimple, error)
}

type candidateServiceImpl struct {
	db *gorm.DB
}

func NewCandidateService(db *gorm.DB) CandidateService {
	return &candidateServiceImpl{db: db}
}

func mapModelToResponse(c models.Candidate) dto.CandidateResponse {
	response := dto.CandidateResponse{
		ID:          c.ID,
		Name:        c.Name,
		Description: c.Description,
		Order:       c.Order,
		IsActive:    c.IsActive,
	}

	if c.Image != nil {
		response.ImageURL = c.Image.URL
		response.ImageID = &c.Image.ID
	}

	if c.Position != nil {
		response.Position = &dto.PositionSimple{
			ID:   c.Position.ID,
			Name: c.Position.Name,
		}
	}

	return response
}

func (s *candidateServiceImpl) GetAll(userID, userRole string) ([]dto.CandidateResponse, error) {
	var candidates []models.Candidate

	if err := s.db.Preload("Position").Preload("Image").Find(&candidates).Error; err != nil {
		return nil, err
	}

	response := make([]dto.CandidateResponse, len(candidates))
	for i, c := range candidates {
		response[i] = mapModelToResponse(c)
	}

	return response, nil
}

func (s *candidateServiceImpl) GetOne(id, userID, userRole string) (*dto.CandidateResponse, error) {
	var candidate models.Candidate

	if err := s.db.Preload("Position").Preload("Image").Where("id = ?", id).First(&candidate).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCandidateNotFound
		}
		return nil, err
	}

	res := mapModelToResponse(candidate)
	return &res, nil
}

func (s *candidateServiceImpl) Create(req dto.CreateCandidateRequest, userID, userRole string) (*dto.CandidateResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorized
	}

	if req.PositionID != "" {
		var position models.Position
		if err := s.db.First(&position, "id = ?", req.PositionID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, ErrPositionNotFound
			}
			return nil, err
		}
	}

	if req.ImageID != "" {
		var image models.Image
		if err := s.db.First(&image, "id = ?", req.ImageID).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil, errors.New("imagen no encontrada")
			}
			return nil, err
		}
	}

	candidate := models.Candidate{
		Name:        req.Name,
		Description: req.Description,
		IsActive:    true,
		Order:       0,
	}

	if req.IsActive != nil {
		candidate.IsActive = *req.IsActive
	}
	if req.Order != nil {
		candidate.Order = *req.Order
	}
	if req.PositionID != "" {
		candidate.PositionID = &req.PositionID
	}
	if req.ImageID != "" {
		candidate.ImageID = &req.ImageID
	}

	if err := s.db.Create(&candidate).Error; err != nil {
		return nil, err
	}

	return s.GetOne(candidate.ID, userID, userRole)
}

func (s *candidateServiceImpl) Update(id string, req dto.UpdateCandidateRequest, userID, userRole string) (*dto.CandidateResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorized
	}

	var candidate models.Candidate
	if err := s.db.Where("id = ?", id).First(&candidate).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCandidateNotFound
		}
		return nil, err
	}

	if req.Name != nil {
		candidate.Name = *req.Name
	}
	if req.Description != nil {
		candidate.Description = req.Description
	}
	if req.IsActive != nil {
		candidate.IsActive = *req.IsActive
	}
	if req.Order != nil {
		candidate.Order = *req.Order
	}

	if req.PositionID != nil {
		if *req.PositionID == "" {
			candidate.PositionID = nil
		} else {
			var position models.Position
			if err := s.db.First(&position, "id = ?", *req.PositionID).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return nil, ErrPositionNotFound
				}
				return nil, err
			}
			candidate.PositionID = req.PositionID
		}
	}

	if req.ImageID != nil {
		if *req.ImageID == "" {
			candidate.ImageID = nil
		} else {
			var image models.Image
			if err := s.db.First(&image, "id = ?", *req.ImageID).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					return nil, errors.New("imagen no encontrada")
				}
				return nil, err
			}
			candidate.ImageID = req.ImageID
		}
	}

	if err := s.db.Save(&candidate).Error; err != nil {
		return nil, err
	}

	return s.GetOne(candidate.ID, userID, userRole)
}

func (s *candidateServiceImpl) Delete(id, userID, userRole string) error {
	if userRole != "ADMIN" {
		return ErrUnauthorized
	}

	result := s.db.Delete(&models.Candidate{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrCandidateNotFound
	}

	return nil
}

func (s *candidateServiceImpl) GetPosition(candidateID, userID, userRole string) (*dto.PositionSimple, error) {
	var candidate models.Candidate

	if err := s.db.Preload("Position").Where("id = ?", candidateID).First(&candidate).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCandidateNotFound
		}
		return nil, err
	}

	if candidate.Position == nil {
		return nil, nil
	}

	return &dto.PositionSimple{
		ID:   candidate.Position.ID,
		Name: candidate.Position.Name,
	}, nil
}