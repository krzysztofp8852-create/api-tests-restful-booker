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
- Negative cases: invalid credentials, missing fields, unknown IDs, missing token, invalid date range

**Out of scope**

- UI of any demo frontend
- Performance / load (JMeter) — `[FILL IN: keep out / add later]`
- Security testing beyond missing/invalid token
- Other environments than the public demo

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
| Smoke | yes | Ping + create + get |
| Functional (positive) | yes | folders 00–05 |
| Negative / validation | yes | TC-009–TC-012, TC-017–TC-019, TC-022 |
| Authorization | yes | TC-014, TC-015, TC-020, TC-021 (folder 05, before DELETE) |
| Contract / schema | optional | `[FILL IN]` |
| Regression | CI on every push | Newman |

## 5. Approach

1. Manual exploration in Postman, then freeze assertions in the collection.
2. Happy path automated first (already scaffolded).
3. Negatives: observe actual behaviour → write expected result → if it contradicts docs or common sense, file a bug.
4. Newman in GitHub Actions as a smoke/regression gate.

## 6. Entry criteria

- [ ] Collection imports without errors
- [ ] Environment selected (`Restful Booker — Local`)
- [ ] `GET /ping` returns success
- [ ] `[FILL IN]`

## 7. Exit criteria

- [ ] All test cases in `test-cases.md` have status Pass / Fail / Blocked
- [ ] Failed cases either have a bug ID or a documented limitation
- [ ] `npm test` (happy path) is green locally and on CI
- [ ] At least `[FILL IN: e.g. 2]` bug reports written **if** defects are found; if none, write a short “no defects found” note
- [ ] `[FILL IN]`

## 8. Deliverables

- Postman collection + environment
- Newman HTML/JSON report
- This test plan
- Test case list
- Bug reports in `docs/bugs/`

## 9. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Shared public API, unstable data | Medium | Create own booking; do not rely on other people’s IDs |
| API downtime / slow responses | Medium | Retry; time assertions use a 3s budget |
| Docs vs real behaviour differ | Low (for a portfolio: useful) | File bugs, do not “fix” tests to hide it |
| `[FILL IN]` | | |

## 10. Schedule

| Milestone | Date |
|---|---|
| Plan signed off | `[DATE]` |
| Happy path automated | `[DATE]` |
| Negatives + test cases filled | `[DATE]` |
| Bugs written | `[DATE]` |
| CI green on GitHub | `[DATE]` |

## 11. Sign-off

| Role | Name | Date |
|---|---|---|
| Author (tester) | `[FILL IN]` | `[DATE]` |
| Reviewer (optional) | `[FILL IN]` | `[DATE]` |
