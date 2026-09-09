# Test cases — Restful Booker API

Status: **executed** · Linked plan: [`test-plan.md`](test-plan.md)  
Polish copy: [`../pl/przypadki-testowe.md`](../pl/przypadki-testowe.md)

**Status values:** `Pass` = API matches the quality/docs expectation · `Fail` = defect (see Bug) · `Not run` / `Blocked` / `Skipped`

Newman asserts **actual** API behaviour so CI stays green. Where Status is `Fail`, the collection still checks the current (buggy) response and the gap is filed in `docs/bugs/`. `npm run lint:collection` fails the build if a case listed here has no request, or a request has no case.

Test data is generated per run (`runId`-suffixed names, dates relative to today), so every case below is repeatable on the shared sandbox and no assertion depends on a hard-coded date.

## Positive and functional cases

| ID | Title | Type | Priority | Preconditions | Steps | Expected | Status | Bug / notes |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API reachable | 1. `GET /ping` | Status **201**, body contains `Created`, `Content-Type: text/plain` | Pass | Gate for the whole run |
| TC-002 | Create auth token — valid credentials | Functional | High | Demo credentials | 1. `POST /auth` with `{{username}}` / `{{password}}` | Status **200**, body matches the token schema, alphanumeric non-empty `token` | Pass | Token stored as a collection variable |
| TC-003 | Create booking — valid payload | Functional | High | — | 1. `POST /booking` with the full payload | Status **200**, body matches the created-booking schema, payload echoed unchanged | Pass | Provides `bookingId` for folders 03–07 |
| TC-004 | Get booking by id | Functional | High | TC-003 passed | 1. `GET /booking/{{bookingId}}` | Status **200**, body matches the booking schema, all seven fields equal what TC-003 sent | Pass | |
| TC-005 | List booking ids | Functional | Medium | TC-003 passed | 1. `GET /booking` | Status **200**, matches the id-list schema, created id present | Pass | Shared data — never assert list length |
| TC-006 | Full update booking (PUT, cookie token) | Functional | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` with `Cookie: token=` | Status **200**, every sent field applied | Pass | |
| TC-007 | Partial update (PATCH, cookie token) | Functional | Medium | TC-006 passed | 1. `PATCH` only `additionalneeds` | Status **200**, `additionalneeds` updated, all other fields from TC-006 preserved | Pass | |
| TC-008 | Delete booking (cookie token) | Functional | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` with `Cookie: token=` | Status **201**, body contains `Created` | Pass | Documented quirk — 204 would be expected |
| TC-013 | Filter bookings by firstname | Functional | Medium | Own booking exists (before delete) | 1. `GET /booking?firstname={{runFirstname}}` | Status **200**, created id present, **only** ids created by this run returned | Pass | Run-scoped name makes the filter exact |
| TC-025 | Filter bookings by lastname | Functional | Low | Own booking exists | 1. `GET /booking?lastname={{runLastname}}` | Status **200**, created id present | Pass | |
| TC-026 | Filter bookings by date range | Functional | Medium | Own booking exists | 1. `GET /booking?checkin=…&checkout=…` bracketing the TC-003 dates | Status **200**, matches the id-list schema, created id inside the range | Pass | |
| TC-033 | Create booking — unknown extra field | Functional | Medium | — | 1. `POST /booking` with `isAdmin` and `unknownField` added | Status **200**, unknown fields dropped, not echoed, not persisted | Pass | Mass-assignment check |
| TC-035 | Full update (PUT, HTTP Basic auth) | Functional | Medium | bookingId exists | 1. `PUT` with `Authorization: Basic` instead of the cookie | Status **200**, update applied | Pass | Documented alternative credential |
| TC-037 | Partial update — empty body | Functional | Medium | TC-007 passed | 1. `PATCH` with `{}` | Status **200**, booking returned unchanged, no field cleared | Pass | No-op must not wipe data |
| TC-038 | Delete booking (HTTP Basic auth) | Functional | Medium | Fixture booking created | 1. `DELETE` with `Authorization: Basic`<br>2. `GET` the same id | Status **201**, follow-up `GET` returns **404** | Pass | Uses its own fixture booking |
| TC-041 | Deleted booking leaves the filtered list | Functional | Medium | TC-008 passed | 1. `GET /booking?firstname={{runFirstname}}` | Status **200**, deleted id **not** returned | Pass | Delete must propagate to queries, not only to `GET` by id |

## Negative and authorization cases

