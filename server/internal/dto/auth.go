package dto

type SigninRequest struct {
	Email    string  `json:"email"`    
	Password string  `json:"password"` 
	Provider *string `json:"provider,omitempty"` 
}

type AuthResponse struct {
	ID    string  `json:"id"`  
	Email string  `json:"email"`
	Name  *string `json:"name"` 
	Role  string  `json:"role"`
	Token string  `json:"token"`   
}
