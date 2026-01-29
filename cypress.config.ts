import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/evidence/screenshots',
    trashAssetsBeforeRuns: true,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    responseTimeout: 30000,
    requestTimeout: 10000,

    screenshot: {
      blackout: [],
      capture: 'runner',
      scale: false,
      disableTimersAndAnimations: true,
    },

    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.ts')(on, config);
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
