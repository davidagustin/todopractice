package unit

import (
	"errors"
	"testing"
	"todoapp-backend/internal/todo"
	"todoapp-backend/pkg/models"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Helper functions for creating pointers
func stringPtr(s string) *string {
	return &s
}

func boolPtr(b bool) *bool {
	return &b
}

// Mock TodoRepository
// Satisfies todo.TodoRepository
type MockTodoRepo struct {
	mock.Mock
}

func (m *MockTodoRepo) Create(todo *models.Todo) error {
	args := m.Called(todo)
	return args.Error(0)
}

func (m *MockTodoRepo) FindByID(userID, todoID uint) (*models.Todo, error) {
	args := m.Called(userID, todoID)
	todo, _ := args.Get(0).(*models.Todo)
	return todo, args.Error(1)
}

func (m *MockTodoRepo) FindAll(userID uint) ([]models.Todo, error) {
	args := m.Called(userID)
	todos, _ := args.Get(0).([]models.Todo)
	return todos, args.Error(1)
}

func (m *MockTodoRepo) Update(todo *models.Todo, updates map[string]interface{}) error {
	args := m.Called(todo, updates)
	return args.Error(0)
}

func (m *MockTodoRepo) Delete(userID, todoID uint) (bool, error) {
	args := m.Called(userID, todoID)
	return args.Bool(0), args.Error(1)
}

func TestTodoService_Create(t *testing.T) {
	tests := []struct {
		name          string
		request       models.TodoCreateRequest
		userID        uint
		setupMock     func(*MockTodoRepo)
		expectedError bool
	}{
		{
			name: "successful todo creation",
			request: models.TodoCreateRequest{
				Title:       "Test Todo",
				Description: "Test Description",
			},
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("Create", mock.AnythingOfType("*models.Todo")).Return(nil)
			},
			expectedError: false,
		},
		{
			name: "empty title",
			request: models.TodoCreateRequest{
				Title:       "",
				Description: "Test Description",
			},
			userID:        1,
			setupMock:     func(repo *MockTodoRepo) {},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockTodoRepo{}
			tt.setupMock(repo)

			service := todo.NewService(repo)

			todoResp, err := service.Create(tt.userID, tt.request)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, todoResp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, todoResp)
				assert.Equal(t, tt.request.Title, todoResp.Title)
				assert.Equal(t, tt.request.Description, todoResp.Description)
				assert.Equal(t, tt.userID, todoResp.UserID)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTodoService_GetAll(t *testing.T) {
	tests := []struct {
		name          string
		userID        uint
		setupMock     func(*MockTodoRepo)
		expectedError bool
		expectedCount int
	}{
		{
			name:   "successful get all todos",
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindAll", uint(1)).Return([]models.Todo{}, nil)
			},
			expectedError: false,
			expectedCount: 0,
		},
		{
			name:   "database error",
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindAll", uint(1)).Return(nil, errors.New("db error"))
			},
			expectedError: true,
			expectedCount: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockTodoRepo{}
			tt.setupMock(repo)

			service := todo.NewService(repo)

			todos, err := service.GetAll(tt.userID)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, todos)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, todos)
				assert.Len(t, todos, tt.expectedCount)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTodoService_GetByID(t *testing.T) {
	tests := []struct {
		name          string
		todoID        uint
		userID        uint
		setupMock     func(*MockTodoRepo)
		expectedError bool
	}{
		{
			name:   "successful get todo by id",
			todoID: 1,
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindByID", uint(1), uint(1)).Return(&models.Todo{ID: 1, UserID: 1, Title: "Test Todo"}, nil)
			},
			expectedError: false,
		},
		{
			name:   "todo not found",
			todoID: 999,
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindByID", uint(1), uint(999)).Return(nil, todo.ErrTodoNotFound)
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockTodoRepo{}
			tt.setupMock(repo)

			service := todo.NewService(repo)

			todoResp, err := service.GetByID(tt.userID, tt.todoID)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, todoResp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, todoResp)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTodoService_Update(t *testing.T) {
	tests := []struct {
		name          string
		todoID        uint
		userID        uint
		request       models.TodoUpdateRequest
		setupMock     func(*MockTodoRepo)
		expectedError bool
	}{
		{
			name:   "successful todo update",
			todoID: 1,
			userID: 1,
			request: models.TodoUpdateRequest{
				Title:       stringPtr("Updated Todo"),
				Description: stringPtr("Updated Description"),
				Completed:   boolPtr(true),
			},
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindByID", uint(1), uint(1)).Return(&models.Todo{ID: 1, UserID: 1, Title: "Old Todo"}, nil)
				repo.On("Update", mock.AnythingOfType("*models.Todo"), mock.AnythingOfType("map[string]interface {}")).Return(nil)
			},
			expectedError: false,
		},
		{
			name:   "todo not found",
			todoID: 999,
			userID: 1,
			request: models.TodoUpdateRequest{
				Title: stringPtr("Updated Todo"),
			},
			setupMock: func(repo *MockTodoRepo) {
				repo.On("FindByID", uint(1), uint(999)).Return(nil, todo.ErrTodoNotFound)
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockTodoRepo{}
			tt.setupMock(repo)

			service := todo.NewService(repo)

			todoResp, err := service.Update(tt.userID, tt.todoID, tt.request)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, todoResp)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, todoResp)
			}

			repo.AssertExpectations(t)
		})
	}
}

func TestTodoService_Delete(t *testing.T) {
	tests := []struct {
		name          string
		todoID        uint
		userID        uint
		setupMock     func(*MockTodoRepo)
		expectedError bool
	}{
		{
			name:   "successful todo deletion",
			todoID: 1,
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("Delete", uint(1), uint(1)).Return(true, nil)
			},
			expectedError: false,
		},
		{
			name:   "todo not found",
			todoID: 999,
			userID: 1,
			setupMock: func(repo *MockTodoRepo) {
				repo.On("Delete", uint(1), uint(999)).Return(false, nil)
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockTodoRepo{}
			tt.setupMock(repo)

			service := todo.NewService(repo)

			err := service.Delete(tt.userID, tt.todoID)

			if tt.expectedError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}

			repo.AssertExpectations(t)
		})
	}
}
