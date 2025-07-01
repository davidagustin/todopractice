package unit

import (
	"testing"

	"todoapp-backend/internal/auth"
	"todoapp-backend/pkg/models"
	"todoapp-backend/pkg/utils"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Satisfies auth.UserRepository.
type MockUserRepo struct {
	mock.Mock
}

func (m *MockUserRepo) FindByEmail(email string) (*models.User, error) {
	args := m.Called(email)
	user, _ := args.Get(0).(*models.User)

	return user, args.Error(1)
}

func (m *MockUserRepo) Create(user *models.User) error {
	args := m.Called(user)

	return args.Error(0)
}

func (m *MockUserRepo) FindByID(id uint) (*models.User, error) {
	args := m.Called(id)
	user, _ := args.Get(0).(*models.User)

	return user, args.Error(1)
}

// Mock JWT utility.
type MockJWTUtil struct {
	mock.Mock
}

func (m *MockJWTUtil) GenerateToken(userID uint, email string) (string, error) {
	args := m.Called(userID, email)

	return args.String(0), args.Error(1)
}

func (m *MockJWTUtil) ValidateToken(tokenString string) (*utils.JWTClaims, error) {
	args := m.Called(tokenString)

	return args.Get(0).(*utils.JWTClaims), args.Error(1)
}

func (m *MockJWTUtil) RefreshToken(tokenString string) (string, error) {
	args := m.Called(tokenString)

	return args.String(0), args.Error(1)
}

func TestAuthService_Register(t *testing.T) {
	tests := []struct {
		name          string
		request       models.UserRegisterRequest
		setupMock     func(*MockUserRepo, *MockJWTUtil)
		expectedError bool
	}{
		{
			name: "successful registration",
			request: models.UserRegisterRequest{
				Email:    "test@example.com",
				Password: "password123",
				Name:     "Test User",
			},
			setupMock: func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {
				repo.On("FindByEmail", "test@example.com").Return(nil, auth.ErrUserNotFound)
				repo.On("Create", mock.AnythingOfType("*models.User")).Return(nil)
				jwtUtil.On("GenerateToken", mock.AnythingOfType("uint"), "test@example.com").Return("mock-token", nil)
			},
			expectedError: false,
		},
		{
			name: "user already exists",
			request: models.UserRegisterRequest{
				Email:    "existing@example.com",
				Password: "password123",
				Name:     "Test User",
			},
			setupMock: func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {
				repo.On("FindByEmail", "existing@example.com").Return(&models.User{Email: "existing@example.com"}, nil)
			},
			expectedError: true,
		},
		{
			name: "invalid email",
			request: models.UserRegisterRequest{
				Email:    "invalid-email",
				Password: "password123",
				Name:     "Test User",
			},
			setupMock:     func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {},
			expectedError: true,
		},
		{
			name: "password too short",
			request: models.UserRegisterRequest{
				Email:    "test@example.com",
				Password: "123",
				Name:     "Test User",
			},
			setupMock:     func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockUserRepo{}
			jwtUtil := &MockJWTUtil{}
			tt.setupMock(repo, jwtUtil)

			service := auth.NewService(repo, jwtUtil)

			user, token, err := service.Register(tt.request)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
				assert.Empty(t, token)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.NotEmpty(t, token)
				assert.Equal(t, tt.request.Email, user.Email)
				assert.Equal(t, tt.request.Name, user.Name)
			}

			repo.AssertExpectations(t)
			jwtUtil.AssertExpectations(t)
		})
	}
}

func TestAuthService_Login(t *testing.T) {
	tests := []struct {
		name          string
		request       models.UserLoginRequest
		setupMock     func(*MockUserRepo, *MockJWTUtil)
		expectedError bool
	}{
		{
			name: "successful login",
			request: models.UserLoginRequest{
				Email:    "test@example.com",
				Password: "password123",
			},
			setupMock: func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {
				// Create a user with properly hashed password
				user := &models.User{ID: 1, Email: "test@example.com", Name: "Test User"}
				user.Password = "password123"
				user.HashPassword()
				repo.On("FindByEmail", "test@example.com").Return(user, nil)
				jwtUtil.On("GenerateToken", uint(1), "test@example.com").Return("mock-token", nil)
			},
			expectedError: false,
		},
		{
			name: "user not found",
			request: models.UserLoginRequest{
				Email:    "nonexistent@example.com",
				Password: "password123",
			},
			setupMock: func(repo *MockUserRepo, jwtUtil *MockJWTUtil) {
				repo.On("FindByEmail", "nonexistent@example.com").Return(nil, auth.ErrUserNotFound)
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockUserRepo{}
			jwtUtil := &MockJWTUtil{}
			tt.setupMock(repo, jwtUtil)

			service := auth.NewService(repo, jwtUtil)

			user, token, err := service.Login(tt.request)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
				assert.Empty(t, token)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
				assert.NotEmpty(t, token)
			}

			repo.AssertExpectations(t)
			jwtUtil.AssertExpectations(t)
		})
	}
}

func TestAuthService_GetUserByID(t *testing.T) {
	tests := []struct {
		name          string
		userID        uint
		setupMock     func(*MockUserRepo)
		expectedError bool
	}{
		{
			name:   "successful profile retrieval",
			userID: 1,
			setupMock: func(repo *MockUserRepo) {
				repo.On("FindByID", uint(1)).Return(&models.User{ID: 1, Email: "test@example.com", Name: "Test User"}, nil)
			},
			expectedError: false,
		},
		{
			name:   "user not found",
			userID: 999,
			setupMock: func(repo *MockUserRepo) {
				repo.On("FindByID", uint(999)).Return(nil, auth.ErrUserNotFound)
			},
			expectedError: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := &MockUserRepo{}
			tt.setupMock(repo)

			service := auth.NewService(repo, &MockJWTUtil{})

			user, err := service.GetUserByID(tt.userID)

			if tt.expectedError {
				assert.Error(t, err)
				assert.Nil(t, user)
			} else {
				assert.NoError(t, err)
				assert.NotNil(t, user)
			}

			repo.AssertExpectations(t)
		})
	}
}
