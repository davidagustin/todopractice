package unit

import (
	"testing"
	"time"
	"todoapp-backend/internal/config"
	"todoapp-backend/pkg/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestJWTUtil_GenerateToken(t *testing.T) {
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "test-secret",
			ExpiryHour: 24,
		},
	}

	jwtUtil := utils.NewJWTUtil(cfg)
	token, err := jwtUtil.GenerateToken(1, "test@example.com")

	require.NoError(t, err)
	assert.NotEmpty(t, token)
}

func TestJWTUtil_ValidateToken(t *testing.T) {
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "test-secret",
			ExpiryHour: 24,
		},
	}

	jwtUtil := utils.NewJWTUtil(cfg)

	// Generate a token
	token, err := jwtUtil.GenerateToken(1, "test@example.com")
	require.NoError(t, err)

	// Validate the token
	claims, err := jwtUtil.ValidateToken(token)
	require.NoError(t, err)
	require.NotNil(t, claims)

	assert.Equal(t, uint(1), claims.UserID)
	assert.Equal(t, "test@example.com", claims.Email)
	assert.True(t, claims.ExpiresAt.After(time.Now()))
}

func TestJWTUtil_ValidateToken_Invalid(t *testing.T) {
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "test-secret",
			ExpiryHour: 24,
		},
	}

	jwtUtil := utils.NewJWTUtil(cfg)

	// Test with invalid token
	claims, err := jwtUtil.ValidateToken("invalid-token")
	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestJWTUtil_ValidateToken_WrongSecret(t *testing.T) {
	cfg1 := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "secret1",
			ExpiryHour: 24,
		},
	}

	cfg2 := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "secret2",
			ExpiryHour: 24,
		},
	}

	jwtUtil1 := utils.NewJWTUtil(cfg1)
	jwtUtil2 := utils.NewJWTUtil(cfg2)

	// Generate token with first secret
	token, err := jwtUtil1.GenerateToken(1, "test@example.com")
	require.NoError(t, err)

	// Try to validate with second secret
	claims, err := jwtUtil2.ValidateToken(token)
	assert.Error(t, err)
	assert.Nil(t, claims)
}

func TestJWTUtil_RefreshToken(t *testing.T) {
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "test-secret",
			ExpiryHour: 24,
		},
	}

	jwtUtil := utils.NewJWTUtil(cfg)

	// Generate original token
	originalToken, err := jwtUtil.GenerateToken(1, "test@example.com")
	require.NoError(t, err)

	// Add a small delay to ensure different timestamps
	time.Sleep(time.Millisecond * 10)

	// Refresh the token
	newToken, err := jwtUtil.RefreshToken(originalToken)
	require.NoError(t, err)
	assert.NotEmpty(t, newToken)

	// Validate the new token
	claims, err := jwtUtil.ValidateToken(newToken)
	require.NoError(t, err)
	assert.Equal(t, uint(1), claims.UserID)
	assert.Equal(t, "test@example.com", claims.Email)
}
