package main

import (
	"log"

	"todoapp-backend/internal/auth"
	"todoapp-backend/internal/config"
	"todoapp-backend/internal/database"
	"todoapp-backend/internal/todo"
	"todoapp-backend/pkg/middleware"
	"todoapp-backend/pkg/utils"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Initialize logger
	logger, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}
	defer logger.Sync()

	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Fatal("Failed to load configuration", zap.Error(err))
	}

	// Initialize database
	db, err := database.NewDatabase(cfg, logger)
	if err != nil {
		logger.Fatal("Failed to initialize database", zap.Error(err))
	}
	defer db.Close()

	// Run migrations
	if err := db.Migrate(); err != nil {
		logger.Fatal("Failed to run database migrations", zap.Error(err))
	}

	// Initialize JWT utility
	jwtUtil := utils.NewJWTUtil(cfg)

	// Initialize repositories
	userRepo := auth.NewGORMUserRepository(db.DB)
	todoRepo := todo.NewGORMTodoRepository(db.DB)

	// Initialize services
	authService := auth.NewService(userRepo, jwtUtil)
	todoService := todo.NewService(todoRepo)

	// Initialize handlers
	authHandler := auth.NewHandler(authService, logger)
	todoHandler := todo.NewHandler(todoService, logger)

	// Initialize Gin router
	router := gin.Default()

	// Add CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)

			return
		}

		c.Next()
	})

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		if err := db.Health(); err != nil {
			logger.Error("Database health check failed", zap.Error(err))
			c.JSON(500, gin.H{
				"status": "unhealthy",
				"error":  "Database connection failed",
			})

			return
		}

		c.JSON(200, gin.H{
			"status": "healthy",
		})
	})

	// API routes
	api := router.Group("/api/v1")

	// Auth middleware
	authMiddleware := middleware.AuthMiddleware(jwtUtil)

	// Register routes
	authHandler.RegisterRoutes(api, authMiddleware)
	todoHandler.RegisterRoutes(api, authMiddleware)

	// Start server
	addr := cfg.Server.Host + ":" + cfg.Server.Port
	logger.Info("Starting server", zap.String("address", addr))

	if err := router.Run(addr); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}
