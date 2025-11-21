package seed

import (
	"server/internal/models"
	"server/pkgs/security"

	"gorm.io/gorm"
)

func SeedAll(db *gorm.DB) error {
	if err := seedAdmin(db); err != nil {
		return err
	}
	return nil
}

func seedAdmin(db *gorm.DB) error {
	argon := security.NewArgon2Service()
	hashedPassword, err := argon.HashPassword("admin123")
	if err != nil {
		return err
	}

	admin := models.User{
		Name:     "Administrador",
		Email:    "admin@votos.com",
		Password: hashedPassword,
		Rol:      "ADMIN",
	}
	return db.Create(&admin).Error
}
