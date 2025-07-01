package auth

import (
	"errors"
	"fmt"
	"todoapp-backend/pkg/models"
	"todoapp-backend/pkg/utils"

	"github.com/go-playground/validator/v10"
	"gorm.io/gorm"
)

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidPassword   = errors.New("invalid password")
	ErrUserAlreadyExists = errors.New("user already exists")
)

type Service struct {
	db       *gorm.DB
	jwtUtil  *utils.JWTUtil
	validate *validator.Validate
}

// NewService creates a new auth service
func NewService(db *gorm.DB, jwtUtil *utils.JWTUtil) *Service {
	return &Service{
		db:       db,
		jwtUtil:  jwtUtil,
		validate: validator.New(),
	}
}

// Register creates a new user account
func (s *Service) Register(req models.UserRegisterRequest) (*models.UserResponse, string, error) {
	// Validate request
	if err := s.validate.Struct(req); err != nil {
		return nil, "", fmt.Errorf("validation failed: %w", err)
	}

	// Check if user already exists
	var existingUser models.User
	if err := s.db.Where("email = ?", req.Email).First(&existingUser).Error; err == nil {
		return nil, "", ErrUserAlreadyExists
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, "", fmt.Errorf("failed to check existing user: %w", err)
	}

	// Create new user
	user := models.User{
		Email:    req.Email,
		Password: req.Password,
		Name:     req.Name,
	}

	// Hash password
	if err := user.HashPassword(); err != nil {
		return nil, "", fmt.Errorf("failed to hash password: %w", err)
	}

	// Save user to database
	if err := s.db.Create(&user).Error; err != nil {
		return nil, "", fmt.Errorf("failed to create user: %w", err)
	}

	// Generate JWT token
	token, err := s.jwtUtil.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	userResponse := user.ToResponse()
	return &userResponse, token, nil
}

// Login authenticates a user and returns a JWT token
func (s *Service) Login(req models.UserLoginRequest) (*models.UserResponse, string, error) {
	// Validate request
	if err := s.validate.Struct(req); err != nil {
		return nil, "", fmt.Errorf("validation failed: %w", err)
	}

	// Find user by email
	var user models.User
	if err := s.db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, "", ErrUserNotFound
		}
		return nil, "", fmt.Errorf("failed to find user: %w", err)
	}

	// Check password
	if !user.CheckPassword(req.Password) {
		return nil, "", ErrInvalidPassword
	}

	// Generate JWT token
	token, err := s.jwtUtil.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	userResponse := user.ToResponse()
	return &userResponse, token, nil
}

// GetUserByID retrieves a user by ID
func (s *Service) GetUserByID(userID uint) (*models.UserResponse, error) {
	var user models.User
	if err := s.db.First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	userResponse := user.ToResponse()
	return &userResponse, nil
}
