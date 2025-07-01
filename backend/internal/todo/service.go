package todo

import (
	"errors"
	"fmt"
	"todoapp-backend/pkg/models"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

var (
	ErrTodoNotFound = errors.New("todo not found")
	ErrUnauthorized = errors.New("unauthorized access to todo")
)

type Service struct {
	db       *gorm.DB
	validate *validator.Validate
}

// NewService creates a new todo service
func NewService(db *gorm.DB) *Service {
	return &Service{
		db:       db,
		validate: validator.New(),
	}
}

// Create creates a new todo
func (s *Service) Create(userID uint, req models.TodoCreateRequest) (*models.TodoResponse, error) {
	// Validate request
	if err := s.validate.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	todo := models.Todo{
		Title:       req.Title,
		Description: req.Description,
		UserID:      userID,
		Completed:   false,
	}

	if err := s.db.Create(&todo).Error; err != nil {
		return nil, fmt.Errorf("failed to create todo: %w", err)
	}

	response := todo.ToResponse()
	return &response, nil
}

// GetByID retrieves a todo by ID
func (s *Service) GetByID(userID, todoID uint) (*models.TodoResponse, error) {
	var todo models.Todo
	if err := s.db.Where("id = ? AND user_id = ?", todoID, userID).First(&todo).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, fmt.Errorf("failed to get todo: %w", err)
	}

	response := todo.ToResponse()
	return &response, nil
}

// GetAll retrieves all todos for a user
func (s *Service) GetAll(userID uint) ([]models.TodoResponse, error) {
	var todos []models.Todo
	if err := s.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&todos).Error; err != nil {
		return nil, fmt.Errorf("failed to get todos: %w", err)
	}

	responses := make([]models.TodoResponse, len(todos))
	for i, todo := range todos {
		responses[i] = todo.ToResponse()
	}

	return responses, nil
}

// Update updates a todo
func (s *Service) Update(userID, todoID uint, req models.TodoUpdateRequest) (*models.TodoResponse, error) {
	// Validate request
	if err := s.validate.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	// Find the todo
	var todo models.Todo
	if err := s.db.Where("id = ? AND user_id = ?", todoID, userID).First(&todo).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, fmt.Errorf("failed to find todo: %w", err)
	}

	// Update fields if provided
	updates := make(map[string]interface{})
	if req.Title != nil {
		updates["title"] = *req.Title
	}
	if req.Description != nil {
		updates["description"] = *req.Description
	}
	if req.Completed != nil {
		updates["completed"] = *req.Completed
	}

	if len(updates) > 0 {
		if err := s.db.Model(&todo).Updates(updates).Error; err != nil {
			return nil, fmt.Errorf("failed to update todo: %w", err)
		}
	}

	// Reload the todo to get updated values
	if err := s.db.First(&todo, todoID).Error; err != nil {
		return nil, fmt.Errorf("failed to reload todo: %w", err)
	}

	response := todo.ToResponse()
	return &response, nil
}

// Delete deletes a todo
func (s *Service) Delete(userID, todoID uint) error {
	result := s.db.Where("id = ? AND user_id = ?", todoID, userID).Delete(&models.Todo{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete todo: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return ErrTodoNotFound
	}

	return nil
}
