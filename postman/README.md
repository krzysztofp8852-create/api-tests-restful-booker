# Postman

## Import

1. Open Postman → **Import**.
2. Select this folder (`postman/`) or both JSON files.
3. Top-right: environment **Restful Booker — Local**.

## Variables

| Variable | Set by | Notes |
|---|---|---|
| `baseUrl` | environment | default: `https://restful-booker.herokuapp.com` |
| `username` / `password` | environment | public demo: `admin` / `password123` |
| `token` | **TC-002 POST Create token** | do not type by hand |
| `bookingId` | **TC-003 POST Create booking — valid** | used by GET/PUT/PATCH/DELETE |
| `firstname` / `lastname` | environment | change if you want unique data |

## Run order

Requests pass `token` and `bookingId` between steps. Run **the whole collection** from the top:

1. `00 Health` — TC-001
2. `01 Auth` — TC-002, TC-009, TC-017
3. `02 Create booking` — TC-003, TC-010, TC-018, TC-011, TC-019
4. `03 Get booking` — TC-004, TC-005, TC-013, TC-012
5. `04 Update booking` — TC-006, TC-007
6. `05 Authorization negatives` — TC-014, TC-021, TC-020, TC-015 (before delete)
7. `06 Delete booking` — TC-008
8. `07 After delete` — TC-016, TC-022

## Export after you edit

If you change tests in the Postman app, export the collection **back** to `postman/Restful-Booker.postman_collection.json` so Newman / CI stay in sync.
