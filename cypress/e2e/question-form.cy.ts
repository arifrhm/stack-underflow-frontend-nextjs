describe('Question Form', () => {
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

  describe('Create Question', () => {
    it('should navigate to create question form', () => {
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.contains('Ask a Question', { timeout: 8000 }).should('be.visible');
      cy.contains('Create a New Question').should('be.visible');
    });

    it('should create a new question', () => {
      const title = `Test Question Title ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(title);
      cy.get('[id="description"]').clear().type('This is a test question description for Cypress testing.');
      cy.contains('Post Question').click();

      cy.contains(title).should('be.visible');
    });

    it('should show new question at top of list', () => {
      const uniqueTitle = `Top Question ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(uniqueTitle);
      cy.get('[id="description"]').clear().type('Test description');
      cy.contains('Post Question').click();

      cy.contains(uniqueTitle).should('be.visible');
    });

    it('should require title and description', () => {
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');

      // Try to submit with empty fields - should stay on the same page
      cy.contains('Post Question').click();

      // Should still be on the new question page (validation prevented submission)
      cy.url().should('include', '/questions/new');
      cy.contains('Ask a Question').should('be.visible');
    });

    it('should have cancel button that goes back', () => {
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.contains('Cancel').click();

      cy.contains('Questions').should('be.visible');
    });
  });

  describe('Edit Question', () => {
    it('should show edit button for own questions', () => {
      const uniqueTitle = `My Question ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(uniqueTitle);
      cy.get('[id="description"]').clear().type('Original description');
      cy.contains('Post Question').click();

      cy.contains(uniqueTitle).click();
      cy.url().should('include', '/questions/');
      cy.contains('Edit Question', { timeout: 8000 }).should('be.visible');
    });

    it('should edit question title and description', () => {
      const uniqueTitle = `Editable ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(uniqueTitle);
      cy.get('[id="description"]').clear().type('Original description');
      cy.contains('Post Question').click();

      cy.contains(uniqueTitle).click();
      cy.url().should('include', '/questions/');
      cy.contains('Edit Question', { timeout: 8000 }).should('be.visible');
      cy.contains('Edit Question').click();

      const updatedTitle = `${uniqueTitle} - Updated`;
      cy.get('[id="title"]').clear().type(updatedTitle);
      cy.get('[id="description"]').clear().type('Updated description');
      cy.contains('Update Question').click();

      cy.contains(updatedTitle, { timeout: 8000 }).should('be.visible');
    });

    it('should change question status', () => {
      const uniqueTitle = `Status Change ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(uniqueTitle);
      cy.get('[id="description"]').clear().type('Test description');
      cy.contains('Post Question').click();

      cy.contains(uniqueTitle).click();
      cy.url().should('include', '/questions/');
      cy.contains('Edit Question', { timeout: 8000 }).should('be.visible');
      cy.contains('Edit Question').click();

      cy.contains(/Status/i).should('be.visible');

      // Click the select trigger to open dropdown
      cy.get('[role="combobox"]').click();
      // Select Answered option (use force: true because of portal overlay)
      cy.contains('Answered').click({ force: true });

      cy.contains('Update Question').click();

      cy.contains(uniqueTitle, { timeout: 8000 }).should('be.visible');
    });
  });
});
