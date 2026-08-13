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
| `token` | **POST Create token** | do not type by hand |
| `bookingId` | **POST Create booking — valid** | used by GET/PUT/PATCH/DELETE |
| `firstname` / `lastname` | environment | change if you want unique data |

## Run order

Happy path must run **in order** (token and bookingId are passed between requests):

1. `00 Health`
2. `01 Auth`
3. `02 Create booking`
4. `03 Get booking`
5. `04 Update booking`
6. `05 Delete booking`

Then fill `90 Negative / TODO`. For auth-required negatives, run them **before** Delete, or create a second booking first.

## Export after you edit

If you change tests in the Postman app, export the collection **back** to `postman/Restful-Booker.postman_collection.json` so Newman / CI stay in sync.
