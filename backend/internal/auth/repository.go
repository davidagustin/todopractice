package auth

import (
	"gorm.io/gorm"

	"todoapp-backend/pkg/models"
)

// GORMUserRepository implements UserRepository using GORM
type GORMUserRepository struct {
	db *gorm.DB
}

// NewGORMUserRepository creates a new GORM-backed user repository
func NewGORMUserRepository(db *gorm.DB) UserRepository {
	return &GORMUserRepository{db: db}
}

// Create implements UserRepository.Create
func (r *GORMUserRepository) Create(user *models.User) error {
	return r.db.Create(user).Error
}

// FindByEmail implements UserRepository.FindByEmail
func (r *GORMUserRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	err := r.db.Where("email = ?", email).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}

// FindByID implements UserRepository.FindByID
func (r *GORMUserRepository) FindByID(id uint) (*models.User, error) {
	var user models.User
	err := r.db.First(&user, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return &user, nil
}
