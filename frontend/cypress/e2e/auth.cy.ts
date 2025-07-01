describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Registration', () => {
    it('should register a new user successfully', () => {
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'password123'
      const testName = 'Test User'

      cy.visit('/register')
      
      // Fill in registration form
      cy.get('input[name="name"]').type(testName)
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
      cy.contains('Welcome back, Test User!').should('be.visible')
    })

    it('should show validation errors for invalid input', () => {
      cy.visit('/register')
      
      // Try to submit empty form
      cy.get('button[type="submit"]').click()
      
      // Should show validation errors
      cy.contains('Name is required').should('be.visible')
      cy.contains('Email is required').should('be.visible')
      cy.contains('Password is required').should('be.visible')
    })

    it('should show error for invalid email format', () => {
      cy.visit('/register')
      
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type('invalid-email')
      cy.get('input[name="password"]').type('password123')
      
      cy.get('button[type="submit"]').click()
      
      cy.contains('Invalid email format').should('be.visible')
    })

    it('should show error for short password', () => {
      cy.visit('/register')
      
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('123')
      
      cy.get('button[type="submit"]').click()
      
      cy.contains('Password must be at least 6 characters').should('be.visible')
    })
  })

  describe('Login', () => {
    beforeEach(() => {
      // Register a user first
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'password123'
      const testName = 'Test User'

      cy.visit('/register')
      cy.get('input[name="name"]').type(testName)
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
      
      // Logout
      cy.contains('Logout').click()
    })

    it('should login successfully with valid credentials', () => {
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'password123'

      // Register first
      cy.visit('/register')
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
      
      // Logout
      cy.contains('Logout').click()
      
      // Login
      cy.visit('/login')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard')
      cy.contains('Welcome back, Test User!').should('be.visible')
    })

    it('should show error for invalid credentials', () => {
      cy.visit('/login')
      
      cy.get('input[name="email"]').type('nonexistent@example.com')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()
      
      cy.contains('Invalid email or password').should('be.visible')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')
      
      cy.get('button[type="submit"]').click()
      
      cy.contains('Email is required').should('be.visible')
      cy.contains('Password is required').should('be.visible')
    })
  })

  describe('Navigation', () => {
    it('should navigate between login and register pages', () => {
      cy.visit('/login')
      cy.contains('Don\'t have an account?').click()
      cy.url().should('include', '/register')
      
      cy.contains('Already have an account?').click()
      cy.url().should('include', '/login')
    })

    it('should redirect to dashboard if already logged in', () => {
      // Register and login
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'password123'

      cy.visit('/register')
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
      
      // Try to visit login page
      cy.visit('/login')
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Logout', () => {
    it('should logout successfully', () => {
      // Register and login first
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'password123'

      cy.visit('/register')
      cy.get('input[name="name"]').type('Test User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()
      
      // Logout
      cy.contains('Logout').click()
      
      // Should redirect to login page
      cy.url().should('include', '/login')
      cy.contains('Login').should('be.visible')
    })
  })
}) 