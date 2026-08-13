# Test cases — Restful Booker API

Status: **template** · Linked plan: [`test-plan.md`](test-plan.md)  
Polish copy: [`../pl/przypadki-testowe.md`](../pl/przypadki-testowe.md)

**Status values:** `Not run` · `Pass` · `Fail` · `Blocked` · `Skipped`

| ID | Title | Type | Priority | Preconditions | Steps | Expected | Status | Bug / notes |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API reachable | 1. `GET /ping` | Status **201**, body contains `Created` | Not run | Postman: 00 Health |
| TC-002 | Create auth token — valid | Functional | High | Known demo credentials | 1. `POST /auth` with `{{username}}` / `{{password}}` | Status **200**, JSON has non-empty `token` | Not run | Token saved to env |
| TC-003 | Create booking — valid payload | Functional | High | — | 1. `POST /booking` with firstname, lastname, dates, price | Status **200**, `bookingid` is a number, payload echoed | Not run | Saves `bookingId` |
| TC-004 | Get booking by id | Functional | High | TC-003 passed | 1. `GET /booking/{{bookingId}}` | Status **200**, firstname/lastname match created data | Not run | |
| TC-005 | List booking ids | Functional | Medium | — | 1. `GET /booking` | Status **200**, non-empty array of `{ bookingid }` | Not run | Shared data — do not assert exact length |
| TC-006 | Full update booking (PUT) | Functional | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` with Cookie token | Status **200**, lastname = `Updated` | Not run | |
| TC-007 | Partial update (PATCH) | Functional | Medium | Token + bookingId | 1. `PATCH` only `additionalneeds` | Status **200**, additionalneeds = `Parking`, firstname unchanged | Not run | |
| TC-008 | Delete booking | Functional | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` | Status **201** | Not run | |
| TC-009 | Auth — invalid password | Negative | High | — | 1. `POST /auth` with wrong password | `[FILL IN after you run it]` | Not run | Folder 90 |
| TC-010 | Create booking — missing firstname | Negative | High | — | 1. `POST /booking` without `firstname` | `[FILL IN]` | Not run | If accepted → bug |
| TC-011 | Create booking — checkout before checkin | Negative | High | — | 1. `POST /booking` with checkout < checkin | `[FILL IN]` | Not run | If accepted → bug |
| TC-012 | Get booking — unknown id | Negative | Medium | — | 1. `GET /booking/99999999` | `[FILL IN — often 404]` | Not run | |
| TC-013 | Filter bookings by firstname | Functional | Low | Own booking exists | 1. `GET /booking?firstname={{firstname}}` | `[FILL IN]` | Not run | Shared API |
| TC-014 | PUT without token | Negative | High | bookingId exists | 1. `PUT` without Cookie | `[FILL IN — often 403]` | Not run | Run **before** delete |
| TC-015 | DELETE without token | Negative | High | bookingId exists | 1. `DELETE` without Cookie | `[FILL IN — often 403]` | Not run | Run **before** delete |
| TC-016 | GET after delete | Negative | Medium | TC-008 passed | 1. `GET /booking/{{bookingId}}` | `[FILL IN — often 404]` | Not run | |
| TC-017 | `[FILL IN]` | | | | | | Not run | |
| TC-018 | `[FILL IN]` | | | | | | Not run | |
| TC-019 | `[FILL IN]` | | | | | | Not run | |
| TC-020 | `[FILL IN]` | | | | | | Not run | |

## Traceability (optional)

| Test case | Postman request | Automation |
|---|---|---|
| TC-001 | GET Ping — API is up | Newman |
| TC-002 | POST Create token | Newman |
| TC-003 | POST Create booking — valid | Newman |
| TC-004 | GET Booking by id | Newman |
| TC-009+ | folder 90 | Newman after you un-skip |
| `[FILL IN]` | | |
