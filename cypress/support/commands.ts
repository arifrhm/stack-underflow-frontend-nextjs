/// <reference types="cypress" />

/**
 * Jitter Backoff Retry Mechanism for Cypress Commands
 * Maximum 3 retries with exponential backoff + random jitter
 */

// Extend Cypress interface with custom commands
declare namespace Cypress {
  interface Chainable {
    login(username: string, password?: string): Chainable<void>;
    createQuestion(title: string, description: string): Chainable<void>;
    addComment(content: string): Chainable<void>;
    retryWithBackoff<T>(action: () => T, maxRetries?: number, baseDelay?: number): Chainable<T>;
    waitForElement(selector: string, timeout?: number): Chainable<void>;
    safeClick(selector: string): Chainable<void>;
    safeType(selector: string, text: string): Chainable<void>;
  }
}

/**
 * Calculate delay with jitter (random factor to avoid thundering herd)
 */
function getJitterDelay(baseDelay: number, attempt: number): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  // Add jitter: random value between 0-50% of exponential delay
  const jitter = Math.random() * exponentialDelay * 0.5;
  return exponentialDelay + jitter;
}

/**
 * Login command with retry (max 3 retries)
 */
Cypress.Commands.add('login', (username: string, password = 'test123') => {
  const maxRetries = 3;
  const baseDelay = 1000;

  const attemptLogin = (attempt = 0): Cypress.Chainable => {
    return cy.visit('/', { timeout: 10000 }).then(() => {
      return cy.get('[id="username"]', { timeout: 8000 })
        .clear()
        .type(username)
        .then(() => {
          return cy.get('[id="password"]', { timeout: 8000 }).clear().type(password);
        })
        .then(() => {
          return cy.get('button[type="submit"]').contains('Sign In').click();
        })
        .then(() => {
          return cy.contains('Questions', { timeout: 10000 }).should('be.visible');
        });
    });
  };

  // Simple retry with exponential backoff and jitter
  let attempt = 0;
  const tryLogin = () => {
    return attemptLogin().catch((error) => {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(baseDelay, attempt - 1);
        cy.log(`⚠️  Login attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
        return cy.wait(delay).then(() => tryLogin());
      }
      throw error;
    });
  };

  return tryLogin();
});

/**
 * Create question with retry
 */
Cypress.Commands.add('createQuestion', (title: string, description: string) => {
  const maxRetries = 3;
  const baseDelay = 1000;

  const attemptCreate = (attempt = 0): Cypress.Chainable => {
    return cy.contains('Ask Question').click().then(() => {
      return cy.url().should('include', '/questions/new').then(() => {
        return cy.get('[id="title"]', { timeout: 10000 }).should('be.visible').clear().type(title);
      }).then(() => {
        return cy.get('[id="description"]', { timeout: 10000 }).should('be.visible').clear().type(description);
      }).then(() => {
        return cy.contains('Post Question').click();
      }).then(() => {
        return cy.contains('Questions', { timeout: 10000 }).should('be.visible');
      });
    });
  };

  let attempt = 0;
  const tryCreate = () => {
    return attemptCreate().catch((error) => {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(baseDelay, attempt - 1);
        cy.log(`⚠️  Create question attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
        return cy.wait(delay).then(() => tryCreate());
      }
      throw error;
    });
  };

  return tryCreate();
});

/**
 * Add comment with retry
 */
Cypress.Commands.add('addComment', (content: string) => {
  const maxRetries = 3;
  const baseDelay = 1000;

  const attemptAdd = (attempt = 0): Cypress.Chainable => {
    return cy.contains('Add a Comment').should('be.visible').then(() => {
      return cy.get('textarea').eq(1).clear().type(content);
    }).then(() => {
      return cy.contains('Post Comment').click();
    }).then(() => {
      return cy.contains(content, { timeout: 10000 }).should('be.visible');
    });
  };

  let attempt = 0;
  const tryAdd = () => {
    return attemptAdd().catch((error) => {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(baseDelay, attempt - 1);
        cy.log(`⚠️  Add comment attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
        return cy.wait(delay).then(() => tryAdd());
      }
      throw error;
    });
  };

  return tryAdd();
});

/**
 * Generic retry with exponential backoff and jitter
 */
Cypress.Commands.add('retryWithBackoff', (
  action: () => any,
  maxRetries = 3,
  baseDelay = 1000
) => {
  let attempt = 0;

  const tryAction = (): Cypress.Chainable => {
    try {
      return action();
    } catch (error) {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(baseDelay, attempt - 1);
        cy.log(`🔄 Retry attempt ${attempt}/${maxRetries} after ${Math.round(delay)}ms`);
        return cy.wait(delay).then(() => tryAction());
      }
      throw error;
    }
  };

  return tryAction();
});

/**
 * Wait for element with retry
 */
Cypress.Commands.add('waitForElement', (selector: string, timeout = 10000) => {
  return cy.get(selector, { timeout }).should('exist').should('be.visible');
});

/**
 * Safe click with retry
 */
Cypress.Commands.add('safeClick', (selector: string) => {
  const maxRetries = 3;
  let attempt = 0;

  const tryClick = () => {
    return cy.contains(selector, { timeout: 8000 }).click({ force: true }).catch((error) => {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(500, attempt - 1);
        cy.log(`⚠️  Click attempt ${attempt} failed, retrying...`);
        return cy.wait(delay).then(() => tryClick());
      }
      throw error;
    });
  };

  return tryClick();
});

/**
 * Safe type with retry
 */
Cypress.Commands.add('safeType', (selector: string, text: string) => {
  const maxRetries = 3;
  let attempt = 0;

  const tryType = () => {
    return cy.get(selector, { timeout: 8000 }).clear().should('be.visible').type(text).catch((error) => {
      if (attempt < maxRetries) {
        attempt++;
        const delay = getJitterDelay(500, attempt - 1);
        cy.log(`⚠️  Type attempt ${attempt} failed, retrying...`);
        return cy.wait(delay).then(() => tryType());
      }
      throw error;
    });
  };

  return tryType();
});
