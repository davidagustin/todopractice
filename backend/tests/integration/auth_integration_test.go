package integration

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"todoapp-backend/internal/auth"
	"todoapp-backend/internal/config"
	"todoapp-backend/pkg/middleware"
	"todoapp-backend/pkg/models"
	"todoapp-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)

	// Run migrations
	err = db.AutoMigrate(&models.User{})
	require.NoError(t, err)

	return db
}

func setupTestRouter(t *testing.T) *gin.Engine {
	db := setupTestDB(t)
	cfg := &config.Config{
		JWT: config.JWTConfig{
			Secret:     "test-secret-key",
			ExpiryHour: 24,
		},
	}

	logger, _ := zap.NewDevelopment()
	jwtUtil := utils.NewJWTUtil(cfg)
	userRepo := auth.NewGORMUserRepository(db)
	authService := auth.NewService(userRepo, jwtUtil)
	authHandler := auth.NewHandler(authService, logger)

	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.Use(gin.Recovery())

	// Setup routes
	api := router.Group("/api/v1")
	authMiddleware := middleware.AuthMiddleware(jwtUtil)
	authHandler.RegisterRoutes(api, authMiddleware)

	return router
}

func TestAuthIntegration_Register(t *testing.T) {
	router := setupTestRouter(t)

	tests := []struct {
		name           string
		requestBody    map[string]interface{}
		expectedStatus int
		expectedError  bool
	}{
		{
			name: "successful registration",
			requestBody: map[string]interface{}{
				"email":    "test@example.com",
				"password": "password123",
				"name":     "Test User",
			},
			expectedStatus: http.StatusCreated,
			expectedError:  false,
		},
		{
			name: "invalid email",
			requestBody: map[string]interface{}{
				"email":    "invalid-email",
				"password": "password123",
				"name":     "Test User",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "password too short",
			requestBody: map[string]interface{}{
				"email":    "test@example.com",
				"password": "123",
				"name":     "Test User",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
		{
			name: "missing required fields",
			requestBody: map[string]interface{}{
				"email": "test@example.com",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.requestBody)
			req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if !tt.expectedError {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "token")
				assert.Contains(t, response, "user")
			}
		})
	}
}

func TestAuthIntegration_Login(t *testing.T) {
	router := setupTestRouter(t)

	// First register a user
	registerBody := map[string]interface{}{
		"email":    "test@example.com",
		"password": "password123",
		"name":     "Test User",
	}
	registerData, _ := json.Marshal(registerBody)
	registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(registerData))
	registerReq.Header.Set("Content-Type", "application/json")

	registerW := httptest.NewRecorder()
	router.ServeHTTP(registerW, registerReq)

	var registerResponse map[string]interface{}

	json.Unmarshal(registerW.Body.Bytes(), &registerResponse)

	tests := []struct {
		name           string
		requestBody    map[string]interface{}
		expectedStatus int
		expectedError  bool
	}{
		{
			name: "successful login",
			requestBody: map[string]interface{}{
				"email":    "test@example.com",
				"password": "password123",
			},
			expectedStatus: http.StatusOK,
			expectedError:  false,
		},
		{
			name: "wrong password",
			requestBody: map[string]interface{}{
				"email":    "test@example.com",
				"password": "wrongpassword",
			},
			expectedStatus: http.StatusUnauthorized,
			expectedError:  true,
		},
		{
			name: "user not found",
			requestBody: map[string]interface{}{
				"email":    "nonexistent@example.com",
				"password": "password123",
			},
			expectedStatus: http.StatusUnauthorized,
			expectedError:  true,
		},
		{
			name: "invalid request",
			requestBody: map[string]interface{}{
				"email": "test@example.com",
			},
			expectedStatus: http.StatusBadRequest,
			expectedError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.requestBody)
			req := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if !tt.expectedError {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "token")
				assert.Contains(t, response, "user")
			}
		})
	}
}

func TestAuthIntegration_Profile(t *testing.T) {
	router := setupTestRouter(t)

	// First register and login to get a token
	registerBody := map[string]interface{}{
		"email":    "test@example.com",
		"password": "password123",
		"name":     "Test User",
	}
	registerData, _ := json.Marshal(registerBody)
	registerReq := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewBuffer(registerData))
	registerReq.Header.Set("Content-Type", "application/json")

	registerW := httptest.NewRecorder()
	router.ServeHTTP(registerW, registerReq)

	var registerResponse map[string]interface{}

	json.Unmarshal(registerW.Body.Bytes(), &registerResponse)
	token := registerResponse["token"].(string)

	tests := []struct {
		name           string
		authToken      string
		expectedStatus int
		expectedError  bool
	}{
		{
			name:           "successful profile retrieval",
			authToken:      token,
			expectedStatus: http.StatusOK,
			expectedError:  false,
		},
		{
			name:           "missing token",
			authToken:      "",
			expectedStatus: http.StatusUnauthorized,
			expectedError:  true,
		},
		{
			name:           "invalid token",
			authToken:      "invalid-token",
			expectedStatus: http.StatusUnauthorized,
			expectedError:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest("GET", "/api/v1/auth/profile", http.NoBody)
			if tt.authToken != "" {
				req.Header.Set("Authorization", "Bearer "+tt.authToken)
			}

			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.expectedStatus, w.Code)

			if !tt.expectedError {
				var response map[string]interface{}
				err := json.Unmarshal(w.Body.Bytes(), &response)
				assert.NoError(t, err)
				assert.Contains(t, response, "user")
			}
		})
	}
}
