package services

import (
	"errors"
	"gorm.io/gorm"
	"server/internal/dto"
	"server/internal/models"
	"time"
)

type PositionService interface {
	GetAll(userID, userRole string) ([]dto.PositionResponse, error)
	GetOne(id, userID, userRole string) (*dto.PositionResponse, error)
	Create(req dto.CreatePositionRequest, userID, userRole string) (*dto.PositionResponse, error)
	Update(id string, req dto.UpdatePositionRequest, userID, userRole string) (*dto.PositionResponse, error)
	Delete(id, userID, userRole string) error
}

type positionServiceImpl struct {
	db *gorm.DB
}

func NewPositionService(db *gorm.DB) PositionService {
	return &positionServiceImpl{db: db}
}

func (s *positionServiceImpl) GetAll(userID, userRole string) ([]dto.PositionResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorizedAction
	}

	var positions []models.Position
	if err := s.db.Find(&positions).Error; err != nil {
		return nil, err
	}

	var result []dto.PositionResponse
	for _, p := range positions {
		result = append(result, dto.PositionResponse{
			ID:          p.ID,
			Name:        p.Name,
			Description: p.Description,
			IsActive:    p.IsActive,
			CreatedAt:   p.CreatedAt.Format(time.RFC3339),
			UpdatedAt:   p.UpdatedAt.Format(time.RFC3339),
		})
	}
	return result, nil
}

func (s *positionServiceImpl) GetOne(id, userID, userRole string) (*dto.PositionResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorizedAction
	}

	var p models.Position
	if err := s.db.First(&p, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPositionNotFound
		}
		return nil, err
	}

	return &dto.PositionResponse{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		IsActive:    p.IsActive,
		CreatedAt:   p.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   p.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (s *positionServiceImpl) Create(req dto.CreatePositionRequest, userID, userRole string) (*dto.PositionResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorizedAction
	}

	position := models.Position{
		Name:        req.Name,
		Description: req.Description,
		IsActive:    true,
	}
	if req.IsActive != nil {
		position.IsActive = *req.IsActive
	}

	if err := s.db.Create(&position).Error; err != nil {
		return nil, err
	}

	return &dto.PositionResponse{
		ID:          position.ID,
		Name:        position.Name,
		Description: position.Description,
		IsActive:    position.IsActive,
		CreatedAt:   position.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   position.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (s *positionServiceImpl) Update(id string, req dto.UpdatePositionRequest, userID, userRole string) (*dto.PositionResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorizedAction
	}

	var position models.Position
	if err := s.db.First(&position, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrPositionNotFound
		}
		return nil, err
	}

	if req.Name != nil {
		position.Name = *req.Name
	}
	if req.Description != nil {
		position.Description = req.Description
	}
	if req.IsActive != nil {
		position.IsActive = *req.IsActive
	}

	if err := s.db.Save(&position).Error; err != nil {
		return nil, err
	}

	return &dto.PositionResponse{
		ID:          position.ID,
		Name:        position.Name,
		Description: position.Description,
		IsActive:    position.IsActive,
		CreatedAt:   position.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   position.UpdatedAt.Format(time.RFC3339),
	}, nil
}

func (s *positionServiceImpl) Delete(id, userID, userRole string) error {
	if userRole != "ADMIN" {
		return ErrUnauthorizedAction
	}

	if err := s.db.Delete(&models.Position{}, "id = ?", id).Error; err != nil {
		return ErrPositionNotFound
	}

	return nil
}
