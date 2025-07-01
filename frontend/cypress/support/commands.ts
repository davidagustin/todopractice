// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login a user
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="login-button"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to register a user
Cypress.Commands.add('register', (email: string, password: string, name: string) => {
  cy.visit('/register')
  cy.get('[data-testid="name-input"]').type(name)
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="register-button"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to create a todo
Cypress.Commands.add('createTodo', (title: string, description?: string) => {
  cy.get('[data-testid="todo-title-input"]').type(title)
  if (description) {
    cy.get('[data-testid="todo-description-input"]').type(description)
  }
  cy.get('[data-testid="create-todo-button"]').click()
  cy.get('[data-testid="todo-list"]').should('contain', title)
})

// Custom command to clear all todos
Cypress.Commands.add('clearTodos', () => {
  cy.get('[data-testid="todo-item"]').each(($el) => {
    cy.wrap($el).find('[data-testid="delete-todo-button"]').click()
  })
  cy.get('[data-testid="todo-list"]').should('not.contain', 'todo-item')
}) 