| ID | Title | Type | Priority | Preconditions | Steps | Expected | Status | Bug / notes |
|---|---|---|---|---|---|---|---|---|
| TC-009 | Auth — invalid password | Negative | High | — | 1. `POST /auth` with a wrong password | No usable token. Docs: **200** + `{ "reason": "Bad credentials" }`, not 401 | Pass | Documented behaviour; valid token stays untouched |
| TC-017 | Auth — empty credentials | Negative | Medium | — | 1. `POST /auth` with `{}` | Same as an invalid password: **200** + `Bad credentials`, no token | Pass | |
| TC-023 | Auth — unknown username | Negative | Medium | — | 1. `POST /auth` with `no-such-user` | **200** + `Bad credentials`; message must not reveal whether the user exists | Pass | No user enumeration |
| TC-024 | Auth — SQL injection payload | Security (smoke) | High | — | 1. `POST /auth` with `admin' OR '1'='1` | **200** + `Bad credentials`, no token, no SQL error or stack trace in the body | Pass | Tautology payload rejected |
| TC-010 | Create booking — missing firstname | Negative | High | — | 1. `POST /booking` without `firstname` | **4xx** client error, no 5xx, no `bookingid` | Fail | **BUG-001** · actual **500** `Internal Server Error` |
| TC-018 | Create booking — missing lastname | Negative | High | — | 1. `POST /booking` without `lastname` | **4xx**, no 5xx | Fail | **BUG-001** · actual **500** |
| TC-030 | Create booking — empty request body | Negative | High | — | 1. `POST /booking` with no body | **400** | Fail | **BUG-001** · actual **500** |
| TC-029 | Create booking — malformed JSON | Negative | Medium | — | 1. `POST /booking` with `{ "firstname": "Malformed",` | **400** `Bad Request`, no booking created | Pass | Parser-level rejection works correctly |
| TC-011 | Create booking — checkout before checkin | Negative | High | — | 1. `POST /booking` with an inverted date range | **4xx**, range rejected, no booking created | Fail | **BUG-002** · actual **200**, booking persisted |
| TC-019 | Create booking — totalprice as string | Negative | Medium | — | 1. `POST /booking` with `"totalprice": "abc"` | **4xx** (type error), no booking created | Fail | **BUG-003** · actual **200**, `totalprice: null` |
| TC-039 | Create booking — depositpaid as string | Negative | Medium | — | 1. `POST /booking` with `"depositpaid": "yes"` | **4xx** (type error), no booking created | Fail | **BUG-003** · actual **200**, coerced to `true` |
| TC-031 | Create booking — unparsable date | Negative | High | — | 1. `POST /booking` with `"checkin": "not-a-date"` | **4xx**, no booking created | Fail | **BUG-004** · actual **200**, stored as the literal `0NaN-aN-aN` |
| TC-032 | Create booking — negative totalprice | Negative | Medium | — | 1. `POST /booking` with `"totalprice": -500` | **4xx**, negative price rejected | Fail | **BUG-005** · actual **200**, `-500` persisted |
| TC-012 | Get booking — unknown id | Negative | Medium | — | 1. `GET /booking/99999999` | Status **404**, body `Not Found` | Pass | |
| TC-028 | Get booking — non-numeric id | Negative | Medium | — | 1. `GET /booking/not-a-number` | Status **404**, body `Not Found`, no internals leaked | Pass | |
| TC-027 | Get booking — `Accept: application/xml` | Contract | Medium | bookingId exists | 1. `GET /booking/{{bookingId}}` with `Accept: application/xml` | **200**, XML payload, `Content-Type: application/xml` | Fail | **BUG-006** · XML body served as `text/html` |
| TC-042 | Get booking — unsupported Accept type | Negative | Low | bookingId exists | 1. `GET /booking/{{bookingId}}` with `Accept: application/pdf` | **406 Not Acceptable** | Fail | **BUG-007** · actual **418 I'm a teapot** |
| TC-034 | Full update — incomplete payload | Negative | High | Token + bookingId | 1. `PUT` without `lastname`<br>2. `GET` the booking | **400** `Bad Request`, booking unmodified | Pass | Validation exists on PUT but not on POST — evidence for BUG-001 |
| TC-036 | Full update — non-existent id | Negative | Medium | Valid token | 1. `PUT /booking/99999999` | Documented quirk: **405 Method Not Allowed** (404 would be expected) | Pass | |
| TC-014 | PUT without token | Negative | High | bookingId still exists | 1. `PUT` without `Cookie` | Status **403**, body `Forbidden` | Pass | Runs **before** delete |
| TC-021 | PUT with invalid token | Negative | High | bookingId still exists | 1. `PUT` with `Cookie: token=invalidtoken` | Status **403**, body `Forbidden` | Pass | Runs **before** delete |
| TC-020 | PATCH without token | Negative | High | bookingId still exists | 1. `PATCH` without `Cookie`<br>2. `GET` the booking | Status **403**, and the rejected patch did **not** modify the booking | Pass | Runs **before** delete |
| TC-015 | DELETE without token | Negative | High | bookingId still exists | 1. `DELETE` without `Cookie`<br>2. `GET` the booking | Status **403**, and the booking still returns **200** | Pass | Runs **before** delete |
| TC-040 | DELETE with invalid Basic auth | Negative | High | bookingId still exists | 1. `DELETE` with wrong Basic credentials | Status **403**, body `Forbidden` | Pass | Both credential styles reject equally |
| TC-016 | GET after delete | Negative | Medium | TC-008 passed | 1. `GET /booking/{{bookingId}}` | Status **404**, body `Not Found` | Pass | |
| TC-022 | DELETE already deleted booking | Negative | Medium | TC-008 passed | 1. `DELETE` the same id again with a valid token | Documented quirk: **405 Method Not Allowed** (404 would be expected) | Pass | |

