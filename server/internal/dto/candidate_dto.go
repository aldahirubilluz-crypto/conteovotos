package dto

import "server/internal/models"

type CreateCandidateRequest struct {
	Name          string                `json:"name" validate:"required"`
	Description   *string               `json:"description,omitempty"`
	ImageID       string                `json:"imageId,omitempty"`
	IsActive      *bool                 `json:"isActive,omitempty"`
	PositionID    string                `json:"positionId,omitempty"`
	TypeCandidate models.TypeCandidates `json:"typeCandidate" validate:"required"`
}

type UpdateCandidateRequest struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	ImageID     *string `json:"imageId,omitempty"`
	IsActive    *bool   `json:"isActive,omitempty"`
	PositionID  *string `json:"positionId,omitempty"`
}

type CandidateResponse struct {
	ID            string                `json:"id"`
	Name          string                `json:"name"`
	Description   *string               `json:"description,omitempty"`
	ImageURL      string                `json:"imageUrl,omitempty"`
	ImageID       *string               `json:"imageId,omitempty"`
	IsActive      bool                  `json:"isActive"`
	TypeCandidate models.TypeCandidates `json:"typeCandidate"`

	Position PositionSimple `json:"position,omitempty"`
}

type PositionSimple struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	TypePosition string `json:"typePosition"`
}
