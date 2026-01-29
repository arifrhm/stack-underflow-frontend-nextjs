/**
 * Incremental Evidence Reporter for Cypress
 * Writes test results incrementally as tests run
 */

const fs = require('fs');
const path = require('path');

const evidenceDir = path.join(process.cwd(), 'cypress', 'evidence');
const jsonLogPath = path.join(evidenceDir, 'test-results.jsonl');
const summaryPath = path.join(evidenceDir, 'summary.json');

// Ensure evidence directory exists
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

let specResults = [];

function writeLogEntry(entry) {
  const logEntry = {
    ...entry,
    loggedAt: new Date().toISOString(),
  };
  fs.appendFileSync(jsonLogPath, JSON.stringify(logEntry) + '\n');
}

function updateSummary() {
  const summary = {
    totalTests: specResults.length,
    passed: specResults.filter(t => t.status === 'passed').length,
    failed: specResults.filter(t => t.status === 'failed').length,
    pending: specResults.filter(t => t.status === 'pending').length,
    skipped: specResults.filter(t => t.status === 'skipped').length,
    lastUpdated: new Date().toISOString(),
  };
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
}

module.exports = (on, config) => {
  on('before:run', (details) => {
    // Clear previous results
    specResults = [];
    if (fs.existsSync(jsonLogPath)) {
      fs.unlinkSync(jsonLogPath);
    }
    if (fs.existsSync(summaryPath)) {
      fs.unlinkSync(summaryPath);
    }

    // Write run start metadata
    fs.writeFileSync(
      path.join(evidenceDir, 'run-started.json'),
      JSON.stringify({
        startedAt: new Date().toISOString(),
        browser: details.browser?.displayName || 'unknown',
        specs: details.specs?.length || 0,
      }, null, 2)
    );

    console.log('\n========================================');
    console.log('🧪 Starting Test Run');
    console.log('Browser:', details.browser?.displayName);
    console.log('Specs:', details.specs?.length);
    console.log('========================================\n');
  });

  on('after:run', (results) => {
    // Write run completion metadata
    fs.writeFileSync(
      path.join(evidenceDir, 'run-completed.json'),
      JSON.stringify({
        completedAt: new Date().toISOString(),
        totalTests: results.totalTests,
        totalPassed: results.totalPassed,
        totalFailed: results.totalFailed,
        totalPending: results.totalPending,
        totalSkipped: results.totalSkipped,
        duration: results.totalDuration,
      }, null, 2)
    );

    console.log('\n========================================');
    console.log('✅ Test Run Completed');
    console.log('Total:', results.totalTests);
    console.log('Passed:', results.totalPassed);
    console.log('Failed:', results.totalFailed);
    console.log('Duration:', Math.round(results.totalDuration / 1000) + 's');
    console.log('========================================');
    console.log('📁 Evidence saved to: cypress/evidence/\n');
  });

  on('before:spec', (spec) => {
    console.log(`\n📋 Running: ${spec.relative}`);
    specResults = [];
  });

  on('after:spec', (spec, results) => {
    // Process test results from this spec
    results.tests.forEach((test) => {
      const testResult = {
        spec: spec.relative,
        title: test.title,
        fullTitle: test.title,
        status: test.state,
        duration: test.duration || 0,
        timestamp: new Date().toISOString(),
        error: test.err?.message,
        screenshot: test.screenshots && test.screenshots.length > 0
          ? test.screenshots[test.screenshots.length - 1].path
          : null,
      };

      specResults.push(testResult);
      writeLogEntry(testResult);

      // Log individual test result
      const emoji = test.state === 'passed' ? '✅' : test.state === 'failed' ? '❌' : '⚠️';
      const duration = Math.round((test.duration || 0) / 100) / 10;
      console.log(`  ${emoji} ${test.title} (${duration}s)`);

      // Update summary immediately after each test
      updateSummary();
    });

    // Update summary after spec completes
    updateSummary();
  });

  return config;
};
