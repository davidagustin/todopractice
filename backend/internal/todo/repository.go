package todo

import (
	"errors"

	"todoapp-backend/pkg/models"

	"gorm.io/gorm"
)

// GormTodoRepo implements Repository using GORM.
type GormTodoRepo struct {
	db *gorm.DB
}

// NewGormTodoRepo creates a new GORM-backed todo repository.
func NewGormTodoRepo(db *gorm.DB) Repository {
	return &GormTodoRepo{db: db}
}

// Create implements Repository.Create.
func (r *GormTodoRepo) Create(todo *models.Todo) error {
	return r.db.Create(todo).Error
}

// FindByID implements Repository.FindByID.
func (r *GormTodoRepo) FindByID(userID, todoID uint) (*models.Todo, error) {
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

// FindAll implements Repository.FindAll.
func (r *GormTodoRepo) FindAll(userID uint) ([]models.Todo, error) {
	var todos []models.Todo

	err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Find(&todos).Error
	if err != nil {
		return nil, err
	}

	return todos, nil
}

// Update implements Repository.Update.
func (r *GormTodoRepo) Update(todo *models.Todo, updates map[string]interface{}) error {
	return r.db.Model(todo).Updates(updates).Error
}

// Delete implements Repository.Delete.
func (r *GormTodoRepo) Delete(userID, todoID uint) (bool, error) {
	result := r.db.Where("id = ? AND user_id = ?", todoID, userID).Delete(&models.Todo{})
	if result.Error != nil {
		return false, result.Error
	}

	if result.RowsAffected == 0 {
		return false, nil
	}

	return true, nil
}
