# Postman

## Import

1. Open Postman → **Import**.
2. Select this folder (`postman/`) or both JSON files.
3. Top-right: environment **Restful Booker — Local**.

## Variables

Configuration lives in the **environment**; everything a run produces lives in **collection variables**. That split is deliberate — a run never rewrites the committed environment file.

### Environment (edit these)

| Variable | Default | Notes |
|---|---|---|
| `baseUrl` | `https://restful-booker.herokuapp.com` | |
| `username` / `password` | `admin` / `password123` | public demo credentials |
| `firstname` / `lastname` | `Krzysztof` / `Tester` | **base** names; the run suffix is appended automatically |
| `responseTimeBudgetMs` | `5000` | global time budget asserted on every response |

### Collection variables (do not edit by hand)

Seeded by the collection pre-request script or by a test, and reset on the next run.

| Variable | Set by |
|---|---|
| `runId` | collection pre-request script, once per run |
| `runFirstname` / `runLastname` | collection pre-request script (`firstname` + `runId`) |
| `checkinDate`, `checkoutDate`, `checkoutDateUpdated` | collection pre-request script (today + 7 / + 11 / + 13) |
| `dateFilterFrom`, `dateFilterTo` | collection pre-request script (bounds for TC-026) |
| `invertedCheckin`, `invertedCheckout` | collection pre-request script (inverted range for TC-011) |
| `schemaToken`, `schemaBadCredentials`, `schemaBooking`, `schemaCreatedBooking`, `schemaBookingIdList` | collection pre-request script (JSON Schema contracts) |
| `token` | TC-002 POST Create token |
| `bookingId` | TC-003 POST Create booking |
| `basicAuthBookingId` | SETUP request in folder 06 |
| `junkIds`, `cleanupId`, `cleanupIdle`, `cleanupDeleted` | teardown queue used by folder 08 |

## Collection-level scripts

| Script | What it does |
|---|---|
| Pre-request | Seeds the run data (`runId`, names, all dates) once per run and publishes the five JSON Schemas used by the contract assertions. |
| Test | Global assertions applied to **every** response: time budget, `Content-Type` present, non-empty body. |

## Run order

Requests pass `token` and `bookingId` between steps, so run **the whole collection** from the top:

| Folder | Cases |
|---|---|
| `00 Health` | TC-001 |
| `01 Auth` | TC-002, TC-009, TC-023, TC-017, TC-024 |
| `02 Create booking` | TC-003, TC-010, TC-018, TC-030, TC-029, TC-011, TC-019, TC-039, TC-031, TC-032, TC-033 |
| `03 Get booking` | TC-004, TC-027, TC-042, TC-005, TC-013, TC-025, TC-026, TC-012, TC-028 |
| `04 Update booking` | TC-006, TC-007, TC-037, TC-035, TC-034, TC-036 |
| `05 Authorization negatives` | TC-014, TC-021, TC-020, TC-040, TC-015 — **before** delete, they need a booking that still exists |
| `06 Delete booking` | TC-008, SETUP fixture, TC-038 |
| `07 After delete` | TC-016, TC-041, TC-022 |
| `08 Cleanup` | teardown — deletes every booking created by a negative case |

Folder `08 Cleanup` holds a single request that re-queues itself (`pm.execution.setNextRequest`) until the `junkIds` queue is drained, then ends the run. It must stay last.

Running a single folder in isolation will fail: folders 03–08 depend on the `token` and `bookingId` created in 01–02.

## Export after you edit

If you change tests in the Postman app, export the collection **back** to `postman/Restful-Booker.postman_collection.json` so Newman and CI stay in sync, then run:

```bash
npm run lint:collection && npm run test:cli
```

The lint step fails if a test case lost its request, a request lost its assertions, a hard-coded date appeared in a payload, or a script writes runtime state to the environment instead of the collection.
