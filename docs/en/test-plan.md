# Test plan — Restful Booker API

Status: **executed** · Author: Krzysztof Pabich · Date: 2026-08-13 · Version: `1.0`

Polish copy: [`../pl/plan-testow.md`](../pl/plan-testow.md)

---

## 1. Purpose

Verify that Restful Booker API behaves according to its public documentation for authentication and booking CRUD, and document gaps (missing validation, unclear status codes) as defects.

## 2. Scope

**In scope**

- `GET /ping`
- `POST /auth`
- `POST /booking`, `GET /booking`, `GET /booking/:id`
- `PUT /booking/:id`, `PATCH /booking/:id`
- `DELETE /booking/:id`
- Negative cases: invalid credentials, missing fields, unknown IDs, missing token, invalid date range, wrong types

**Out of scope**

- UI of any demo frontend
- Performance / load testing (JMeter) — not in this project
- Security testing beyond missing or invalid token
- Environments other than the public demo

## 3. Test object / environment

| Item | Value |
|---|---|
| Application | Restful Booker |
| Base URL | `https://restful-booker.herokuapp.com` |
| Docs | https://restful-booker.herokuapp.com/apidoc/index.html |
| Auth | `admin` / `password123` (public) |
| Constraint | Shared sandbox — data from other users may appear in `GET /booking` |

## 4. Test types

| Type | Covered? | Notes |
|---|---|---|
| Smoke | yes | Ping + create + get (TC-001, TC-003, TC-004) |
| Functional (positive) | yes | folders 00–04 and 06 |
| Negative / validation | yes | TC-009–TC-012, TC-017–TC-019, TC-022 |
| Authorization | yes | TC-014, TC-015, TC-020, TC-021 (folder 05, before DELETE) |
| Contract / schema | no | Field-level assertions only, no JSON Schema |
| Regression | yes | Newman on every push (GitHub Actions) |

## 5. Approach

1. Explore the API in Postman, then freeze assertions in the collection.
2. Automate the happy path first (auth → create → get → update → delete).
3. For negatives: record actual behaviour, compare with docs / expected quality, file a bug when they differ.
4. Run Newman in GitHub Actions as a smoke and regression gate.

## 6. Entry criteria

- [x] Collection imports without errors
- [x] Environment selected (`Restful Booker — Local`)
- [x] `GET /ping` returns 201
- [x] Node.js 20+ and `npm install` completed

## 7. Exit criteria

- [x] All test cases in `test-cases.md` have status Pass or Fail
- [x] Failed cases have a bug ID (BUG-001, BUG-002, BUG-003)
- [x] `npm test` is green locally and on CI (22 requests, 48 assertions)
- [x] Three bug reports written (`docs/bugs/`)
- [x] Collection run order documented (folders 00–07)

## 8. Deliverables

- Postman collection + environment
- Newman HTML/JSON report (`reports/` after `npm test`)
- This test plan
- Test case list (TC-001–TC-022)
- Bug reports BUG-001, BUG-002, BUG-003

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Shared public API, unstable data | Medium | Create own booking; do not rely on other people’s IDs |
| API downtime / slow responses | Medium | Retry; time assertions use a 3s budget |
| Docs vs real behaviour differ | Low | File bugs; keep Newman assertions on actual responses |
| `GET /booking?firstname=` matches other users | Low | Assert that our `bookingId` is present, not that the list has size 1 |

## 10. Schedule

| Milestone | Date |
|---|---|
| Plan signed off | 2026-08-13 |
| Happy path automated | 2026-08-13 |
| Negatives + test cases filled | 2026-08-13 |
| Bugs written | 2026-08-13 |
| CI green on GitHub | 2026-08-13 |

## 11. Sign-off

| Role | Name | Date |
|---|---|---|
| Author (tester) | Krzysztof Pabich | 2026-08-13 |
| Reviewer | — | — |
