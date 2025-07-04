package middleware

import (
	"net/http"
	"strings"

	"todoapp-backend/pkg/utils"

	"github.com/gin-gonic/gin"
)

const bearerTokenParts = 2

// AuthMiddleware creates a JWT authentication middleware.
func AuthMiddleware(jwtUtil *utils.JWTUtil) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header is required",
			})
			c.Abort()

			return
		}

		// Check if the header starts with "Bearer "
		parts := strings.SplitN(authHeader, " ", bearerTokenParts)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authorization header format must be Bearer {token}",
			})
			c.Abort()

			return
		}

		token := parts[1]

		claims, err := jwtUtil.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid or expired token",
			})
			c.Abort()

			return
		}

		// Set user information in context for use in handlers
		c.Set("user_id", claims.UserID)
		c.Set("user_email", claims.Email)
		c.Next()
	}
}

// GetUserID extracts user ID from the Gin context.
func GetUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}

	id, ok := userID.(uint)

	return id, ok
}

// GetUserEmail extracts user email from the Gin context.
func GetUserEmail(c *gin.Context) (string, bool) {
	email, exists := c.Get("user_email")
	if !exists {
		return "", false
	}

	emailStr, ok := email.(string)

	return emailStr, ok
}
