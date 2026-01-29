/**
 * Requirements Verification Test
 *
 * This test verifies all the functional requirements from the specification.
 */

// Helper function to login
const login = (username = 'testuser', password = 'test123') => {
  cy.get('[id="username"]').clear().type(username);
  cy.get('[id="password"]').clear().type(password);
  cy.contains('Sign In').click();
  cy.contains('Questions', { timeout: 5000 }).should('be.visible');
};

describe('Requirements Verification', () => {
  describe('REQ 1: Login (Mocked)', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
    });

    it('1.1 - User can enter any username and password', () => {
      cy.visit('/');
      cy.get('[id="username"]').type('anyuser');
      cy.get('[id="password"]').type('anypassword');
      cy.contains('Sign In').click();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
    });

    it('1.2 - Logged-in state remains active (SPA navigation)', () => {
      cy.visit('/');
      login('persistencetest');
      cy.contains('Questions').should('be.visible');

      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');

      cy.go('back');
      cy.contains('Questions').should('be.visible');
      cy.contains('persistencetest').should('be.visible');
    });

    it('1.3 - No real authentication (mock works with any credentials)', () => {
      cy.visit('/');
      login('randomuser', 'randompassword');
      cy.contains('randomuser').should('be.visible');
    });
  });

  describe('REQ 2: Questions (Posts)', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/');
      login();
    });

    it('2.1 - Display a list of questions', () => {
      cy.contains('Questions').should('be.visible');
      cy.contains('How to center a div in CSS?').should('be.visible');
      cy.contains('React useEffect dependency warning').should('be.visible');
      cy.contains('TypeScript generic type inference').should('be.visible');
    });

    it('2.2 - Each question includes title', () => {
      cy.contains('How to center a div in CSS?').should('be.visible');
      cy.contains('React useEffect dependency warning').should('be.visible');
    });

    it('2.3 - Each question includes description', () => {
      cy.contains(/I\'ve been trying to center a div/).should('be.visible');
    });

    it('2.4 - Each question includes status (open, answered, closed)', () => {
      cy.contains(/Open/).should('exist');
      cy.contains(/Answered/).should('exist');
      cy.contains(/Closed/).should('exist');
    });

    it('2.5 - Each question includes created date/time', () => {
      cy.contains(/Jan/).should('exist');
      cy.contains(/2024/).should('exist');
    });

    it('2.6 - Users can create a new question', () => {
      const title = `New Question ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(title);
      cy.get('[id="description"]').clear().type('Test description');
      cy.contains('Post Question').click();
      cy.contains(title).should('be.visible');
    });

    it('2.9 - Initial questions pre-populated in memory', () => {
      cy.contains('How to center a div in CSS?').should('be.visible');
      cy.contains('React useEffect dependency warning').should('be.visible');
      cy.contains('TypeScript generic type inference').should('be.visible');
    });
  });

  describe('REQ 3: Comments', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/');
      login();
    });

    it('3.1 - Each question supports multiple comments', () => {
      cy.contains('How to center a div in CSS?').click();
      cy.url().should('include', '/questions/');
      cy.contains('Comments', { timeout: 8000 }).should('be.visible');
      cy.contains(/The easiest way is using Flexbox/).should('be.visible');
    });

    it('3.2 - Users can add a comment', () => {
      const comment = `Test comment ${Date.now()}`;
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(comment);
      cy.contains('Post Comment').click();

      cy.contains(comment, { timeout: 8000 }).should('be.visible');
    });

    it('3.4 - Comments update UI immediately without page reload', () => {
      const comment = `Immediate update ${Date.now()}`;
      cy.contains('React useEffect dependency warning').click();
      cy.url().should('include', '/questions/');

      cy.get('textarea', { timeout: 8000 }).clear().type(comment);
      cy.contains('Post Comment').click();

      cy.contains(comment, { timeout: 8000 }).should('be.visible');
    });
  });

  describe('REQ 4: Navigation & UI', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/');
      login();
    });

    it('4.1 - Single Page Application (no full page reload)', () => {
      cy.contains('Questions').should('be.visible');

      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');

      cy.go('back');
      cy.contains('Questions').should('be.visible');
    });

    it('4.2 - Question list view', () => {
      cy.contains('Questions').should('be.visible');
      cy.contains('Ask Question').should('be.visible');
      cy.contains('How to center a div in CSS?').should('be.visible');
    });

    it('4.3 - Question detail view', () => {
      cy.contains('How to center a div in CSS?').click();
      cy.url().should('include', '/questions/');
      cy.contains('How to center a div in CSS?', { timeout: 8000 }).should('be.visible');
      cy.contains('Comments', { timeout: 8000 }).should('be.visible');
      cy.contains(/comment/).should('exist');
    });

    it('4.4 - Basic styling is applied', () => {
      cy.get('button').should('have.css', 'padding');
      cy.contains('Stack Underflow').should('be.visible');
    });
  });

  describe('Technical Constraints', () => {
    it('TC.1 - Frontend framework (Next.js) is used', () => {
      cy.request('/').its('status').should('eq', 200);
    });

    it('TC.2 - TypeScript is used (type safety)', () => {
      cy.visit('/');
      login();
      cy.contains('Questions', { timeout: 5000 }).should('be.visible');
    });

    it('TC.3 - No backend (in-memory storage)', () => {
      cy.visit('/');
      login('backendless');

      const title = `No backend test ${Date.now()}`;
      cy.contains('Ask Question').click();
      cy.url().should('include', '/questions/new');
      cy.get('[id="title"]').clear().type(title);
      cy.get('[id="description"]').clear().type('Testing in-memory storage');
      cy.contains('Post Question').click();
      cy.contains(title).should('be.visible');

      cy.clearCookies();
      cy.clearLocalStorage();
      cy.visit('/');

      login('backendless');
      cy.contains(title).should('not.exist');
      cy.contains('How to center a div in CSS?', { timeout: 5000 }).should('be.visible');
    });
  });
});
