# Test plan — Restful Booker API

Status: **executed** · Author: Krzysztof Pabich · Date: 2026-09-09 · Version: `1.1`

Polish copy: [`../pl/plan-testow.md`](../pl/plan-testow.md)

---

## 1. Purpose

Verify that the Restful Booker API behaves according to its public documentation for authentication and booking CRUD, hold every response against a schema contract, and document gaps (missing validation, unclear status codes, wrong media types) as defects.

## 2. Scope

**In scope**

- `GET /ping`
- `POST /auth`
- `POST /booking`, `GET /booking`, `GET /booking/:id`
- `PUT /booking/:id`, `PATCH /booking/:id`
- `DELETE /booking/:id`
- Both documented credential styles: `Cookie: token=…` and HTTP Basic
- Query filters: `firstname`, `lastname`, `checkin`/`checkout`
- Content negotiation: `application/json`, `application/xml`, unsupported types
- Response contracts (JSON Schema) for every JSON endpoint
- Negative cases: invalid credentials, missing fields, wrong types, out-of-range values, unparsable dates, malformed JSON, unknown ids, missing/invalid token
- Security smoke tests: SQL injection payload in credentials, user enumeration, mass assignment via unknown fields

**Out of scope**

- UI of any demo frontend
- Performance / load testing (JMeter) — only a per-response time budget is asserted
- Full security testing (authn/authz beyond the cases above, rate limiting, TLS configuration)
- Environments other than the public demo

## 3. Test object / environment

| Item | Value |
|---|---|
| Application | Restful Booker |
| Base URL | `https://restful-booker.herokuapp.com` |
| Docs | https://restful-booker.herokuapp.com/apidoc/index.html |
| Auth | `admin` / `password123` (public) |
| Tooling | Postman collection v2.1, Newman 6, Node.js 20 |
| CI | GitHub Actions — every push, every PR, nightly at 04:15 UTC |
| Constraint | Shared sandbox — data from other users may appear in `GET /booking` |

## 4. Test types

| Type | Covered? | Notes |
|---|---|---|
| Smoke | yes | Ping + auth + create + get (TC-001–TC-004) |
| Functional (positive) | yes | 16 cases across folders 00–07, both credential styles |
| Negative / validation | yes | 17 cases: missing fields, wrong types, ranges, malformed JSON, unknown ids |
| Authorization | yes | TC-014, TC-015, TC-020, TC-021, TC-040 (folder 05, before DELETE) |
| Contract / schema | yes | JSON Schema on `/auth`, `POST /booking`, `GET /booking`, `GET /booking/:id`, PUT/PATCH responses |
| Content negotiation | yes | TC-027 (XML), TC-042 (unsupported type) |
| Security (smoke) | yes | TC-024 injection, TC-023 user enumeration, TC-033 mass assignment |
| Non-functional (time budget) | partial | Global assertion: every response under `responseTimeBudgetMs` (5000 ms) |
| Regression | yes | Newman on every push and nightly (GitHub Actions) |

## 5. Approach

1. Explore the API in Postman, then freeze assertions in the collection.
2. Automate the happy path first (auth → create → get → update → delete), then layer negatives on top.
3. For negatives: record actual behaviour, compare with the docs and with the quality expectation, file a bug when they differ. The assertion always pins the **actual** response so CI stays green and a fix shows up as a failing test.
4. Validate every JSON response against a schema, not just the fields a case cares about — an added or renamed field breaks the contract test immediately.
5. Run Newman in GitHub Actions as a smoke and regression gate, with a traceability lint before it.

## 6. Test data strategy

The sandbox is shared and long-lived, which makes naive test data a source of flaky results. The collection therefore:

- generates a `runId` once per run and suffixes `firstname` / `lastname` with it, so the filter cases (TC-013, TC-025, TC-041) can assert an **exact** match instead of only "our id is somewhere in the list";
- derives all dates from the run date (`today + 7`, `+11`, `+13`, …), so no assertion ever expires — the previous version of this suite hard-coded September 2026 dates;
- keeps runtime state (token, booking ids, generated data, schemas) in **collection** variables and configuration (base URL, credentials, time budget) in the **environment**, so a run never rewrites the committed environment file;
- collects every booking created by a negative case in a teardown queue and deletes it in folder `08 Cleanup`, so a nightly CI run does not leak a booking a day into the shared data set.

## 7. Entry criteria

- [x] Collection imports without errors
- [x] Environment selected (`Restful Booker — Local`)
- [x] `GET /ping` returns 201
- [x] Node.js 20+ and `npm install` completed
- [x] `npm run lint:collection` passes (collection valid, traceability complete)

## 8. Exit criteria

- [x] All test cases in `test-cases.md` have status Pass or Fail — 32 Pass, 10 Fail, 0 Not run
- [x] Every failed case has a bug ID (BUG-001 … BUG-007)
- [x] `npm test` is green locally and on CI — 53 requests, 268 assertions, 0 failures
- [x] Seven bug reports written (`docs/bugs/`)
- [x] Every test case traced to a Postman request, enforced by `npm run lint:collection`
- [x] The run leaves no test data behind (folder `08 Cleanup` drains the teardown queue)

## 9. Deliverables

- Postman collection + environment (`postman/`)
- Newman HTML / JSON / JUnit reports (`reports/` after `npm test` or `npm run test:ci`)
- This test plan
- Test case list (TC-001–TC-042) with traceability and coverage-per-endpoint tables
- Bug reports BUG-001 … BUG-007
- CI pipeline with collection lint, availability gate, run summary and report artifacts

## 10. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Shared public API, other users' data in list endpoints | Medium | Run-scoped names; assert our ids are present, never the list length |
| API downtime / sleeping dyno / slow responses | Medium | CI waits for `GET /ping` → 201 before running (6 attempts); 15–20 s request timeout; 5 s per-response budget |
| Test data accumulating in the sandbox | Medium | Folder `08 Cleanup` deletes every booking created by a negative case |
| Assertions expiring with time (hard-coded dates) | Medium | All dates generated relative to the run date |
| Docs vs real behaviour differ | Low | File bugs; keep Newman assertions on actual responses so a fix surfaces as a failure |
| Collection and documentation drifting apart | Low | `npm run lint:collection` fails the build on any untraced case or request |

## 11. Schedule

| Milestone | Date |
|---|---|
| Plan signed off | 2026-08-13 |
| Happy path automated | 2026-08-13 |
| Negatives + test cases filled (TC-001–TC-022) | 2026-08-13 |
| BUG-001 … BUG-003 written | 2026-08-13 |
| CI green on GitHub | 2026-08-13 |
| Coverage extended to TC-042, schema contracts, teardown, CI hardening | 2026-09-09 |
| BUG-004 … BUG-007 written | 2026-09-09 |

## 12. Sign-off

| Role | Name | Date |
|---|---|---|
| Author (tester) | Krzysztof Pabich | 2026-09-09 |
| Reviewer | — | — |