## Global assertions

Run against **every** response by the collection-level test script, so a regression in any endpoint is caught even when its own case passes:

| Assertion | Purpose |
|---|---|
| Response time under `responseTimeBudgetMs` (default 5000 ms) | Performance regression guard |
| Response declares a `Content-Type` | No untyped responses, including error bodies |
| Response body is not empty | No silent empty replies |

## Traceability

| Test case | Postman request | Folder |
|---|---|---|
| TC-001 | TC-001 GET Ping — API is up | 00 Health |
| TC-002 | TC-002 POST Create token — valid credentials | 01 Auth |
| TC-009 | TC-009 POST Auth — invalid password | 01 Auth |
| TC-023 | TC-023 POST Auth — unknown username | 01 Auth |
| TC-017 | TC-017 POST Auth — empty credentials | 01 Auth |
| TC-024 | TC-024 POST Auth — SQL injection payload in username | 01 Auth |
| TC-003 | TC-003 POST Create booking — valid payload | 02 Create booking |
| TC-010 | TC-010 POST Create booking — missing firstname | 02 Create booking |
| TC-018 | TC-018 POST Create booking — missing lastname | 02 Create booking |
| TC-030 | TC-030 POST Create booking — empty request body | 02 Create booking |
| TC-029 | TC-029 POST Create booking — malformed JSON | 02 Create booking |
| TC-011 | TC-011 POST Create booking — checkout before checkin | 02 Create booking |
| TC-019 | TC-019 POST Create booking — totalprice as string | 02 Create booking |
| TC-039 | TC-039 POST Create booking — depositpaid as string | 02 Create booking |
| TC-031 | TC-031 POST Create booking — unparsable date | 02 Create booking |
| TC-032 | TC-032 POST Create booking — negative totalprice | 02 Create booking |
| TC-033 | TC-033 POST Create booking — unknown extra field | 02 Create booking |
| TC-004 | TC-004 GET Booking by id | 03 Get booking |
| TC-027 | TC-027 GET Booking by id — Accept: application/xml | 03 Get booking |
| TC-042 | TC-042 GET Booking by id — unsupported Accept type | 03 Get booking |
| TC-005 | TC-005 GET All booking ids | 03 Get booking |
| TC-013 | TC-013 GET Booking — filter by firstname | 03 Get booking |
| TC-025 | TC-025 GET Booking — filter by lastname | 03 Get booking |
| TC-026 | TC-026 GET Booking — filter by date range | 03 Get booking |
| TC-012 | TC-012 GET Booking — non-existent id | 03 Get booking |
| TC-028 | TC-028 GET Booking — non-numeric id | 03 Get booking |
| TC-006 | TC-006 PUT Full update — cookie token | 04 Update booking |
| TC-007 | TC-007 PATCH Partial update — cookie token | 04 Update booking |
| TC-037 | TC-037 PATCH Empty body — no-op | 04 Update booking |
| TC-035 | TC-035 PUT Full update — HTTP Basic auth | 04 Update booking |
| TC-034 | TC-034 PUT Full update — incomplete payload | 04 Update booking |
| TC-036 | TC-036 PUT Full update — non-existent id | 04 Update booking |
| TC-014 | TC-014 PUT without token | 05 Authorization negatives |
| TC-021 | TC-021 PUT with invalid token | 05 Authorization negatives |
| TC-020 | TC-020 PATCH without token | 05 Authorization negatives |
| TC-040 | TC-040 DELETE with invalid Basic auth | 05 Authorization negatives |
| TC-015 | TC-015 DELETE without token | 05 Authorization negatives |
| TC-008 | TC-008 DELETE Booking — cookie token | 06 Delete booking |
| TC-038 | TC-038 DELETE Booking — HTTP Basic auth | 06 Delete booking |
| TC-016 | TC-016 GET Booking after delete | 07 After delete |
| TC-041 | TC-041 GET All booking ids after delete | 07 After delete |
| TC-022 | TC-022 DELETE already deleted booking | 07 After delete |

Two requests in the collection are not test cases: `SETUP POST Create booking for TC-038` (fixture for TC-038) and `CLEAN DELETE bookings created by negative cases` (folder 08, teardown).

## Coverage summary

| Endpoint | Cases |
|---|---|
| `GET /ping` | TC-001 |
| `POST /auth` | TC-002, TC-009, TC-017, TC-023, TC-024 |
| `POST /booking` | TC-003, TC-010, TC-011, TC-018, TC-019, TC-029, TC-030, TC-031, TC-032, TC-033, TC-039 |
| `GET /booking` | TC-005, TC-013, TC-025, TC-026, TC-041 |
| `GET /booking/:id` | TC-004, TC-012, TC-016, TC-027, TC-028, TC-042 |
| `PUT /booking/:id` | TC-006, TC-014, TC-021, TC-034, TC-035, TC-036 |
| `PATCH /booking/:id` | TC-007, TC-020, TC-037 |
| `DELETE /booking/:id` | TC-008, TC-015, TC-022, TC-038, TC-040 |

42 cases: 32 `Pass`, 10 `Fail` (BUG-001 … BUG-007), 0 `Not run`.
