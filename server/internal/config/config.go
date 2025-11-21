package config

import (
	"os"
	"sync"
)

type AppConfig struct {
	ServerPort string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	DBSSLMode  string
	JWTSecret  string
}

var (
	cfg  *AppConfig
	once sync.Once
)

func LoadConfig() {
	once.Do(func() {
		cfg = &AppConfig{
			ServerPort: getEnv("SERVER_PORT", "8080"),
			DBHost:     getEnv("DB_HOST", "localhost"),
			DBPort:     getEnv("DB_PORT", "5432"),
			DBUser:     getEnv("DB_USER", "postgres"),
			DBPassword: getEnv("DB_PASSWORD", ""),
			DBName:     getEnv("DB_NAME", "votaciones"),
			DBSSLMode:  getEnv("DB_SSLMODE", "disable"),
			JWTSecret:  getEnv("JWT_SECRET", "mydefaultsecret"),
		}
	})
}

func GetConfig() *AppConfig {
	if cfg == nil {
		LoadConfig()
	}
	return cfg
}

func getEnv(key, defaultValue string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return defaultValue
}
