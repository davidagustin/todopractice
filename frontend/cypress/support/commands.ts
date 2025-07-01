/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to register a new user
       * @example cy.registerUser('test@example.com', 'password123', 'Test User')
       */
      registerUser(email: string, password: string, name: string): Chainable<void>

      /**
       * Custom command to login a user
       * @example cy.loginUser('test@example.com', 'password123')
       */
      loginUser(email: string, password: string): Chainable<void>

      /**
       * Custom command to logout user
       * @example cy.logoutUser()
       */
      logoutUser(): Chainable<void>

      /**
       * Custom command to create a todo
       * @example cy.createTodo('Test Todo', 'Test Description')
       */
      createTodo(title: string, description?: string): Chainable<void>

      /**
       * Custom command to wait for backend to be ready
       * @example cy.waitForBackend()
       */
      waitForBackend(): Chainable<void>

      /**
       * Custom command to clear test data
       * @example cy.clearTestData()
       */
      clearTestData(): Chainable<void>

      /**
       * Custom assertion for validation errors
       * @example cy.shouldHaveValidationError('email', 'Invalid email format')
       */
      shouldHaveValidationError(fieldName: string, errorMessage: string): Chainable<void>

      /**
       * Custom assertion for logged in state
       * @example cy.shouldBeLoggedIn()
       */
      shouldBeLoggedIn(): Chainable<void>

      /**
       * Custom assertion for logged out state
       * @example cy.shouldBeLoggedOut()
       */
      shouldBeLoggedOut(): Chainable<void>
    }
  }
}

// Custom command to register a new user
Cypress.Commands.add('registerUser', (email: string, password: string, name: string) => {
  cy.visit('/register')
  cy.get('input[name="name"]').type(name)
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Wait for redirect to dashboard
  cy.url().should('include', '/dashboard', { timeout: 10000 })
})

// Custom command to login a user
Cypress.Commands.add('loginUser', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  
  // Wait for redirect to dashboard
  cy.url().should('include', '/dashboard', { timeout: 10000 })
})

// Custom command to logout user
Cypress.Commands.add('logoutUser', () => {
  cy.contains('Logout').click()
  cy.url().should('include', '/login')
})

// Custom command to create a todo
Cypress.Commands.add('createTodo', (title: string, description?: string) => {
  cy.get('input[name="title"]').type(title)
  if (description) {
    cy.get('textarea[name="description"]').type(description)
  }
  cy.get('button[type="submit"]').click()
  
  // Wait for todo to appear in list
  cy.contains(title).should('be.visible')
})

// Custom command to wait for backend to be ready
Cypress.Commands.add('waitForBackend', () => {
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/health',
    failOnStatusCode: false,
    timeout: 10000
  }).then((response) => {
    if (response.status !== 200) {
      throw new Error('Backend server is not running. Please start it with: cd backend && go run cmd/server/main.go')
    }
  })
})

// Custom command to clear test data
Cypress.Commands.add('clearTestData', () => {
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:8080/api/test/cleanup',
    failOnStatusCode: false
  })
})

// Add custom assertions
Cypress.Commands.add('shouldHaveValidationError', (fieldName: string, errorMessage: string) => {
  cy.contains(errorMessage).should('be.visible')
})

Cypress.Commands.add('shouldBeLoggedIn', () => {
  cy.url().should('include', '/dashboard')
  cy.contains('Welcome back').should('be.visible')
})

Cypress.Commands.add('shouldBeLoggedOut', () => {
  cy.url().should('include', '/login')
  cy.contains('Login').should('be.visible')
})

// Export commands for TypeScript
export {} 