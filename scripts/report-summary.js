#!/usr/bin/env node
'use strict';

// Turns a Newman JSON report into a short Markdown summary.
// Locally it prints to stdout; on GitHub Actions it also appends to the job
// summary, so a failed run is readable without downloading the HTML report.

const fs = require('fs');

const reportPath = process.argv[2] || 'reports/newman-report.json';

if (!fs.existsSync(reportPath)) {
  console.error(`No Newman report at ${reportPath}. Run "npm test" first.`);
  process.exit(1);
}

const run = JSON.parse(fs.readFileSync(reportPath, 'utf8')).run;
const s = run.stats;
const failures = run.failures || [];

const lines = [];
lines.push('## Newman — Restful Booker API tests', '');
lines.push('| Metric | Executed | Failed |');
lines.push('|---|---:|---:|');
['requests', 'assertions', 'testScripts', 'prerequestScripts'].forEach((key) => {
  if (!s[key]) return;
  lines.push(`| ${key} | ${s[key].total} | ${s[key].failed} |`);
});
lines.push('');
lines.push(`Duration: **${(run.timings.completed - run.timings.started) / 1000}s** · `
  + `average response time: **${Math.round(run.timings.responseAverage)} ms**`);
lines.push('');

if (failures.length === 0) {
  lines.push('All assertions passed.');
} else {
  lines.push(`### ${failures.length} failed assertion(s)`, '');
  lines.push('| Request | Assertion | Detail |');
  lines.push('|---|---|---|');
  failures.forEach((f) => {
    const request = (f.source && f.source.name) || 'unknown request';
    const assertion = (f.error && f.error.test) || '—';
    const detail = ((f.error && f.error.message) || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(`| ${request} | ${assertion} | ${detail} |`);
  });
}

const markdown = lines.join('\n') + '\n';
process.stdout.write(markdown);

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}

process.exit(failures.length === 0 ? 0 : 1);
