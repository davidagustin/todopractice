package todo

import (
	"errors"
	"fmt"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"

	"todoapp-backend/pkg/models"
)

var (
	ErrTodoNotFound = errors.New("todo not found")
	ErrUnauthorized = errors.New("unauthorized access to todo")
)

// TodoRepository abstracts todo DB operations
// (for testability and decoupling from GORM)
type TodoRepository interface {
	Create(todo *models.Todo) error
	FindByID(userID, todoID uint) (*models.Todo, error)
	FindAll(userID uint) ([]models.Todo, error)
	Update(todo *models.Todo, updates map[string]interface{}) error
	Delete(userID, todoID uint) (bool, error)
}

type Service struct {
	repo     TodoRepository
	validate *validator.Validate
}

// NewService creates a new todo service
func NewService(repo TodoRepository) *Service {
	return &Service{
		repo:     repo,
		validate: validator.New(),
	}
}

// Create creates a new todo
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

// GetByID retrieves a todo by ID
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

// GetAll retrieves all todos for a user
func (s *Service) GetAll(userID uint) ([]models.TodoResponse, error) {
	todos, err := s.repo.FindAll(userID)
	if err != nil {
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

// Delete deletes a todo
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

// GORM-backed implementation
type gormTodoRepo struct {
	db *gorm.DB
}

func NewGormTodoRepo(db *gorm.DB) TodoRepository {
	return &gormTodoRepo{db: db}
}

func (r *gormTodoRepo) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

func (r *gormTodoRepo) FindByID(userID, todoID uint) (*models.Todo, error) {
	var todo models.Todo
	err := r.db.Where("id = ? AND user_id = ?", todoID, userID).First(&todo).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrTodoNotFound
		}
		return nil, err
	}
	return &todo, nil
}

func (r *gormTodoRepo) FindAll(userID uint) ([]models.Todo, error) {
	var todos []models.Todo
	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&todos).Error
	if err != nil {
		return nil, err
	}
	return todos, nil
}

func (r *gormTodoRepo) Update(todo *models.Todo, updates map[string]interface{}) error {
	return r.db.Model(todo).Updates(updates).Error
}

func (r *gormTodoRepo) Delete(userID, todoID uint) (bool, error) {
	result := r.db.Where("id = ? AND user_id = ?", todoID, userID).Delete(&models.Todo{})
	if result.Error != nil {
		return false, result.Error
	}
	if result.RowsAffected == 0 {
		return false, nil
	}
	return true, nil
}
