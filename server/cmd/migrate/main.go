// cmd/migrate/main.go
package main

import (
	"log"
	"server/internal/config"
	"server/internal/database/migrate"
	"server/pkgs/fileupload"
	"server/pkgs/logger"

	"github.com/joho/godotenv"
)

func main() {
	logger.InitLogger()

	_ = godotenv.Load()
	config.LoadConfig()
	config.ConnectDB()

	if err := fileupload.InitUploadDir(); err != nil {
		log.Fatalf("❌ Error inicializando uploads: %v", err)
	}
	logger.Log.Info("✅ Directorio uploads inicializado")

	migrate.HandleMigration()
}
