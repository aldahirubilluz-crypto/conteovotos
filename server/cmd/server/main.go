// server/cmd/server/main.go
package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"

	"server/internal/config"
	"server/internal/database/seed"
	"server/internal/middlewares"
	"server/internal/models"
	"server/internal/routes"
	"server/pkgs/fileupload"
	"server/pkgs/logger"
	"server/pkgs/validator"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  No se encontró archivo .env, usando variables del sistema.")
	}

	logger.InitLogger()
	logger.Log.Info("🚀 Iniciando servidor...")

	if err := fileupload.InitUploadDir(); err != nil {
		logger.Log.Fatalf("❌ Error inicializando directorio uploads: %v", err)
	}
	logger.Log.Info("📁 Directorio uploads inicializado")

	config.LoadConfig()

	wasCreated, wasReset, err := initDatabase()
	if err != nil {
		logger.Log.Fatalf("❌ Error al inicializar la base de datos: %v", err)
	}

	if wasCreated {
		logger.Log.Info("🆕 Base de datos creada y lista")
	} else if wasReset {
		logger.Log.Info("🔄 Base de datos reseteada y lista")
	} else {
		logger.Log.Info("📦 Base de datos existente, conectada correctamente")
	}

	if err := validator.InitValidator(); err != nil {
		logger.Log.Fatalf("❌ Error al inicializar el validador: %v", err)
	}

	app := fiber.New(fiber.Config{
		AppName:      "Inventario Server",
		ErrorHandler: middlewares.JSONErrorHandler,
		BodyLimit:    10 * 1024 * 1024,
	})

	app.Use(middlewares.CORSMiddleware())
	app.Use(middlewares.LoggerMiddleware())

	routes.RegisterRoutes(app, config.DB)

	logger.Log.Info("📋 Rutas registradas:")
	allRoutes := app.GetRoutes()
	if len(allRoutes) == 0 {
		logger.Log.Error("⚠️  NO SE REGISTRÓ NINGUNA RUTA")
	} else {
		for _, route := range allRoutes {
			logger.Log.Infof("  %s %s", route.Method, route.Path)
		}
	}

	port := config.GetConfig().ServerPort
	if port == "" {
		port = "8080"
	}

	logger.Log.Infof("✅ Servidor escuchando en http://localhost:%s", port)
	if err := app.Listen(":" + port); err != nil {
		logger.Log.Fatalf("❌ Error al iniciar el servidor: %v", err)
	}
}

func initDatabase() (wasCreated bool, wasReset bool, err error) {
	cfg := config.GetConfig()

	dsnSuper := fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=%s",
		cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBPort, cfg.DBSSLMode,
	)
	superDB, err := config.SqlConnect(dsnSuper)
	if err != nil {
		return false, false, fmt.Errorf("error conectando al servidor PostgreSQL: %w", err)
	}
	defer superDB.Close()

	var exists bool
	checkQuery := fmt.Sprintf("SELECT 1 FROM pg_database WHERE datname = '%s';", cfg.DBName)
	err = superDB.QueryRow(checkQuery).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		return false, false, fmt.Errorf("error verificando existencia de base de datos: %w", err)
	}

	resetDB := os.Getenv("RESET_DB") == "true"

	if !exists || resetDB {
		if exists && resetDB {
			logger.Log.Info("🔄 RESET_DB=true detectado. Eliminando base de datos existente...")
			_, err = superDB.Exec("DROP DATABASE " + cfg.DBName)
			if err != nil {
				return false, false, fmt.Errorf("error eliminando base de datos existente: %w", err)
			}
			logger.Log.Info("🗑️ Base de datos eliminada correctamente")
			wasReset = true
		}

		_, err = superDB.Exec("CREATE DATABASE " + cfg.DBName)
		if err != nil {
			return false, false, fmt.Errorf("error creando base de datos: %w", err)
		}
		logger.Log.Infof("🆕 Base de datos %s creada correctamente", cfg.DBName)
		wasCreated = true
	}

	if err := config.ConnectDB(); err != nil {
		return wasCreated, wasReset, fmt.Errorf("error conectando a la base de datos: %w", err)
	}

	err = config.DB.AutoMigrate(
		&models.User{},
		&models.Account{},
		&models.Candidate{},
		&models.Position{},
		&models.Vote{},
		&models.Image{},
	)

	if err != nil {
		return wasCreated, wasReset, fmt.Errorf("error migrando tablas: %w", err)
	}
	logger.Log.Info("✅ Tablas migradas correctamente")

	var userCount int64
	config.DB.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		logger.Log.Info("🌱 Ejecutando seeding inicial...")
		if err := seed.SeedAll(config.DB); err != nil {
			return wasCreated, wasReset, fmt.Errorf("error en SeedAll: %w", err)
		}
		logger.Log.Info("✅ Seeding completo ✅")
	}

	return wasCreated, wasReset, nil
}
