describe('Debug Step by Step', () => {
  it('Step 1: Check if login works', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();

    // Check if we see Questions page
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');
    cy.contains('debuguser').should('be.visible');

    // Check if questions are displayed
    cy.contains('How to center a div in CSS?').should('be.visible');
    cy.contains('React useEffect dependency warning').should('be.visible');
    cy.contains('TypeScript generic type inference').should('be.visible');

    cy.log('✅ Step 1: Login works and questions are displayed');
  });

  it('Step 2: Check if clicking question link works', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Click on first question
    cy.contains('How to center a div in CSS?').click();

    // Check URL - should include /questions/
    cy.url().should('include', '/questions/');

    cy.log('✅ Step 2: Click on question link works');
  });

  it('Step 3: Check if question detail page renders', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Click on first question
    cy.contains('How to center a div in CSS?').click();

    // Wait for URL to change
    cy.url().should('include', '/questions/');

    // Check if question title is visible (not "Question not found")
    cy.contains('How to center a div in CSS?', { timeout: 8000 }).should('be.visible');
    cy.contains('Question Details', { timeout: 8000 }).should('be.visible');

    cy.log('✅ Step 3: Question detail page renders');
  });

  it('Step 4: Check if comments section is visible', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    cy.contains('How to center a div in CSS?').click();
    cy.url().should('include', '/questions/');

    // Wait for page to load
    cy.contains('How to center a div in CSS?', { timeout: 8000 }).should('be.visible');

    // Check for Comments section
    cy.contains('Comments', { timeout: 10000 }).should('be.visible');

    cy.log('✅ Step 4: Comments section is visible');
  });

  it('Step 5: Check if create question button exists', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Check for Ask Question button
    cy.contains('Ask Question').should('be.visible');
    cy.contains('Ask Question').should('not.be.disabled');

    cy.log('✅ Step 5: Ask Question button exists');
  });

  it('Step 6: Check create question form', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Navigate to create form
    cy.contains('Ask Question').click();

    // Check URL
    cy.url().should('include', '/questions/new');

    // Check form elements
    cy.contains('Ask a Question', { timeout: 8000 }).should('be.visible');
    cy.get('[id="title"]').should('be.visible');
    cy.get('[id="description"]').should('be.visible');
    cy.contains('Post Question').should('be.visible');

    cy.log('✅ Step 6: Create question form loads');
  });

  it('Step 7: Create a question and verify it appears', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Create question
    const title = `Debug Test Question ${Date.now()}`;
    cy.contains('Ask Question').click();
    cy.url().should('include', '/questions/new');

    cy.get('[id="title"]').type(title);
    cy.get('[id="description"]').type('This is a debug test question');
    cy.contains('Post Question').click();

    // Go back to questions
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Check if new question appears
    cy.contains(title).should('be.visible');

    cy.log('✅ Step 7: Can create question and it appears');
  });

  it('Step 8: Access the newly created question', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // First create a question
    const title = `Navigation Test ${Date.now()}`;
    cy.contains('Ask Question').click();
    cy.url().should('include', '/questions/new');

    cy.get('[id="title"]').type(title);
    cy.get('[id="description"]').type('Testing navigation');
    cy.contains('Post Question').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Now click on the newly created question
    cy.contains(title).click();

    // Should go to question detail page
    cy.url().should('include', '/questions/');
    cy.contains(title, { timeout: 8000 }).should('be.visible');

    cy.log('✅ Step 8: Can access newly created question');
  });

  it('Step 9: Check comments section on new question', () => {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[id="username"]').type('debuguser');
    cy.get('[id="password"]').type('test123');
    cy.contains('Sign In').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Create a question
    const title = `Comment Test ${Date.now()}`;
    cy.contains('Ask Question').click();
    cy.url().should('include', '/questions/new');

    cy.get('[id="title"]').type(title);
    cy.get('[id="description"]').type('Test question for comments');
    cy.contains('Post Question').click();
    cy.contains('Questions', { timeout: 5000 }).should('be.visible');

    // Click on the question
    cy.contains(title).click();
    cy.url().should('include', '/questions/');

    // Check if we can see the question details
    cy.contains(title, { timeout: 8000 }).should('be.visible');

    // Check for Comments section
    cy.contains('Comments', { timeout: 10000 }).should('be.visible');
    cy.contains('Add a Comment', { timeout: 10000 }).should('be.visible');

    cy.log('✅ Step 9: Comments section is visible on new question');
  });
});
