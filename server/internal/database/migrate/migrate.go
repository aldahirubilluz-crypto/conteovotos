package migrate

import (
	"flag"
	"fmt"

	"server/internal/config"
	"server/internal/models"
	"server/pkgs/logger"

	"gorm.io/gorm"
)

// ===== ORDEN DE MIGRACIÓN =====
// Aquí defines qué tablas se crean primero (padres → hijos)
func modelOrderUp() []any {
	return []any{
		&models.User{},
		&models.Account{},
		&models.Candidate{},
		&models.Position{},
		&models.Vote{},
		&models.Image{},
	}
}

// Orden inverso para eliminar tablas correctamente
func modelOrderDown() []any {
	return []any{
		&models.User{},
		&models.Account{},
		&models.Candidate{},
		&models.Position{},
		&models.Vote{},
		&models.Image{},
	}
}


func migrateUp(db *gorm.DB) error {
	if err := db.Exec(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`).Error; err != nil {
		return fmt.Errorf("no se pudo habilitar pgcrypto: %w", err)
	}

	for _, m := range modelOrderUp() {
		if err := db.AutoMigrate(m); err != nil {
			return fmt.Errorf("AutoMigrate %T: %w", m, err)
		}
	}
	logger.Log.Info("Migración UP completada ✅")
	return nil
}

func migrateDown(db *gorm.DB) error {
	for _, m := range modelOrderDown() {
		if db.Migrator().HasTable(m) {
			if err := db.Migrator().DropTable(m); err != nil {
				return fmt.Errorf("DropTable %T: %w", m, err)
			}
		}
	}
	logger.Log.Info("Migración DOWN completada 🗑️")
	return nil
}

func migrateReset(db *gorm.DB) error {
	if err := migrateDown(db); err != nil {
		return err
	}
	if err := migrateUp(db); err != nil {
		return err
	}
	logger.Log.Info("Reset completado 🔁")
	return nil
}


func HandleMigration() {
	cmd := flag.String("cmd", "up", "Comando: up, down, reset")
	flag.Parse()

	db := config.DB

	commands := map[string]func(*gorm.DB) error{
		"up":    migrateUp,
		"down":  migrateDown,
		"reset": migrateReset,
	}

	action, ok := commands[*cmd]
	if !ok {
		logger.Log.Fatalf("Comando inválido. Usa: up, down, reset")
		return
	}

	if err := action(db); err != nil {
		logger.Log.Fatalf("Error en migración '%s': %v", *cmd, err)
	}
}
