package config

import (
	"os"
)

type Config struct {
	DatabaseURL string
	GitHubToken string
	JWTSecret   string
	Port        string
}

func Load() *Config {
	return &Config{
		DatabaseURL: getEnv("DATABASE_URL", "host=localhost port=5434 user=portfolio_user password=portfolio_password dbname=portfolio sslmode=disable"),
		GitHubToken: getEnv("GITHUB_TOKEN", ""),
		JWTSecret:   getEnv("JWT_SECRET", "your-secret-key"),
		Port:        getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
