// server/internal/dto/candidate_dto.go
package dto

type CreateCandidateRequest struct {
	Name        string  `json:"name" validate:"required"`
	Description *string `json:"description,omitempty"`
	ImageID     string  `json:"imageId,omitempty"` // ID de la imagen guardada
	Order       *int    `json:"order,omitempty"`
	IsActive    *bool   `json:"isActive,omitempty"`
	PositionID  string  `json:"positionId,omitempty"`
}

type UpdateCandidateRequest struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	ImageID     *string `json:"imageId,omitempty"`
	Order       *int    `json:"order,omitempty"`
	IsActive    *bool   `json:"isActive,omitempty"`
	PositionID  *string `json:"positionId,omitempty"`
}

type CandidateResponse struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Description *string         `json:"description,omitempty"`
	ImageURL    string          `json:"imageUrl,omitempty"` 
	ImageID     *string         `json:"imageId,omitempty"` 
	Order       int             `json:"order"`
	IsActive    bool            `json:"isActive"`
	Position    *PositionSimple `json:"position,omitempty"`
}

type PositionSimple struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type AssignPositionRequest struct {
	PositionID string `json:"positionId" validate:"required"`
}
