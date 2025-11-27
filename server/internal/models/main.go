package models

import (
	"time"
)

type Rol string

const (
	RolAdmin Rol = "ADMIN"
)

type Base struct {
	ID        string    `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
}

type User struct {
	Base
	Name     string `gorm:"type:varchar(120);not null"`
	Email    string `gorm:"uniqueIndex;not null"`
	Password string `gorm:"type:varchar(255)"`
	Rol      Rol    `gorm:"type:varchar(30);default:'ADMIN'"`
	IsActive bool   `gorm:"default:true"`
}

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

type Candidate struct {
	Base
	Name        string  `gorm:"type:varchar(120);not null"`
	Description *string `gorm:"type:text"`
	ImageID     *string `gorm:"type:uuid"`
	Image       *Image  `gorm:"foreignKey:ImageID;constraint:OnDelete:SET NULL"`
	IsActive    bool    `gorm:"default:true"`

	PositionID *string   `gorm:"type:uuid"`
	Position   *Position `gorm:"foreignKey:PositionID;constraint:OnDelete:SET NULL"`
}

type Image struct {
	Base
	Filename string `gorm:"type:varchar(255);not null"`
	Name     string `gorm:"type:varchar(255);not null"`
	URL      string `gorm:"type:varchar(500)"`
}

type Position struct {
	Base
	Name              string  `gorm:"type:varchar(255);not null;unique"`
	Description       *string `gorm:"type:text"`
	IsActive          bool    `gorm:"default:true"`
	TotalVotesPositon int     `gorm:"not null;default:0"`
	ValidPercentage   float64 `gorm:"not null;default:0"`

	Candidates []Candidate `gorm:"foreignKey:PositionID"`
}

type Vote struct {
	Base
	Mesa        string    `gorm:"type:varchar(120);not null"`
	CandidateID string    `gorm:"type:uuid;not null"`
	Candidate   Candidate `gorm:"foreignKey:CandidateID;constraint:OnDelete:CASCADE"`
	TotalVotes  int       `gorm:"not null;default:0"`
}
