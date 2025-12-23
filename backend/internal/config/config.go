package config

import (
	"os"
)

type Config struct {
	DatabaseURL    string
	GitHubToken    string
	GitHubUsername string
	JWTSecret      string
	Port           string
}

func Load() *Config {
	return &Config{
		DatabaseURL:    os.Getenv("DATABASE_URL"), // ❗ NO default
		GitHubToken:    os.Getenv("GITHUB_TOKEN"),
		GitHubUsername: getEnv("GITHUB_USERNAME", "mahakpatel"),
		JWTSecret:      getEnv("JWT_SECRET", "your-secret-key"),
		Port:           getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
