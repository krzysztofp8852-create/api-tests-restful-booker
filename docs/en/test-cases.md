# Test cases — Restful Booker API

Status: **executed** · Linked plan: [`test-plan.md`](test-plan.md)  
Polish copy: [`../pl/przypadki-testowe.md`](../pl/przypadki-testowe.md)

**Status values:** `Pass` = API matches the quality/docs expectation · `Fail` = defect (see Bug) · `Not run` / `Blocked` / `Skipped`

Newman asserts **actual** API behaviour so CI stays green. Where Status is `Fail`, the collection still checks the current (buggy) response and the gap is filed in `docs/bugs/`.

| ID | Title | Type | Priority | Preconditions | Steps | Expected | Status | Bug / notes |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API reachable | 1. `GET /ping` | Status **201**, body contains `Created` | Pass | Postman: 00 Health |
| TC-002 | Create auth token — valid | Functional | High | Demo credentials | 1. `POST /auth` with `{{username}}` / `{{password}}` | Status **200**, JSON has non-empty alphanumeric `token` | Pass | Token saved to env |
| TC-003 | Create booking — valid payload | Functional | High | — | 1. `POST /booking` with firstname, lastname, dates, price, additionalneeds | Status **200**, numeric `bookingid`, payload echoed | Pass | Saves `bookingId` |
| TC-004 | Get booking by id | Functional | High | TC-003 passed | 1. `GET /booking/{{bookingId}}` | Status **200**, firstname/lastname match created data | Pass | |
| TC-005 | List booking ids | Functional | Medium | TC-003 passed | 1. `GET /booking` | Status **200**, non-empty array of `{ bookingid }`, created id present | Pass | Shared data — do not assert list length |
| TC-006 | Full update booking (PUT) | Functional | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` with Cookie token | Status **200**, lastname = `Updated`, firstname unchanged | Pass | |
| TC-007 | Partial update (PATCH) | Functional | Medium | Token + bookingId after TC-006 | 1. `PATCH` only `additionalneeds` | Status **200**, additionalneeds = `Parking`, lastname still `Updated` | Pass | |
| TC-008 | Delete booking | Functional | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` with Cookie | Status **201**, body contains `Created` | Pass | Documented Restful Booker quirk (201 not 204) |
| TC-009 | Auth — invalid password | Negative | High | — | 1. `POST /auth` with wrong password | No usable token. Docs: **200** + `{ "reason": "Bad credentials" }` (not 401) | Pass | Documented behaviour |
| TC-010 | Create booking — missing firstname | Negative | High | — | 1. `POST /booking` without `firstname` | **4xx** client error, no 500, no `bookingid` | Fail | **BUG-001** · actual **500** `Internal Server Error` |
| TC-011 | Create booking — checkout before checkin | Negative | High | — | 1. `POST /booking` with checkout `2026-09-01` < checkin `2026-09-10` | **4xx**, dates rejected, no booking created | Fail | **BUG-002** · actual **200** and booking created |
| TC-012 | Get booking — unknown id | Negative | Medium | — | 1. `GET /booking/99999999` | Status **404**, body `Not Found` | Pass | |
| TC-013 | Filter bookings by firstname | Functional | Low | Own booking exists (before delete) | 1. `GET /booking?firstname={{firstname}}` | Status **200**, array, created `bookingId` included | Pass | Shared API — other IDs may appear |
| TC-014 | PUT without token | Negative | High | bookingId still exists | 1. `PUT /booking/{{bookingId}}` without Cookie | Status **403**, body `Forbidden` | Pass | Run **before** delete |
| TC-015 | DELETE without token | Negative | High | bookingId still exists | 1. `DELETE /booking/{{bookingId}}` without Cookie | Status **403**, body `Forbidden` | Pass | Run **before** delete |
| TC-016 | GET after delete | Negative | Medium | TC-008 passed | 1. `GET /booking/{{bookingId}}` | Status **404**, body `Not Found` | Pass | |
| TC-017 | Auth — empty credentials | Negative | Medium | — | 1. `POST /auth` with `{}` | Same as invalid password: **200** + `Bad credentials`, no token | Pass | |
| TC-018 | Create booking — missing lastname | Negative | High | — | 1. `POST /booking` without `lastname` | **4xx**, no 500 | Fail | **BUG-001** · actual **500** (same as TC-010) |
| TC-019 | Create booking — totalprice as string | Negative | Medium | — | 1. `POST /booking` with `"totalprice": "abc"` | **4xx** (type error), booking not created | Fail | **BUG-003** · actual **200**, `totalprice: null` |
| TC-020 | PATCH without token | Negative | High | bookingId still exists | 1. `PATCH /booking/{{bookingId}}` without Cookie | Status **403**, body `Forbidden` | Pass | Run **before** delete |
| TC-021 | PUT with invalid token | Negative | High | bookingId still exists | 1. `PUT` with `Cookie: token=invalidtoken` | Status **403**, body `Forbidden` | Pass | Run **before** delete |
| TC-022 | DELETE already deleted booking | Negative | Medium | TC-008 passed | 1. `DELETE /booking/{{bookingId}}` with valid Cookie again | Status **405**, body `Method Not Allowed` | Pass | Not 404 |

## Traceability

| Test case | Postman request | Folder | Automation |
|---|---|---|---|
| TC-001 | TC-001 GET Ping — API is up | 00 Health | Newman |
| TC-002 | TC-002 POST Create token — valid | 01 Auth | Newman |
| TC-009 | TC-009 POST Auth — invalid password | 01 Auth | Newman |
| TC-017 | TC-017 POST Auth — empty credentials | 01 Auth | Newman |
| TC-003 | TC-003 POST Create booking — valid | 02 Create booking | Newman |
| TC-010 | TC-010 POST Create booking — missing firstname | 02 Create booking | Newman |
| TC-018 | TC-018 POST Create booking — missing lastname | 02 Create booking | Newman |
| TC-011 | TC-011 POST Create booking — checkout before checkin | 02 Create booking | Newman |
| TC-019 | TC-019 POST Create booking — totalprice as string | 02 Create booking | Newman |
| TC-004 | TC-004 GET Booking by id | 03 Get booking | Newman |
| TC-005 | TC-005 GET All booking ids | 03 Get booking | Newman |
| TC-013 | TC-013 GET Booking — filter by firstname | 03 Get booking | Newman |
| TC-012 | TC-012 GET Booking — non-existent id | 03 Get booking | Newman |
| TC-006 | TC-006 PUT Full update | 04 Update booking | Newman |
| TC-007 | TC-007 PATCH Partial update | 04 Update booking | Newman |
| TC-014 | TC-014 PUT without token | 05 Authorization negatives | Newman |
| TC-021 | TC-021 PUT with invalid token | 05 Authorization negatives | Newman |
| TC-020 | TC-020 PATCH without token | 05 Authorization negatives | Newman |
| TC-015 | TC-015 DELETE without token | 05 Authorization negatives | Newman |
| TC-008 | TC-008 DELETE Booking | 06 Delete booking | Newman |
| TC-016 | TC-016 GET Booking after delete | 07 After delete | Newman |
| TC-022 | TC-022 DELETE already deleted booking | 07 After delete | Newman |
