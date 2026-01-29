describe('Specific Authorization Tests', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('1. Question Edit Protection - Line 81', () => {
    it('should verify isOwner logic: user?.id === question.authorId', () => {
      // Test Case 1: isOwner = true (user owns the question)
      cy.visit('/');
      cy.get('[id="username"]').type('owner1');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type('Owner Question Test');
      cy.get('[id="description"]').clear().type('This proves isOwner logic');
      cy.contains('Post Question').click();
      
      // Verify isOwner = true: Edit button is visible
      cy.contains('Owner Question Test').click();
      cy.contains('Edit Question', { timeout: 8000 }).should('be.visible');
    });
  });

  describe('2. Question Form Protection - Lines 48-51', () => {
    it('should protect direct edit URL access', () => {
      // Test Case: Try to access edit URL without ownership
      cy.visit('/');
      cy.get('[id="username"]').type('unauthorized');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      
      // Try direct access to edit page for question ID 1 (pre-populated)
      cy.visit('/questions/1/edit');
      
      // QuestionForm.tsx:48-51 should redirect unauthorized users
      // Should not stay on edit page
      cy.url().should('not.include', '/edit');
    });
  });

  describe('3. Comment Edit Protection - Line 147', () => {
    it('should verify isCommentOwner logic: user?.id === comment.authorId', () => {
      // Test Case 1: isCommentOwner = true
      cy.visit('/');
      cy.get('[id="username"]').type('commentowner');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      
      // Create question and comment
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type('Comment Owner Test');
      cy.get('[id="description"]').clear().type('Testing comment ownership');
      cy.contains('Post Question').click();
      
      cy.contains('Comment Owner Test').click();
      cy.get('textarea').last().clear().type('My own comment');
      cy.contains('Post Comment').click();
      
      // Verify isCommentOwner = true: Edit button visible
      cy.contains('My own comment').should('be.visible');
      cy.contains('Edit').should('be.visible');
    });
  });

  describe('4. Render Loop Logic Verification', () => {
    it('should verify conditional rendering in comment loop', () => {
      // This test verifies the render logic in QuestionDetail.tsx:146-196
      cy.visit('/');
      cy.get('[id="username"]').type('renderloop');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      
      const questionTitle = `Render Loop Test ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.get('[id="title"]').clear().type(questionTitle);
      cy.get('[id="description"]').clear().type('Testing render loop');
      cy.contains('Post Question').click();
      
      cy.contains(questionTitle).click();
      cy.get('textarea').last().clear().type('First comment by owner');
      cy.contains('Post Comment').click();
      
      // Verify render logic: {isCommentOwner && !isEditing && (...Edit button...)}
      // This should render Edit button for comment owner
      cy.contains('First comment by owner').should('be.visible');
      cy.contains('Edit').should('be.visible');
      cy.contains('(you)').should('be.visible');
    });
  });

  describe('5. Negative Test Cases', () => {
    it('should verify non-owner cannot edit existing questions', () => {
      // Login as regular user
      cy.visit('/');
      cy.get('[id="username"]').type('regularuser');
      cy.get('[id="password"]').type('test123');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
      
      // Try to view pre-populated questions (not owned by current user)
      // Should not show edit buttons
      cy.get('body').then((body) => {
        if (body.text().includes('How to center a div in CSS?')) {
          cy.contains('How to center a div in CSS?').click();
          cy.contains('Edit Question').should('not.exist');
        }
      });
    });
  });
});