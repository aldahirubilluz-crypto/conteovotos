package dto

type CreatePositionRequest struct {
	Name        string  `json:"name" validate:"required"` // Nombre del puesto
	Description *string `json:"description,omitempty"`    // Descripción opcional
	IsActive    *bool   `json:"isActive,omitempty"`       // Activo o no (opcional, default true)
}

type UpdatePositionRequest struct {
	Name        *string `json:"name,omitempty"`        // Nombre (opcional)
	Description *string `json:"description,omitempty"` // Descripción (opcional)
	IsActive    *bool   `json:"isActive,omitempty"`    // Activo o no (opcional)
}

type PositionResponse struct {
	ID          string  `json:"id"`          // UUID del puesto
	Name        string  `json:"name"`        // Nombre
	Description *string `json:"description"` // Descripción
	IsActive    bool    `json:"isActive"`    // Activo o no
	CreatedAt   string  `json:"createdAt"`   // Fecha de creación
	UpdatedAt   string  `json:"updatedAt"`   // Fecha de actualización
}
