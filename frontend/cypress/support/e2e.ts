// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for authentication
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to register a user
       * @example cy.register('test@example.com', 'password123', 'Test User')
       */
      register(email: string, password: string, name: string): Chainable<void>;

      /**
       * Custom command to create a todo
       * @example cy.createTodo('Test Todo', 'Test Description')
       */
      createTodo(title: string, description?: string): Chainable<void>;

      /**
       * Custom command to clear all todos
       * @example cy.clearTodos()
       */
      clearTodos(): Chainable<void>;
    }
  }
}

// Global configuration for E2E tests
before(() => {
  // Ensure backend is available before running tests
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/health',
    failOnStatusCode: false,
    timeout: 10000,
  }).then((response) => {
    if (response.status !== 200) {
      cy.log('⚠️ Backend server not running. Some tests may fail.');
      cy.log('Please start the backend server with: cd backend && go run cmd/server/main.go');
    } else {
      cy.log('✅ Backend server is running');
    }
  });
});

// Global beforeEach hook
beforeEach(() => {
  // Clear any existing data
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:8080/api/test/cleanup',
    failOnStatusCode: false,
  });
});

// Global afterEach hook
afterEach(() => {
  // Clean up test data after each test
  cy.request({
    method: 'DELETE',
    url: 'http://localhost:8080/api/test/cleanup',
    failOnStatusCode: false,
  });
});

// Configure Cypress behavior
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are expected in some scenarios
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  return true;
});

// Configure viewport for consistent testing
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);

// Configure default timeout
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('requestTimeout', 10000);
Cypress.config('responseTimeout', 10000);
