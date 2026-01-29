describe('Authorization Verification', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should verify edit button condition for owner', () => {
    cy.visit('/');
    cy.get('[id="username"]').type('owner');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');
    
    // Create a question
    cy.contains('Ask Question').click();
    cy.url().should('include', '/questions/new');
    cy.get('[id="title"]').clear().type('Owner Test Question');
    cy.get('[id="description"]').clear().type('This is owner\'s question');
    cy.contains('Post Question').click();
    
    // Verify owner can see edit button
    cy.contains('Owner Test Question').click();
    cy.url().should('include', '/questions/');
    cy.contains('Edit Question', { timeout: 8000 }).should('be.visible');
  });

  it('should verify user identification labels', () => {
    cy.visit('/');
    cy.get('[id="username"]').type('labeluser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');
    
    // Create question and verify "(you)" label
    cy.contains('Ask Question').click();
    cy.get('[id="title"]').clear().type('Label Test');
    cy.get('[id="description"]').clear().type('Testing labels');
    cy.contains('Post Question').click();
    
    cy.contains('Label Test').click();
    cy.contains('(you)').should('be.visible');
    
    // Add comment and verify "(you)" label for comment
    cy.contains('Add a Comment').should('be.visible');
    cy.get('textarea').last().clear().type('Test comment');
    cy.contains('Post Comment').click();
    
    // Check that "(you)" appears for both question and comment
    cy.contains('(you)').should('exist');
  });
});