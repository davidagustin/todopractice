package unit

import (
	"os"
	"testing"

	"todoapp-backend/internal/config"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLoadConfig_Defaults(t *testing.T) {
	// Clear any existing environment variables
	os.Clearenv()

	// Change to backend directory to ensure config.yaml is found
	originalDir, err := os.Getwd()
	require.NoError(t, err)

	defer func() {
		chdirErr := os.Chdir(originalDir)
		if chdirErr != nil {
			t.Fatalf("Failed to change back to original directory: %v", chdirErr)
		}
	}()

	backendDir := "../../"
	err = os.Chdir(backendDir)
	require.NoError(t, err)

	cfg, err := config.LoadConfig()
	require.NoError(t, err)
	require.NotNil(t, cfg)

	// Test default values (from config.yaml)
	assert.Equal(t, "8080", cfg.Server.Port)
	assert.Equal(t, "0.0.0.0", cfg.Server.Host)
	assert.Equal(t, "postgres", cfg.Database.Driver)
	assert.Equal(t,
		"host=postgres port=5432 user=todouser password=todopassword dbname=todoapp sslmode=disable",
		cfg.Database.DSN,
	)
	assert.Equal(t, "localhost", cfg.Database.Host)
	assert.Equal(t, "5432", cfg.Database.Port)
	assert.Equal(t, "todouser", cfg.Database.User)
	assert.Equal(t, "todopassword", cfg.Database.Password)
	assert.Equal(t, "todoapp", cfg.Database.DBName)
	assert.Equal(t, "disable", cfg.Database.SSLMode)
	assert.Equal(t, "your-super-secret-jwt-key-change-this-in-production", cfg.JWT.Secret)
	assert.Equal(t, 24, cfg.JWT.ExpiryHour)
}

func TestLoadConfig_EnvironmentVariables(t *testing.T) {
	// Set environment variables
	os.Setenv("SERVER_PORT", "9000")
	os.Setenv("DATABASE_HOST", "testhost")
	os.Setenv("JWT_SECRET", "test-secret")

	defer os.Clearenv()

	cfg, err := config.LoadConfig()
	require.NoError(t, err)
	require.NotNil(t, cfg)

	// Test environment variable overrides
	assert.Equal(t, "9000", cfg.Server.Port)
	assert.Equal(t, "testhost", cfg.Database.Host)
	assert.Equal(t, "test-secret", cfg.JWT.Secret)
}

func TestConfig_GetDatabaseURL(t *testing.T) {
	t.Run("PostgreSQL", func(t *testing.T) {
		cfg := &config.Config{
			Database: config.DatabaseConfig{
				Driver:   "postgres",
				Host:     "localhost",
				Port:     "5432",
				User:     "testuser",
				Password: "testpass",
				DBName:   "testdb",
				SSLMode:  "disable",
			},
		}

		expected := "host=localhost port=5432 user=testuser password=testpass dbname=testdb sslmode=disable"
		actual := cfg.GetDatabaseURL()
		assert.Equal(t, expected, actual)
	})

	t.Run("SQLite", func(t *testing.T) {
		cfg := &config.Config{
			Database: config.DatabaseConfig{
				Driver: "sqlite",
				DSN:    "test.db",
			},
		}

		expected := "test.db"
		actual := cfg.GetDatabaseURL()
		assert.Equal(t, expected, actual)
	})
}
