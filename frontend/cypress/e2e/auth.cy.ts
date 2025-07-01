describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Navigation', () => {
    it('should navigate between login and register pages', () => {
      cy.visit('/login');
      cy.contains("Don't have an account?").click();
      cy.url().should('include', '/register');

      cy.contains('Already have an account?').click();
      cy.url().should('include', '/login');
    });

    it('should show login form', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });

    it('should show register form', () => {
      cy.visit('/register');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  });

  describe('Form Interactions', () => {
    it('should allow typing in login form fields', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="email"]').should('have.value', 'test@example.com');
      cy.get('input[name="password"]').should('have.value', 'password123');
    });

    it('should allow typing in register form fields', () => {
      cy.visit('/register');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="name"]').should('have.value', 'Test User');
      cy.get('input[name="email"]').should('have.value', 'test@example.com');
      cy.get('input[name="password"]').should('have.value', 'password123');
    });

    it('should allow clicking submit buttons', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      // Button should be clickable
    });
  });
});
