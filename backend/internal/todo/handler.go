package todo

import (
	"errors"
	"net/http"
	"strconv"

	"todoapp-backend/pkg/middleware"
	"todoapp-backend/pkg/models"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type Handler struct {
	service *Service
	logger  *zap.Logger
}

// NewHandler creates a new todo handler.
func NewHandler(service *Service, logger *zap.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// Create handles creating a new todo.
func (h *Handler) Create(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	var req models.TodoCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.logger.Error("Failed to bind create todo request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})

		return
	}

	todo, err := h.service.Create(userID, req)
	if err != nil {
		h.logger.Error("Failed to create todo", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create todo",
		})

		return
	}

	h.logger.Info("Todo created successfully", zap.Uint("todo_id", todo.ID))
	c.JSON(http.StatusCreated, gin.H{
		"message": "Todo created successfully",
		"todo":    todo,
	})
}

// GetAll handles getting all todos for a user.
func (h *Handler) GetAll(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	todos, err := h.service.GetAll(userID)

	if err != nil {
		h.logger.Error("Failed to get todos", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get todos",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todos": todos,
	})
}

// GetByID handles getting a specific todo by ID.
func (h *Handler) GetByID(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	todoIDStr := c.Param("id")
	todoID, err := strconv.ParseUint(todoIDStr, 10, 32)

	if err != nil {
		h.logger.Error("Invalid todo ID", zap.String("id", todoIDStr))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid todo ID",
		})

		return
	}

	todo, err := h.service.GetByID(userID, uint(todoID))
	if err != nil {
		h.logger.Error("Failed to get todo", zap.Error(err))

		if errors.Is(err, ErrTodoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Todo not found",
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get todo",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"todo": todo,
	})
}

// Update handles updating a todo.
func (h *Handler) Update(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	todoIDStr := c.Param("id")
	todoID, err := strconv.ParseUint(todoIDStr, 10, 32)
	if err != nil {
		h.logger.Error("Invalid todo ID", zap.String("id", todoIDStr))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid todo ID",
		})

		return
	}

	var req models.TodoUpdateRequest
	if bindErr := c.ShouldBindJSON(&req); bindErr != nil {
		h.logger.Error("Failed to bind update todo request", zap.Error(bindErr))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})

		return
	}

	todo, err := h.service.Update(userID, uint(todoID), req)

	if err != nil {
		h.logger.Error("Failed to update todo", zap.Error(err))

		if errors.Is(err, ErrTodoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Todo not found",
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update todo",
		})

		return
	}

	h.logger.Info("Todo updated successfully", zap.Uint("todo_id", todo.ID))
	c.JSON(http.StatusOK, gin.H{
		"message": "Todo updated successfully",
		"todo":    todo,
	})
}

// Delete handles deleting a todo.
func (h *Handler) Delete(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		h.logger.Error("User ID not found in context")
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})

		return
	}

	todoIDStr := c.Param("id")
	todoID, err := strconv.ParseUint(todoIDStr, 10, 32)
	if err != nil {
		h.logger.Error("Invalid todo ID", zap.String("id", todoIDStr))
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid todo ID",
		})

		return
	}

	err = h.service.Delete(userID, uint(todoID))

	if err != nil {
		h.logger.Error("Failed to delete todo", zap.Error(err))

		if errors.Is(err, ErrTodoNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Todo not found",
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete todo",
		})

		return
	}

	h.logger.Info("Todo deleted successfully", zap.Uint("todo_id", uint(todoID)))
	c.JSON(http.StatusOK, gin.H{
		"message": "Todo deleted successfully",
	})
}

// RegisterRoutes registers todo routes.
func (h *Handler) RegisterRoutes(router *gin.RouterGroup, authMiddleware gin.HandlerFunc) {
	todos := router.Group("/todos")
	todos.Use(authMiddleware)
	todos.POST("", h.Create)
	todos.GET("", h.GetAll)
	todos.GET("/:id", h.GetByID)
	todos.PUT("/:id", h.Update)
	todos.DELETE("/:id", h.Delete)
}
