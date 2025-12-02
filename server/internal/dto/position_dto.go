package dto

type CreatePositionRequest struct {
	Name            string  `json:"name" validate:"required"`
	Description     *string `json:"description,omitempty"`
	TypePosition    string  `json:"typePosition" validate:"required"`
	TotalVotes      int     `json:"totalVotes" validate:"required,min=0"`
	ValidPercentage float64 `json:"validPercentage" validate:"required,gte=0,lte=1"`
}

type UpdatePositionRequest struct {
	Name            *string  `json:"name,omitempty"`
	Description     *string  `json:"description,omitempty"`
	TypePosition    *string  `json:"typePosition,omitempty" validate:"omitempty,oneof=AUTORIDAD ORGANO"`
	TotalVotes      *int     `json:"totalVotes,omitempty" validate:"omitempty,min=0"`
	ValidPercentage *float64 `json:"validPercentage,omitempty" validate:"omitempty,gte=0,lte=1"`
}

type PositionResponse struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`
	Description     *string `json:"description"`
	TypePosition    string  `json:"typePosition"`
	TotalVotes      int     `json:"totalVotes"`
	ValidPercentage float64 `json:"validPercentage"`
	CreatedAt       string  `json:"createdAt"`
	UpdatedAt       string  `json:"updatedAt"`
}
