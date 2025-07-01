package auth

import (
	"errors"
	"fmt"

	"todoapp-backend/pkg/models"
	"todoapp-backend/pkg/utils"

	"github.com/go-playground/validator/v10"
)

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrInvalidPassword   = errors.New("invalid password")
	ErrUserAlreadyExists = errors.New("user already exists")
)

// (for testability and decoupling from GORM).
type UserRepository interface {
	FindByEmail(email string) (*models.User, error)
	Create(user *models.User) error
	FindByID(id uint) (*models.User, error)
}

// JWTUtil interface for mocking.
type JWTUtilInterface interface {
	GenerateToken(userID uint, email string) (string, error)
	ValidateToken(tokenString string) (*utils.JWTClaims, error)
	RefreshToken(tokenString string) (string, error)
}

type Service struct {
	repo     UserRepository
	jwtUtil  JWTUtilInterface
	validate *validator.Validate
}

// NewService creates a new auth service.
func NewService(repo UserRepository, jwtUtil JWTUtilInterface) *Service {
	return &Service{
		repo:     repo,
		jwtUtil:  jwtUtil,
		validate: validator.New(),
	}
}

// Register creates a new user account.
func (s *Service) Register(req models.UserRegisterRequest) (*models.UserResponse, string, error) {
	fmt.Printf("Validating request: %+v\n", req)

	if err := s.validate.Struct(req); err != nil {
		fmt.Printf("Validation error: %v\n", err)
		fmt.Printf("Validation error type: %T\n", err)

		return nil, "", fmt.Errorf("validation failed: %w", err)
	}

	fmt.Printf("Validation passed\n")

	// Check if user already exists
	existingUser, err := s.repo.FindByEmail(req.Email)
	if err == nil && existingUser != nil {
		return nil, "", ErrUserAlreadyExists
	} else if err != nil && !errors.Is(err, ErrUserNotFound) {
		return nil, "", fmt.Errorf("failed to check existing user: %w", err)
	}

	user := &models.User{
		Email:    req.Email,
		Password: req.Password,
		Name:     req.Name,
	}
	if err := user.HashPassword(); err != nil {
		return nil, "", fmt.Errorf("failed to hash password: %w", err)
	}

	if err := s.repo.Create(user); err != nil {
		return nil, "", fmt.Errorf("failed to create user: %w", err)
	}

	token, err := s.jwtUtil.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	userResponse := user.ToResponse()

	return &userResponse, token, nil
}

// Login authenticates a user and returns a JWT token.
func (s *Service) Login(req models.UserLoginRequest) (*models.UserResponse, string, error) {
	if err := s.validate.Struct(req); err != nil {
		return nil, "", fmt.Errorf("validation failed: %w", err)
	}

	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return nil, "", ErrUserNotFound
		}

		return nil, "", fmt.Errorf("failed to find user: %w", err)
	}

	if !user.CheckPassword(req.Password) {
		return nil, "", ErrInvalidPassword
	}

	token, err := s.jwtUtil.GenerateToken(user.ID, user.Email)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	userResponse := user.ToResponse()

	return &userResponse, token, nil
}

// GetUserByID retrieves a user by ID.
func (s *Service) GetUserByID(userID uint) (*models.UserResponse, error) {
	user, err := s.repo.FindByID(userID)
	if err != nil {
		if errors.Is(err, ErrUserNotFound) {
			return nil, ErrUserNotFound
		}

		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	userResponse := user.ToResponse()

	return &userResponse, nil
}
