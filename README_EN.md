# Restful Booker API tests

API tests for [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) using Postman, Newman and GitHub Actions.

Coverage: authentication (token and HTTP Basic), booking CRUD, query filters, content negotiation, JSON Schema contracts, negative cases and security smoke tests. 42 test cases (TC-001–TC-042), 268 assertions. Defects are in [`docs/bugs/`](docs/bugs/README.md).

[Wersja polska](README.md)

![API Tests](https://github.com/krzysztofp8852-create/api-tests-restful-booker/actions/workflows/api-tests.yml/badge.svg)

## Run

```bash
npm install
npm test
```

HTML report: `reports/newman-report.html`. Short console summary: `npm run report:summary`.

| Script | Purpose |
|---|---|
| `npm test` | full run + HTML and JSON report |
| `npm run test:cli` | quick run, console only |
| `npm run test:ci` | same as `test`, plus a JUnit report (used by CI) |
| `npm run lint:collection` | validates the collection and the case-to-request traceability |
| `npm run report:summary` | summarises the last Newman report |

In Postman, import `postman/`, select **Restful Booker — Local**, and run the collection from the top (folders 00–08). Order matters: the token and `bookingId` are produced on the happy path, the authorization negatives run before DELETE, and folder `08 Cleanup` removes the bookings created by the negative cases. See [`postman/README.md`](postman/README.md).

## How the suite is built

- **Per-run test data.** The collection pre-request script generates a `runId`, suffixes the first and last name with it, and derives every date from the run date. No assertion depends on a hard-coded date, and the `firstname` / `lastname` filters match exactly the bookings this run created.
- **Contracts, not just fields.** Every JSON response is validated against a JSON Schema (token, booking, create response, id list), so an added or renamed field breaks a test immediately.
- **Global assertions.** The collection test script checks *every* response for the time budget, a present `Content-Type` and a non-empty body.
- **Teardown.** Bookings created by negative cases are queued and deleted in folder `08 Cleanup`, so the public sandbox does not grow with every nightly CI run.
- **Traceability enforced by a script.** `npm run lint:collection` fails the build when a documented case has no request, a request has no case, a request has no assertion, or a hard-coded date sneaks into a payload.

## Layout

```
postman/                 collection and environment
docs/en/                 test plan and cases (EN)
docs/pl/                 test plan and cases (PL)
docs/bugs/               BUG-001 … BUG-007
scripts/                 collection validation, report summary
.github/workflows/       Newman: push, PR, nightly regression
```

## Docs

- [Test plan](docs/en/test-plan.md) · [Test cases](docs/en/test-cases.md)
- [Bug reports](docs/bugs/README.md) — 7 defects, 5 of them from one root cause: no payload validation on `POST /booking`
