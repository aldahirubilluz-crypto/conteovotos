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
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return nil
	}

	argon := security.NewArgon2Service()
	hashedPassword, err := argon.HashPassword("admin123")
	if err != nil {
		return err
	}

	admin := models.User{
		Name:     "Administrador1",
		Email:    "admin@votos.com",
		Password: hashedPassword,
		Rol:      "ADMIN",
	}
	return db.Create(&admin).Error
}
