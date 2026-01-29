describe('Questions', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
    // Login manually
    cy.get('[id="username"]').type('testuser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');
  });

  describe('Question List', () => {
    it('should display all questions', () => {
      cy.contains('Questions').should('be.visible');
      cy.contains('How to center a div in CSS?').should('be.visible');
      cy.contains('React useEffect dependency warning').should('be.visible');
      cy.contains('TypeScript generic type inference').should('be.visible');
    });

    it('should display question details correctly', () => {
      cy.contains('How to center a div in CSS?').should('be.visible');
      cy.contains(/I\'ve been trying to center a div/).should('be.visible');
      cy.contains(/Open/).should('exist');
      cy.contains(/Answered/).should('exist');
      cy.contains(/Closed/).should('exist');
    });

    it('should have Ask Question button', () => {
      cy.contains('Ask Question').should('be.visible');
    });

    it('should navigate to question detail on click', () => {
      cy.contains('How to center a div in CSS?').click();
      cy.url().should('include', '/questions/');
      cy.contains('How to center a div in CSS?', { timeout: 5000 }).should('be.visible');
    });

    it('should display question metadata', () => {
      cy.contains(/comment/).should('exist');
      cy.contains(/webdev123/).should('exist');
    });
  });
});
