package database

import (
	"fmt"
	"log"

	"portfolio-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize(databaseURL string) (*gorm.DB, error) {
	// Use PostgreSQL
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection established")
	return db, nil
}

func Migrate(db *gorm.DB) error {
	err := db.AutoMigrate(
		&models.Portfolio{},
		&models.Skill{},
		&models.Experience{},
		&models.Certification{},
		&models.VolunteerExperience{},
		&models.Education{},
		&models.Publication{},
		&models.Project{},
		&models.ClientTestimonial{},
		&models.ContactMessage{},
		&models.CachedStats{},
		&models.Admin{},
		// Analytics models
		&models.Visitor{},
		&models.PageView{},
		&models.ActiveUser{},
	)
	if err != nil {
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	log.Println("Database migration completed")
	return nil
}
