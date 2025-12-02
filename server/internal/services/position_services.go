package services

import (
	"errors"
	"fmt"
	"server/internal/dto"
	"server/internal/models"
	"time"

	"gorm.io/gorm"
)

type PositionService interface {
	GetAll() ([]dto.PositionResponse, error)
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

func (s *positionServiceImpl) GetAll() ([]dto.PositionResponse, error) {
	var positions []models.Position
	if err := s.db.Find(&positions).Error; err != nil {
		return nil, err
	}

	var result []dto.PositionResponse
	for _, p := range positions {
		result = append(result, dto.PositionResponse{
			ID:              p.ID,
			Name:            p.Name,
			Description:     p.Description,
			TypePosition:    string(p.TypePosition),
			TotalVotes:      p.TotalVotes,
			ValidPercentage: p.ValidPercentage,
			CreatedAt:       p.CreatedAt.Format(time.RFC3339),
			UpdatedAt:       p.UpdatedAt.Format(time.RFC3339),
		})
	}
	return result, nil
}

func (s *positionServiceImpl) Create(req dto.CreatePositionRequest, userID, userRole string) (*dto.PositionResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorizedAction
	}

	if req.Name == "" {
		return nil, fmt.Errorf("nombre posición obligatorio")
	}

	if req.TypePosition == "" {
		return nil, fmt.Errorf("tipo de posición obligatorio")
	}

	validTypes := []models.TypePositions{
		models.TAposition,
		models.TIposition,
	}

	isValid := false
	for _, t := range validTypes {
		if req.TypePosition == string(t) {
			isValid = true
			break
		}
	}

	if !isValid {
		return nil, fmt.Errorf("typePosition inválido, debe ser AUTORIDAD o ORGANO")
	}

	if req.TotalVotes <= 0 {
		return nil, fmt.Errorf("maximo de votos debe ser mayor a 0")
	}

	if req.ValidPercentage < 0 || req.ValidPercentage > 1 {
		return nil, fmt.Errorf("porcentaje valido debe estar entre 0 y 1")
	}

	position := models.Position{
		Name:            req.Name,
		Description:     req.Description,
		TypePosition:    models.TypePositions(req.TypePosition),
		TotalVotes:      req.TotalVotes,
		ValidPercentage: req.ValidPercentage,
	}

	if err := s.db.Create(&position).Error; err != nil {
		return nil, err
	}

	return &dto.PositionResponse{
		ID:              position.ID,
		Name:            position.Name,
		Description:     position.Description,
		TypePosition:    string(position.TypePosition),
		TotalVotes:      position.TotalVotes,
		ValidPercentage: position.ValidPercentage,
		CreatedAt:       position.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       position.UpdatedAt.Format(time.RFC3339),
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
		if *req.Name == "" {
			return nil, fmt.Errorf("el nombre no puede estar vacío")
		}
		position.Name = *req.Name
	}

	if req.Description != nil {
		position.Description = req.Description
	}

	if req.TypePosition != nil {
		validTypes := []models.TypePositions{
			models.TAposition,
			models.TIposition,
		}

		isValid := false
		for _, t := range validTypes {
			if *req.TypePosition == string(t) {
				isValid = true
				break
			}
		}

		if !isValid {
			return nil, fmt.Errorf("typePosition inválido, debe ser AUTORIDAD o ORGANO")
		}

		position.TypePosition = models.TypePositions(*req.TypePosition)
	}

	if req.TotalVotes != nil {
		if *req.TotalVotes <= 0 {
			return nil, fmt.Errorf("maximo de votos debe ser mayor a 0")
		}
		position.TotalVotes = *req.TotalVotes
	}

	if req.ValidPercentage != nil {
		if *req.ValidPercentage < 0 || *req.ValidPercentage > 1 {
			return nil, fmt.Errorf("validPercentage debe estar entre 0 y 1")
		}
		position.ValidPercentage = *req.ValidPercentage
	}

	if err := s.db.Save(&position).Error; err != nil {
		return nil, err
	}

	return &dto.PositionResponse{
		ID:              position.ID,
		Name:            position.Name,
		Description:     position.Description,
		TypePosition:    string(position.TypePosition),
		TotalVotes:      position.TotalVotes,
		ValidPercentage: position.ValidPercentage,
		CreatedAt:       position.CreatedAt.Format(time.RFC3339),
		UpdatedAt:       position.UpdatedAt.Format(time.RFC3339),
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
