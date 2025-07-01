package todo

import (
	"todoapp-backend/pkg/models"

	"gorm.io/gorm"
)

// GORMTodoRepository implements TodoRepository using GORM
type GORMTodoRepository struct {
	db *gorm.DB
}

// NewGORMTodoRepository creates a new GORM-backed todo repository
func NewGORMTodoRepository(db *gorm.DB) TodoRepository {
	return &GORMTodoRepository{db: db}
}

// Create implements TodoRepository.Create
func (r *GORMTodoRepository) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

// FindByID implements TodoRepository.FindByID
func (r *GORMTodoRepository) FindByID(userID, todoID uint) (*models.Todo, error) {
	var todo models.Todo
	err := r.db.Where("id = ? AND user_id = ?", todoID, userID).First(&todo).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrTodoNotFound
		}
		return nil, err
	}
	return &todo, nil
}

// FindAll implements TodoRepository.FindAll
func (r *GORMTodoRepository) FindAll(userID uint) ([]models.Todo, error) {
	var todos []models.Todo
	err := r.db.Where("user_id = ?", userID).Find(&todos).Error
	return todos, err
}

// Update implements TodoRepository.Update
func (r *GORMTodoRepository) Update(todo *models.Todo, updates map[string]interface{}) error {
	return r.db.Model(todo).Updates(updates).Error
}

// Delete implements TodoRepository.Delete
func (r *GORMTodoRepository) Delete(userID, todoID uint) (bool, error) {
	result := r.db.Where("id = ? AND user_id = ?", todoID, userID).Delete(&models.Todo{})
	return result.RowsAffected > 0, result.Error
}
