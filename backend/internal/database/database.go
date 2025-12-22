package database

import (
	"fmt"
	"log"

	"portfolio-backend/internal/models"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func Initialize(databaseURL string) (*gorm.DB, error) {
	// Parse pgx config
	pgxConfig, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("failed to parse DATABASE_URL: %w", err)
	}

	// 🔒 FORCE SIMPLE PROTOCOL (NO PREPARED STATEMENTS EVER)
	pgxConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	// Create sql.DB using pgx
	sqlDB := stdlib.OpenDB(*pgxConfig)

	// Open GORM using sql.DB
	db, err := gorm.Open(
		postgres.New(postgres.Config{
			Conn: sqlDB,
		}),
		&gorm.Config{
			PrepareStmt: false,
			Logger:      logger.Default.LogMode(logger.Info),
		},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	log.Println("Database connection established (pgx simple protocol, no prepared statements)")
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
