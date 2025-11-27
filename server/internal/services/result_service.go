// server/internal/services/result_service.go
package services

import (
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

type ResultService interface {
	GetAllResults() ([]dto.CandidateResultResponse, error)
	GetResultsPosition() ([]dto.ResultsPositionResponse, error)
	GetResultsByPosition(positionID string) ([]dto.CandidateResultResponse, error)
}

type resultServiceImpl struct {
	db *gorm.DB
}

func NewResultService(db *gorm.DB) ResultService {
	return &resultServiceImpl{db: db}
}

func (s *resultServiceImpl) GetAllResults() ([]dto.CandidateResultResponse, error) {
	var candidates []models.Candidate

	// Obtener todos los candidatos con sus relaciones
	if err := s.db.Preload("Position").Preload("Image").Find(&candidates).Error; err != nil {
		return nil, err
	}

	var results []dto.CandidateResultResponse

	for _, candidate := range candidates {
		var totalVotes int64
		s.db.Model(&models.Vote{}).
			Where("candidate_id = ?", candidate.ID).
			Select("COALESCE(SUM(total_votes), 0)").
			Scan(&totalVotes)

		result := dto.CandidateResultResponse{
			CandidateID:   candidate.ID,
			CandidateName: candidate.Name,
			TotalVotes:    int(totalVotes),
		}

		if candidate.Position != nil {
			result.PositionID = &candidate.Position.ID
			result.PositionName = &candidate.Position.Name
		}

		if candidate.Image != nil {
			result.ImageId = candidate.Image.ID
		}

		results = append(results, result)
	}

	return results, nil
}

func (s *resultServiceImpl) GetResultsPosition() ([]dto.ResultsPositionResponse, error) {
	var positions []models.Position

	// Solo traer puestos activos (opcional)
	if err := s.db.Where("is_active = ?", true).Find(&positions).Error; err != nil {
		return nil, err
	}

	// Construir el DTO
	var results []dto.ResultsPositionResponse
	for _, position := range positions {
		results = append(results, dto.ResultsPositionResponse{
			PositionID:        position.ID,
			Name:              position.Name,
			TotalVotesPositon: position.TotalVotesPositon,
			ValidPercentage:   int(position.ValidPercentage * 100),
		})
	}

	return results, nil
}

func (s *resultServiceImpl) GetResultsByPosition(positionID string) ([]dto.CandidateResultResponse, error) {
	var candidates []models.Candidate

	// Obtener candidatos de una posición específica
	if err := s.db.Preload("Position").Preload("Image").
		Where("position_id = ?", positionID).
		Find(&candidates).Error; err != nil {
		return nil, err
	}

	var results []dto.CandidateResultResponse

	for _, candidate := range candidates {
		// Sumar votos
		var totalVotes int64
		s.db.Model(&models.Vote{}).
			Where("candidate_id = ?", candidate.ID).
			Select("COALESCE(SUM(total_votes), 0)").
			Scan(&totalVotes)

		result := dto.CandidateResultResponse{
			CandidateID:   candidate.ID,
			CandidateName: candidate.Name,
			TotalVotes:    int(totalVotes),
		}

		if candidate.Position != nil {
			result.PositionID = &candidate.Position.ID
			result.PositionName = &candidate.Position.Name
		}

		if candidate.Image != nil {
			result.ImageId = candidate.Image.ID
		}

		results = append(results, result)
	}

	return results, nil
}
