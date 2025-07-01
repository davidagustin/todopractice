package auth

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"

	"todoapp-backend/pkg/middleware"
	"todoapp-backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.uber.org/zap"
)

type Handler struct {
	service *Service
	logger  *zap.Logger
}

// NewHandler creates a new auth handler.
func NewHandler(service *Service, logger *zap.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

func (h *Handler) handleValidationErrors(c *gin.Context, err error) bool {
	var ve validator.ValidationErrors
	if errors.As(err, &ve) {
		errors := make(map[string]string)

		for _, fe := range ve {
			switch fe.Field() {
			case "Email":
				errors["email"] = "Invalid email format"
			case "Password":
				errors["password"] = "Password must be at least 6 characters"
			case "Name":
				errors["name"] = "Name is required"
			default:
				errors[fe.Field()] = fe.Error()
			}
		}

		c.JSON(http.StatusBadRequest, gin.H{"errors": errors})

		return true
	}

	return false
}

// Register handles user registration.
func (h *Handler) Register(c *gin.Context) {
	var req models.UserRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Failed to bind registration request", zap.Error(err))

		if h.handleValidationErrors(c, err) {
			return
		}

		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})

		return
	}

	h.logger.Info("Registration request received", zap.Any("request", req))

	user, token, err := h.service.Register(req)
	if err != nil {
		h.logger.Error("Registration failed", zap.Error(err))
		h.logger.Info("Error message", zap.String("error_message", err.Error()))

		if errors.Is(err, ErrUserAlreadyExists) {
			c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})

			return
		}

		if strings.Contains(err.Error(), "validation failed") {
			h.logger.Info(
				"Validation error debug",
				zap.String("type", fmt.Sprintf("%T", err)),
				zap.String("value", fmt.Sprintf("%+v", err)),
			)

			if h.handleValidationErrors(c, err) {
				return
			}

			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Registration failed"})

		return
	}

	h.logger.Info("User registered successfully", zap.Uint("user_id", user.ID))
	c.JSON(
		http.StatusCreated,
		gin.H{"message": "User registered successfully", "user": user, "token": token},
	)
}

// Login handles user login.
func (h *Handler) Login(c *gin.Context) {
	var req models.UserLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Failed to bind login request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})

		return
	}

	user, token, err := h.service.Login(req)
	if err != nil {
		h.logger.Error("Login failed", zap.Error(err))

		if errors.Is(err, ErrUserNotFound) || errors.Is(err, ErrInvalidPassword) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid email or password",
			})

			return
		}

		// Check if it's a validation error
		if strings.Contains(err.Error(), "validation failed") {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Login failed",
		})

		return
	}

	h.logger.Info("User logged in successfully", zap.Uint("user_id", user.ID))
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
		"token":   token,
	})
}

// Profile handles getting user profile.
func (h *Handler) Profile(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	user, err := h.service.GetUserByID(userID)
	if err != nil {
		h.logger.Error("Failed to get user profile", zap.Error(err))

		if errors.Is(err, ErrUserNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "User not found",
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get profile",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

// RegisterRoutes registers auth routes.
func (h *Handler) RegisterRoutes(router *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	auth := router.Group("/auth")
	auth.POST("/register", h.Register)
	auth.POST("/login", h.Login)
	auth.GET("/profile", authMiddleware, h.Profile)
}

// TestCleanup clears all test data (only available in test mode).
func (h *Handler) TestCleanup(c *gin.Context) {
	// Only allow in test environment
	if os.Getenv("ENV") != "test" {
		c.JSON(http.StatusNotFound, gin.H{"error": "Not found"})

		return
	}

	// For now, just return success - database cleanup will be handled at the server level
	c.JSON(http.StatusOK, gin.H{"message": "Test cleanup endpoint available"})
}

// Health check endpoint.
func (h *Handler) Health(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "healthy"})
}
