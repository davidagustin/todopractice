package database

import (
	"fmt"
	"todoapp-backend/internal/config"
	"todoapp-backend/pkg/models"

	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Database struct {
	DB     *gorm.DB
	logger *zap.Logger
}

// NewDatabase creates a new database connection
func NewDatabase(cfg *config.Config, logger *zap.Logger) (*Database, error) {
	db, err := gorm.Open(postgres.Open(cfg.GetDatabaseURL()), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Set connection pool settings
	sqlDB, err := db.DB()
	if err != nil {
		return nil, fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)

	return &Database{
		DB:     db,
		logger: logger,
	}, nil
}

// NewTestDatabase creates a new in-memory SQLite database for testing
func NewTestDatabase(logger *zap.Logger) (*Database, error) {
	db, err := gorm.Open(postgres.Open("host=localhost port=5432 user=test password=test dbname=test_todoapp sslmode=disable"), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to test database: %w", err)
	}

	return &Database{
		DB:     db,
		logger: logger,
	}, nil
}

// Migrate runs database migrations
func (d *Database) Migrate() error {
	d.logger.Info("Running database migrations")

	err := d.DB.AutoMigrate(
		&models.User{},
		&models.Todo{},
	)
	if err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	d.logger.Info("Database migrations completed successfully")
	return nil
}

// Close closes the database connection
func (d *Database) Close() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}
	return sqlDB.Close()
}

// Health checks if the database connection is healthy
func (d *Database) Health() error {
	sqlDB, err := d.DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %w", err)
	}
	return sqlDB.Ping()
}
