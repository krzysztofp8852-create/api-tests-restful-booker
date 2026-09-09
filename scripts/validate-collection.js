#!/usr/bin/env node
'use strict';

// Guards the two things that silently rot in a Postman project:
//   1. the collection itself (unparsable JSON, requests without assertions,
//      hard-coded base URLs or dates, leftover console.log),
//   2. traceability — every TC-xxx in the collection must exist in both the
//      English and the Polish test-case list, and vice versa.
// Run with: npm run lint:collection

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COLLECTION = path.join(ROOT, 'postman', 'Restful-Booker.postman_collection.json');
const ENVIRONMENT = path.join(ROOT, 'postman', 'Restful-Booker.postman_environment.json');
const CASE_DOCS = [
  path.join(ROOT, 'docs', 'en', 'test-cases.md'),
  path.join(ROOT, 'docs', 'pl', 'przypadki-testowe.md'),
];

const errors = [];
const fail = (msg) => errors.push(msg);

const collection = JSON.parse(fs.readFileSync(COLLECTION, 'utf8'));
JSON.parse(fs.readFileSync(ENVIRONMENT, 'utf8'));

const requests = [];
(function walk(items) {
  items.forEach((item) => {
    if (item.item) walk(item.item);
    else requests.push(item);
  });
})(collection.item);

const scriptText = (item, listen) => {
  const event = (item.event || []).find((e) => e.listen === listen);
  return event ? event.script.exec.join('\n') : '';
};

// --- collection hygiene --------------------------------------------------
requests.forEach((item) => {
  const tests = scriptText(item, 'test');
  const pre = scriptText(item, 'prerequest');
  const url = typeof item.request.url === 'string' ? item.request.url : JSON.stringify(item.request.url);
  const raw = (item.request.body && item.request.body.raw) || '';

  if (!tests.includes('pm.test(')) fail(`${item.name}: no pm.test() assertion`);
  if (!url.includes('{{baseUrl}}')) fail(`${item.name}: URL does not use {{baseUrl}} (${url})`);
  if (/console\.log/.test(tests + pre)) fail(`${item.name}: leftover console.log in a script`);
  if (/\b20\d{2}-\d{2}-\d{2}\b/.test(raw)) {
    fail(`${item.name}: hard-coded date in the request body — use the generated date variables`);
  }
  if (/pm\.environment\.set\(/.test(tests + pre)) {
    fail(`${item.name}: writes to the environment — runtime state belongs in collection variables`);
  }
});

if (!(collection.event || []).some((e) => e.listen === 'prerequest')) {
  fail('collection: missing the collection-level pre-request script that seeds run data');
}
if (!(collection.event || []).some((e) => e.listen === 'test')) {
  fail('collection: missing the collection-level test script with the global assertions');
}

// --- traceability --------------------------------------------------------
const idsInCollection = [...new Set(
  requests.map((item) => (item.name.match(/^TC-\d{3}/) || [])[0]).filter(Boolean)
)].sort();

const duplicates = idsInCollection.filter(
  (id) => requests.filter((item) => item.name.startsWith(id)).length > 1
);
duplicates.forEach((id) => fail(`${id}: more than one request carries this id`));

idsInCollection.forEach((id, i) => {
  const expected = 'TC-' + String(i + 1).padStart(3, '0');
  if (id !== expected) fail(`test case ids are not contiguous — expected ${expected}, found ${id}`);
});

CASE_DOCS.forEach((docPath) => {
  const doc = fs.readFileSync(docPath, 'utf8');
  const idsInDoc = [...new Set((doc.match(/TC-\d{3}/g) || []))];
  const rel = path.relative(ROOT, docPath);

  idsInCollection.forEach((id) => {
    if (!idsInDoc.includes(id)) fail(`${rel}: ${id} is automated but not documented`);
  });
  idsInDoc.forEach((id) => {
    if (!idsInCollection.includes(id)) fail(`${rel}: ${id} is documented but has no request`);
  });
});

// --- report -------------------------------------------------------------
if (errors.length) {
  console.error('Collection validation failed:\n');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log(
  `Collection OK — ${collection.item.length} folders, ${requests.length} requests, `
  + `${idsInCollection.length} test cases (${idsInCollection[0]}–${idsInCollection[idsInCollection.length - 1]}), `
  + 'traceability matches both test-case lists.'
);
