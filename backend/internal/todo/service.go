package todo

import (
	"errors"
	"fmt"

	"todoapp-backend/pkg/models"

	"github.com/go-playground/validator/v10"
)

var (
	ErrTodoNotFound = errors.New("todo not found")
	ErrUnauthorized = errors.New("unauthorized access to todo")
)

// (for testability and decoupling from GORM).
type Repository interface {
	Create(todo *models.Todo) error
	FindByID(userID, todoID uint) (*models.Todo, error)
	FindAll(userID uint) ([]models.Todo, error)
	Update(todo *models.Todo, updates map[string]interface{}) error
	Delete(userID, todoID uint) (bool, error)
}

type Service struct {
	repo     Repository
	validate *validator.Validate
}

// NewService creates a new todo service.
func NewService(repo Repository) *Service {
	return &Service{
		repo:     repo,
		validate: validator.New(),
	}
}

// Create creates a new todo.
func (s *Service) Create(userID uint, req models.TodoCreateRequest) (*models.TodoResponse, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	todo := &models.Todo{
		Title:       req.Title,
		Description: req.Description,
		UserID:      userID,
		Completed:   false,
	}
	if err := s.repo.Create(todo); err != nil {
		return nil, fmt.Errorf("failed to create todo: %w", err)
	}

	response := todo.ToResponse()

	return &response, nil
}

// GetByID retrieves a todo by ID.
func (s *Service) GetByID(userID, todoID uint) (*models.TodoResponse, error) {
	todo, err := s.repo.FindByID(userID, todoID)
	if err != nil {
		if errors.Is(err, ErrTodoNotFound) {
			return nil, ErrTodoNotFound
		}

		return nil, fmt.Errorf("failed to get todo: %w", err)
	}

	response := todo.ToResponse()

	return &response, nil
}

// GetAll retrieves all todos for a user.
func (s *Service) GetAll(userID uint) ([]models.TodoResponse, error) {
	todos, err := s.repo.FindAll(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get todos: %w", err)
	}

	responses := make([]models.TodoResponse, len(todos))
	for i := range todos {
		responses[i] = todos[i].ToResponse()
	}

	return responses, nil
}

// Update updates a todo.
func (s *Service) Update(userID, todoID uint, req models.TodoUpdateRequest) (*models.TodoResponse, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, fmt.Errorf("validation failed: %w", err)
	}

	todo, err := s.repo.FindByID(userID, todoID)
	if err != nil {
		if errors.Is(err, ErrTodoNotFound) {
			return nil, ErrTodoNotFound
		}

		return nil, fmt.Errorf("failed to find todo: %w", err)
	}

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
		if err := s.repo.Update(todo, updates); err != nil {
			return nil, fmt.Errorf("failed to update todo: %w", err)
		}
	}

	response := todo.ToResponse()

	return &response, nil
}

// Delete deletes a todo.
func (s *Service) Delete(userID, todoID uint) error {
	deleted, err := s.repo.Delete(userID, todoID)
	if err != nil {
		return fmt.Errorf("failed to delete todo: %w", err)
	}

	if !deleted {
		return ErrTodoNotFound
	}

	return nil
}
