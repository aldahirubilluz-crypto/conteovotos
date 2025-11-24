package services

import (
	"errors"
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

type VoteService interface {
	Create(req dto.CreateVoteRequest, userID, userRole string) (*dto.VoteResponse, error)
	GetAll(userID, userRole string) ([]dto.VoteResponse, error)
	GetOne(id, userID, userRole string) (*dto.VoteResponse, error)
	Update(id string, req dto.UpdateVoteRequest, userID, userRole string) (*dto.VoteResponse, error)
	Delete(id, userID, userRole string) error
	GetByMesa(mesa, userID, userRole string) ([]dto.VoteResponse, error)
	GetByCandidate(candidateID, userID, userRole string) ([]dto.VoteResponse, error)
}

type voteServiceImpl struct {
	db *gorm.DB
}

func NewVoteService(db *gorm.DB) VoteService {
	return &voteServiceImpl{db: db}
}

func (s *voteServiceImpl) Create(req dto.CreateVoteRequest, userID, userRole string) (*dto.VoteResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorized
	}

	// Validar que el número de votos no sea negativo
	if req.TotalVotes < 0 {
		return nil, ErrInvalidVoteCount
	}

	// Validar que el candidato existe
	var candidate models.Candidate
	if err := s.db.First(&candidate, "id = ?", req.CandidateID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCandidateNotFound
		}
		return nil, err
	}

	// Verificar que no exista ya un voto para este candidato en esta mesa
	var existingVote models.Vote
	err := s.db.Where("mesa = ? AND candidate_id = ?", req.Mesa, req.CandidateID).
		First(&existingVote).Error

	if err == nil {
		// Ya existe un voto, retornar error
		return nil, ErrDuplicateVote
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		// Error diferente a "no encontrado"
		return nil, err
	}

	// Crear el voto
	vote := models.Vote{
		Mesa:        req.Mesa,
		CandidateID: req.CandidateID,
		TotalVotes:  req.TotalVotes,
	}

	if err := s.db.Create(&vote).Error; err != nil {
		return nil, err
	}

	// Precargar candidato para la respuesta
	if err := s.db.Preload("Candidate").First(&vote, "id = ?", vote.ID).Error; err != nil {
		return nil, err
	}

	return &dto.VoteResponse{
		ID:            vote.ID,
		Mesa:          vote.Mesa,
		CandidateID:   vote.CandidateID,
		CandidateName: vote.Candidate.Name,
		TotalVotes:    vote.TotalVotes,
	}, nil
}

func (s *voteServiceImpl) GetAll(userID, userRole string) ([]dto.VoteResponse, error) {
	var votes []models.Vote
	if err := s.db.Preload("Candidate").Find(&votes).Error; err != nil {
		return nil, err
	}

	res := make([]dto.VoteResponse, len(votes))
	for i, v := range votes {
		res[i] = dto.VoteResponse{
			ID:            v.ID,
			Mesa:          v.Mesa,
			CandidateID:   v.CandidateID,
			CandidateName: v.Candidate.Name,
			TotalVotes:    v.TotalVotes,
		}
	}
	return res, nil
}

func (s *voteServiceImpl) GetOne(id, userID, userRole string) (*dto.VoteResponse, error) {
	var vote models.Vote
	if err := s.db.Preload("Candidate").First(&vote, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrVoteNotFound
		}
		return nil, err
	}

	return &dto.VoteResponse{
		ID:            vote.ID,
		Mesa:          vote.Mesa,
		CandidateID:   vote.CandidateID,
		CandidateName: vote.Candidate.Name,
		TotalVotes:    vote.TotalVotes,
	}, nil
}

func (s *voteServiceImpl) Update(id string, req dto.UpdateVoteRequest, userID, userRole string) (*dto.VoteResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorized
	}

	var vote models.Vote
	if err := s.db.First(&vote, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrVoteNotFound
		}
		return nil, err
	}

	if req.TotalVotes != nil {
		if *req.TotalVotes < 0 {
			return nil, ErrInvalidVoteCount
		}
		vote.TotalVotes = *req.TotalVotes
	}

	if err := s.db.Save(&vote).Error; err != nil {
		return nil, err
	}

	// Precargar el candidato para la respuesta
	if err := s.db.Preload("Candidate").First(&vote, "id = ?", id).Error; err != nil {
		return nil, err
	}

	return &dto.VoteResponse{
		ID:            vote.ID,
		Mesa:          vote.Mesa,
		CandidateID:   vote.CandidateID,
		CandidateName: vote.Candidate.Name,
		TotalVotes:    vote.TotalVotes,
	}, nil
}

func (s *voteServiceImpl) Delete(id, userID, userRole string) error {
	if userRole != "ADMIN" {
		return ErrUnauthorized
	}

	result := s.db.Delete(&models.Vote{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return ErrVoteNotFound
	}
	return nil
}

func (s *voteServiceImpl) GetByMesa(mesa, userID, userRole string) ([]dto.VoteResponse, error) {
	var votes []models.Vote
	if err := s.db.Preload("Candidate").Where("mesa = ?", mesa).Find(&votes).Error; err != nil {
		return nil, err
	}

	res := make([]dto.VoteResponse, len(votes))
	for i, v := range votes {
		res[i] = dto.VoteResponse{
			ID:            v.ID,
			Mesa:          v.Mesa,
			CandidateID:   v.CandidateID,
			CandidateName: v.Candidate.Name,
			TotalVotes:    v.TotalVotes,
		}
	}
	return res, nil
}

func (s *voteServiceImpl) GetByCandidate(candidateID, userID, userRole string) ([]dto.VoteResponse, error) {
	var votes []models.Vote
	if err := s.db.Preload("Candidate").Where("candidate_id = ?", candidateID).Find(&votes).Error; err != nil {
		return nil, err
	}

	res := make([]dto.VoteResponse, len(votes))
	for i, v := range votes {
		res[i] = dto.VoteResponse{
			ID:            v.ID,
			Mesa:          v.Mesa,
			CandidateID:   v.CandidateID,
			CandidateName: v.Candidate.Name,
			TotalVotes:    v.TotalVotes,
		}
	}
	return res, nil
}
