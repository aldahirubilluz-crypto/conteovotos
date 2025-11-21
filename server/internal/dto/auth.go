package dto

type UserResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	IsActive bool   `json:"isActive"`
	HasVoted bool   `json:"hasVoted"`
}

type UserOneResponse struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Email     string  `json:"email"`
	Role      string  `json:"role"`
	IsActive  bool    `json:"isActive"`
	HasVoted bool   `json:"hasVoted"`
	CreatedBy string  `json:"createdBy"`
	CreatedAt string  `json:"createdAt"`
}



type SignupRequest struct {
	Email    string  `json:"email"`
	Name     *string `json:"name"`
	Password string  `json:"password"`
	Provider string  `json:"provider"`
}

type SigninRequest struct {
	Email    string  `json:"email"`
	Password string  `json:"password"`
	Provider *string `json:"provider,omitempty"`
}

type AuthResponse struct {
	ID     string  `json:"id"`
	Email  string  `json:"email"`
	Name   *string `json:"name"`
	Role   string  `json:"role"`
	Token  string  `json:"token"`
}

type CreateUserRequest struct {
	Name   *string `json:"name"`
	Email  string  `json:"email" validate:"required,email"`
}

type CreateUserResponse struct {
	ID                string  `json:"id"`
	Name              string  `json:"name"`
	Email             string  `json:"email"`
	Role              string  `json:"role"`
	GeneratedPassword *string `json:"generatedPassword"`
}


type UpdateUserRequest struct {
	Name     *string `json:"name,omitempty"`
	Email    *string `json:"email,omitempty"`
	IsActive *bool   `json:"isActive,omitempty"`
}
