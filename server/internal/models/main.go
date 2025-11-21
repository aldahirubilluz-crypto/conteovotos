package models

import (
	"time"
)

// ======= ENUMS =======
type Rol string

const (
	RolAdmin               Rol = "ADMIN"
	RolPollingStationChief Rol = "POLLING_STATION_CHIEF"
	RolMesaDePartes        Rol = "MESADEPARTES"
)

// ======= BASE MODEL =======
type Base struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

// =====================
// USUARIO
// =====================
type User struct {
	Base
	Name     string  `gorm:"type:varchar(120);not null"`
	Email    string  `gorm:"uniqueIndex;not null"`
	Password string  `gorm:"type:varchar(255)"`
	ImageURL *string `gorm:"type:varchar(500)"`
	Rol      Rol     `gorm:"type:varchar(30);default:'MESADEPARTES'"`
	IsActive bool    `gorm:"default:true"`
	HasVoted bool    `gorm:"default:false"` // Para jefes de mesa

	// Relación con mesas asignadas
	Mesas       []Mesa  `gorm:"foreignKey:AssignedToID"`
	CreatedByID *string `gorm:"type:uuid;index"`
	CreatedBy   *User   `gorm:"foreignKey:CreatedByID;constraint:OnDelete:SET NULL"`
}

// =====================
// LOGIN SOCIAL
// =====================
type Account struct {
	ID                string `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID            string `gorm:"type:uuid;not null"`
	Type              string
	Provider          string
	ProviderAccountID string
	RefreshToken      *string `gorm:"type:text"`
	AccessToken       *string `gorm:"type:text"`
	ExpiresAt         *int
	TokenType         *string
	Scope             *string
	IDToken           *string `gorm:"type:text"`
	SessionState      *string
	User              User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

// =====================
// MESAS
// =====================
type Mesa struct {
	Base
	Code         string `gorm:"uniqueIndex;not null"`
	AssignedToID *string
	AssignedTo   *User `gorm:"foreignKey:AssignedToID;constraint:OnDelete:SET NULL"`
	HasVote      bool  `gorm:"default:false"` // Para saber si el jefe de mesa ya votó
}

// =====================
// CANDIDATOS
// =====================
type Candidate struct {
	Base
	Name        string `gorm:"type:varchar(120);not null"`
	Description string `gorm:"type:text"`
	ImageURL    string `gorm:"type:varchar(500)"`
	Party       string `gorm:"type:varchar(120)"`
	IsActive    bool   `gorm:"default:true"`
	Position    string `gorm:"type:varchar(120)"` // Cargo al que postula
	Order       int    `gorm:"default:0"`         // Orden de aparición en la boleta
}

// =====================
// VOTOS
// =====================
type Vote struct {
	Base
	MesaID      string    `gorm:"type:uuid;not null"`
	Mesa        Mesa      `gorm:"foreignKey:MesaID;constraint:OnDelete:CASCADE"`
	CandidateID string    `gorm:"type:uuid;not null"`
	Candidate   Candidate `gorm:"foreignKey:CandidateID;constraint:OnDelete:CASCADE"`
	TotalVotes  int       `gorm:"not null;default:0"`
	ActaID      *string
	Acta        *Document `gorm:"foreignKey:ActaID;constraint:OnDelete:SET NULL"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
}

// =====================
// DOCUMENTOS (ACTA PDF)
// =====================
type Document struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string    `gorm:"type:varchar(255);not null"`
	FilePath  string    `gorm:"type:varchar(500);not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}
