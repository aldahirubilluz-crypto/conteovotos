package services

import (
	"errors"
	"fmt"
	"server/internal/dto"
	"server/internal/models"

	"gorm.io/gorm"
)

type VoteService interface {
	Create(req dto.CreateVoteRequest, userID, userRole string) (*dto.VoteResponse, error)
	GetAll() ([]dto.VoteResponse, error)
	GetByCandidate(candidateID string) ([]dto.VoteResponse, error)
}

type voteServiceImpl struct {
	db *gorm.DB
}

func NewVoteService(db *gorm.DB) VoteService {
	return &voteServiceImpl{db: db}
}

func (s *voteServiceImpl) GetAll() ([]dto.VoteResponse, error) {
	var votes []models.Vote

	if err := s.db.Preload("Candidate.Position").Find(&votes).Error; err != nil {
		return nil, err
	}

	res := make([]dto.VoteResponse, len(votes))

	for i, v := range votes {
		item := dto.VoteResponse{
			ID:            v.ID,
			Mesa:          v.Mesa,
			CandidateID:   v.CandidateID,
			CandidateName: v.Candidate.Name,
			TotalVotes:    v.Vote,
			TypeVote:      string(v.TypeVote),
		}

		if v.Candidate.Position != nil {
			item.Position = dto.PositionSimple{
				ID:           v.Candidate.Position.ID,
				Name:         v.Candidate.Position.Name,
				TypePosition: string(v.Candidate.Position.TypePosition),
			}
		}

		res[i] = item
	}

	return res, nil
}

func (s *voteServiceImpl) GetByCandidate(candidateID string) ([]dto.VoteResponse, error) {
	var votes []models.Vote

	if err := s.db.Preload("Candidate.Position").
		Where("candidate_id = ?", candidateID).
		Find(&votes).Error; err != nil {
		return nil, err
	}

	res := make([]dto.VoteResponse, len(votes))

	for i, v := range votes {
		item := dto.VoteResponse{
			ID:            v.ID,
			Mesa:          v.Mesa,
			CandidateID:   v.CandidateID,
			CandidateName: v.Candidate.Name,
			TotalVotes:    v.Vote,
			TypeVote:      string(v.TypeVote),
		}

		if v.Candidate.Position != nil {
			item.Position = dto.PositionSimple{
				ID:           v.Candidate.Position.ID,
				Name:         v.Candidate.Position.Name,
				TypePosition: string(v.Candidate.Position.TypePosition),
			}
		}

		res[i] = item
	}

	return res, nil
}

func (s *voteServiceImpl) Create(req dto.CreateVoteRequest, userID, userRole string) (*dto.VoteResponse, error) {
	if userRole != "ADMIN" {
		return nil, ErrUnauthorized
	}

	if req.Mesa == "" {
		return nil, fmt.Errorf("nombre de la mesa obligatorio")
	}

	if req.TotalVotes < 0 {
		return nil, ErrInvalidVoteCount
	}

	validTypes := map[models.TypeVote]bool{
		models.TVpersonal: true,
		models.TVpublico:  true,
	}

	tv := models.TypeVote(req.TypeVote)

	if !validTypes[tv] {
		return nil, fmt.Errorf("typeVote inválido: debe ser PERSONAL o PUBLICO")
	}

	var candidate models.Candidate
	if err := s.db.First(&candidate, "id = ?", req.CandidateID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrCandidateNotFound
		}
		return nil, err
	}

	var existingVote models.Vote
	err := s.db.Where("mesa = ? AND candidate_id = ?", req.Mesa, req.CandidateID).
		First(&existingVote).Error

	if err == nil {
		return nil, ErrDuplicateVote
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	vote := models.Vote{
		Mesa:        req.Mesa,
		CandidateID: req.CandidateID,
		TypeVote:    tv,
		Vote:        req.TotalVotes,
	}

	if err := s.db.Create(&vote).Error; err != nil {
		return nil, err
	}

	if err := s.db.Preload("Candidate.Position").
		First(&vote, "id = ?", vote.ID).Error; err != nil {
		return nil, err
	}

	resp := dto.VoteResponse{
		ID:            vote.ID,
		Mesa:          vote.Mesa,
		CandidateID:   vote.CandidateID,
		CandidateName: vote.Candidate.Name,
		TotalVotes:    vote.Vote,
		TypeVote:      string(vote.TypeVote),
	}

	if vote.Candidate.Position != nil {
		resp.Position = dto.PositionSimple{
			ID:           vote.Candidate.Position.ID,
			Name:         vote.Candidate.Position.Name,
			TypePosition: string(vote.Candidate.Position.TypePosition),
		}
	}

	return &resp, nil
}
