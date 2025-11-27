// server/internal/services/result_service.go
package services

import (
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

type ResultService interface {
	GetAllResults() ([]dto.CandidateResultResponse, error)
	GetResultsSummary() (*dto.ResultsSummaryResponse, error)
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

func (s *resultServiceImpl) GetResultsSummary() (*dto.ResultsSummaryResponse, error) {
	results, err := s.GetAllResults()
	if err != nil {
		return nil, err
	}

	// Calcular totales
	totalVotes := 0
	for _, result := range results {
		totalVotes += result.TotalVotes
	}

	return &dto.ResultsSummaryResponse{
		TotalCandidates: len(results),
		TotalVotes:      totalVotes,
		Results:         results,
	}, nil
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
