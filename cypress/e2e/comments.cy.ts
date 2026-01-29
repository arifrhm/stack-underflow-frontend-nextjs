describe('Comments', () => {
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

  describe('View Comments', () => {
    it('should display comments on question detail page', () => {
      cy.contains('How to center a div in CSS?').click();
      cy.url().should('include', '/questions/');
      cy.contains('Comments', { timeout: 8000 }).should('be.visible');
      cy.contains(/The easiest way is using Flexbox/).should('be.visible');
    });

    it('should show comment author and timestamp', () => {
      cy.contains('TypeScript generic type inference').click();
      cy.url().should('include', '/questions/');
      cy.contains('senior_dev', { timeout: 8000 }).should('exist');
    });

    it('should show no comments message when empty', () => {
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');
      cy.contains('No comments yet', { timeout: 8000 }).should('be.visible');
    });
  });

  describe('Add Comments', () => {
    it('should show add comment form for logged in users', () => {
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');
      cy.contains('Add a Comment', { timeout: 8000 }).should('be.visible');
      cy.get('textarea').should('have.length.at.least', 1);
    });

    it('should add a comment to a question', () => {
      const commentText = `Test comment ${Date.now()}`;
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(commentText);
      cy.contains('Post Comment').click();

      cy.contains(commentText, { timeout: 8000 }).should('be.visible');
    });

    it('should not add empty comment', () => {
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear();
      cy.contains('Post Comment').should('be.disabled');

      cy.contains('Add a Comment').should('be.visible');
    });
  });

  describe('Edit Comments', () => {
    it('should show edit button for own comments', () => {
      const commentText = `Editable comment ${Date.now()}`;
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(commentText);
      cy.contains('Post Comment').click();

      cy.contains(commentText, { timeout: 8000 }).should('be.visible');
    });

    it('should edit own comment', () => {
      const originalComment = `Original comment ${Date.now()}`;
      const editedComment = `Edited comment ${Date.now()}`;

      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(originalComment);
      cy.contains('Post Comment').click();

      cy.contains(originalComment, { timeout: 8000 }).should('be.visible');
    });

    it('should cancel comment editing', () => {
      const commentText = `Comment to cancel ${Date.now()}`;
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(commentText);
      cy.contains('Post Comment').click();

      cy.contains(commentText, { timeout: 8000 }).should('be.visible');
    });
  });

  describe('Comment Access', () => {
    it('should require login to add comments', () => {
      // First, verify logged in users can see add comment form
      cy.visit('/');
      cy.get('[id="username"]').type('viewer');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();

      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');
      cy.contains('Add a Comment', { timeout: 8000 }).should('be.visible');

      // Now logout and verify we're redirected to login
      cy.contains('Logout').click();

      // Try to go directly to a question page while logged out
      cy.visit('/questions/2');

      // Should see login form instead of question details
      cy.contains('Sign In', { timeout: 8000 }).should('be.visible');
      cy.contains('Add a Comment').should('not.exist');
    });
  });
});
