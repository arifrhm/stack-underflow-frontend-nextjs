describe('Authentication', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Login Flow', () => {
    it('should display login form when not authenticated', () => {
      cy.visit('/');
      cy.contains('Stack Underflow').should('be.visible');
      cy.contains('Enter your username to continue').should('be.visible');
      cy.get('[id="username"]').should('be.visible');
      cy.get('[id="password"]').should('be.visible');
      cy.contains('Sign In').should('be.visible');
      cy.contains('This is a mock login').should('be.visible');
    });

    it('should login with any username and password', () => {
      cy.visit('/');
      cy.get('[id="username"]').clear().type('testuser');
      cy.get('[id="password"]').clear().type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      cy.contains('testuser').should('be.visible');
    });

    it('should show username in header after login', () => {
      cy.visit('/');
      cy.get('[id="username"]').type('john_doe');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();

      // Wait for page to load after login
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      cy.get('header').within(() => {
        cy.contains('john_doe').should('be.visible');
      });
    });

    it('should not login without username', () => {
      cy.visit('/');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();

      // Should stay on login form - no username provided
      cy.contains('Stack Underflow').should('be.visible');
      cy.contains('Questions').should('not.exist');
    });
  });

  describe('Logout Flow', () => {
    it('should logout and return to login page', () => {
      cy.visit('/');
      cy.get('[id="username"]').type('testuser');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();

      // Verify logged in
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');

      // Logout
      cy.contains('Logout').click();

      // Should return to login form
      cy.contains('Stack Underflow').should('be.visible');
      cy.contains('Enter your username to continue').should('be.visible');
      cy.contains('Questions').should('not.exist');
    });
  });
});
