describe('Todo Management', () => {
  beforeEach(() => {
    // Register and login before each test
    const testEmail = `test${Date.now()}@example.com`
    const testPassword = 'password123'
    const testName = 'Test User'

    cy.visit('/register')
    cy.get('input[name="name"]').type(testName)
    cy.get('input[name="email"]').type(testEmail)
    cy.get('input[name="password"]').type(testPassword)
    cy.get('button[type="submit"]').click()
    
    // Should be on dashboard
    cy.url().should('include', '/dashboard')
  })

  describe('Creating Todos', () => {
    it('should create a new todo successfully', () => {
      const todoTitle = 'Test Todo'
      const todoDescription = 'Test Description'

      // Fill in todo form
      cy.get('input[name="title"]').type(todoTitle)
      cy.get('textarea[name="description"]').type(todoDescription)
      
      // Submit form
      cy.get('button[type="submit"]').click()
      
      // Should see the new todo in the list
      cy.contains(todoTitle).should('be.visible')
      cy.contains(todoDescription).should('be.visible')
    })

    it('should create a todo with only title', () => {
      const todoTitle = 'Simple Todo'

      cy.get('input[name="title"]').type(todoTitle)
      cy.get('button[type="submit"]').click()
      
      cy.contains(todoTitle).should('be.visible')
    })

    it('should show validation error for empty title', () => {
      cy.get('button[type="submit"]').click()
      
      cy.contains('Title is required').should('be.visible')
    })

    it('should clear form after successful creation', () => {
      const todoTitle = 'Test Todo'
      const todoDescription = 'Test Description'

      cy.get('input[name="title"]').type(todoTitle)
      cy.get('textarea[name="description"]').type(todoDescription)
      cy.get('button[type="submit"]').click()
      
      // Form should be cleared
      cy.get('input[name="title"]').should('have.value', '')
      cy.get('textarea[name="description"]').should('have.value', '')
    })
  })

  describe('Viewing Todos', () => {
    beforeEach(() => {
      // Create a todo first
      const todoTitle = 'Test Todo'
      const todoDescription = 'Test Description'

      cy.get('input[name="title"]').type(todoTitle)
      cy.get('textarea[name="description"]').type(todoDescription)
      cy.get('button[type="submit"]').click()
    })

    it('should display todos in the list', () => {
      cy.contains('Test Todo').should('be.visible')
      cy.contains('Test Description').should('be.visible')
    })

    it('should show todo creation date', () => {
      cy.contains('Test Todo').parent().should('contain', 'Created:')
    })

    it('should show todo status (not completed by default)', () => {
      cy.contains('Test Todo').parent().should('contain', 'Not completed')
    })
  })

  describe('Updating Todos', () => {
    beforeEach(() => {
      // Create a todo first
      const todoTitle = 'Original Todo'
      const todoDescription = 'Original Description'

      cy.get('input[name="title"]').type(todoTitle)
      cy.get('textarea[name="description"]').type(todoDescription)
      cy.get('button[type="submit"]').click()
    })

    it('should mark todo as completed', () => {
      cy.contains('Original Todo').parent().find('input[type="checkbox"]').click()
      
      cy.contains('Original Todo').parent().should('contain', 'Completed')
    })

    it('should update todo title', () => {
      cy.contains('Original Todo').parent().find('button').contains('Edit').click()
      
      cy.get('input[name="title"]').clear().type('Updated Todo')
      cy.get('button[type="submit"]').click()
      
      cy.contains('Updated Todo').should('be.visible')
      cy.contains('Original Todo').should('not.exist')
    })

    it('should update todo description', () => {
      cy.contains('Original Todo').parent().find('button').contains('Edit').click()
      
      cy.get('textarea[name="description"]').clear().type('Updated Description')
      cy.get('button[type="submit"]').click()
      
      cy.contains('Updated Description').should('be.visible')
      cy.contains('Original Description').should('not.exist')
    })

    it('should cancel edit mode', () => {
      cy.contains('Original Todo').parent().find('button').contains('Edit').click()
      
      cy.get('button').contains('Cancel').click()
      
      cy.contains('Original Todo').should('be.visible')
      cy.get('input[name="title"]').should('have.value', '')
    })
  })

  describe('Deleting Todos', () => {
    beforeEach(() => {
      // Create a todo first
      const todoTitle = 'Todo to Delete'
      const todoDescription = 'This todo will be deleted'

      cy.get('input[name="title"]').type(todoTitle)
      cy.get('textarea[name="description"]').type(todoDescription)
      cy.get('button[type="submit"]').click()
    })

    it('should delete a todo successfully', () => {
      cy.contains('Todo to Delete').parent().find('button').contains('Delete').click()
      
      // Should show confirmation dialog
      cy.contains('Are you sure?').should('be.visible')
      
      // Confirm deletion
      cy.get('button').contains('Yes').click()
      
      // Todo should be removed
      cy.contains('Todo to Delete').should('not.exist')
    })

    it('should cancel deletion', () => {
      cy.contains('Todo to Delete').parent().find('button').contains('Delete').click()
      
      // Should show confirmation dialog
      cy.contains('Are you sure?').should('be.visible')
      
      // Cancel deletion
      cy.get('button').contains('No').click()
      
      // Todo should still exist
      cy.contains('Todo to Delete').should('be.visible')
    })
  })

  describe('Todo List Management', () => {
    it('should display empty state when no todos exist', () => {
      cy.contains('No todos yet').should('be.visible')
      cy.contains('Create your first todo to get started!').should('be.visible')
    })

    it('should handle multiple todos', () => {
      // Create first todo
      cy.get('input[name="title"]').type('First Todo')
      cy.get('textarea[name="description"]').type('First Description')
      cy.get('button[type="submit"]').click()
      
      // Create second todo
      cy.get('input[name="title"]').type('Second Todo')
      cy.get('textarea[name="description"]').type('Second Description')
      cy.get('button[type="submit"]').click()
      
      // Both todos should be visible
      cy.contains('First Todo').should('be.visible')
      cy.contains('Second Todo').should('be.visible')
    })

    it('should maintain todo order (newest first)', () => {
      // Create first todo
      cy.get('input[name="title"]').type('First Todo')
      cy.get('button[type="submit"]').click()
      
      // Create second todo
      cy.get('input[name="title"]').type('Second Todo')
      cy.get('button[type="submit"]').click()
      
      // Second todo should appear first in the list
      cy.get('[data-testid="todo-list"]').children().first().should('contain', 'Second Todo')
    })
  })

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport('iphone-x')
      
      const todoTitle = 'Mobile Todo'
      cy.get('input[name="title"]').type(todoTitle)
      cy.get('button[type="submit"]').click()
      
      cy.contains(todoTitle).should('be.visible')
    })

    it('should work on tablet viewport', () => {
      cy.viewport('ipad-2')
      
      const todoTitle = 'Tablet Todo'
      cy.get('input[name="title"]').type(todoTitle)
      cy.get('button[type="submit"]').click()
      
      cy.contains(todoTitle).should('be.visible')
    })
  })
}) 