package unit

import (
	"testing"

	"todoapp-backend/pkg/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestUser_HashPassword(t *testing.T) {
	user := &models.User{
		Password: "testpassword123",
	}

	err := user.HashPassword()
	require.NoError(t, err)
	assert.NotEqual(t, "testpassword123", user.Password)
	assert.NotEmpty(t, user.Password)
}

func TestUser_CheckPassword(t *testing.T) {
	user := &models.User{
		Password: "testpassword123",
	}

	err := user.HashPassword()
	require.NoError(t, err)

	// Test correct password
	assert.True(t, user.CheckPassword("testpassword123"))

	// Test incorrect password
	assert.False(t, user.CheckPassword("wrongpassword"))
}

func TestUser_ToResponse(t *testing.T) {
	user := &models.User{
		ID:       1,
		Email:    "test@example.com",
		Name:     "Test User",
		Password: "hashedpassword",
	}

	response := user.ToResponse()

	assert.Equal(t, uint(1), response.ID)
	assert.Equal(t, "test@example.com", response.Email)
	assert.Equal(t, "Test User", response.Name)
}

func TestTodo_ToResponse(t *testing.T) {
	todo := &models.Todo{
		ID:          1,
		Title:       "Test Todo",
		Description: "Test Description",
		Completed:   false,
		UserID:      1,
	}

	response := todo.ToResponse()

	assert.Equal(t, uint(1), response.ID)
	assert.Equal(t, "Test Todo", response.Title)
	assert.Equal(t, "Test Description", response.Description)
	assert.False(t, response.Completed)
	assert.Equal(t, uint(1), response.UserID)
}
