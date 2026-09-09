# Bug reports

Seven defects found while executing TC-001–TC-042. Each report names the test case that covers it, so a fix is verified by re-running the collection.

| ID | Title | Severity | Priority | Status | Linked TC |
|---|---|---|---|---|---|
| [BUG-001](BUG-001.md) | Invalid booking payloads return 500 instead of 4xx | Major | P2 | Open | TC-010, TC-018, TC-030 |
| [BUG-002](BUG-002.md) | Checkout before check-in is accepted | Major | P2 | Open | TC-011 |
| [BUG-003](BUG-003.md) | Wrongly typed fields are silently coerced | Minor | P3 | Open | TC-019, TC-039 |
| [BUG-004](BUG-004.md) | Unparsable date is stored as `0NaN-aN-aN` | Major | P2 | Open | TC-031 |
| [BUG-005](BUG-005.md) | Negative `totalprice` is accepted | Minor | P3 | Open | TC-032 |
| [BUG-006](BUG-006.md) | XML response served as `text/html` | Minor | P3 | Open | TC-027 |
| [BUG-007](BUG-007.md) | Unsupported `Accept` returns 418, not 406 | Minor | P3 | Open | TC-042 |

## By root cause

| Root cause | Defects | Endpoint |
|---|---|---|
| No payload validation on the create path | BUG-001, BUG-002, BUG-003, BUG-004, BUG-005 | `POST /booking` |
| Content negotiation | BUG-006, BUG-007 | `GET /booking/:id` |

`POST /booking` accepts anything it can coerce, while `PUT /booking/:id` rejects the same incomplete payload with 400 (TC-034). The validator exists — it is not wired into create. Fixing that one path closes five of the seven defects.

## Documented quirks — not filed as bugs

Behaviour that deviates from REST conventions but is stated in the API documentation, so it is asserted as-is rather than reported:

| Behaviour | Case |
|---|---|
| `DELETE /booking/:id` → **201 Created** instead of 204 | TC-008 |
| Repeated `DELETE` → **405 Method Not Allowed** instead of 404 | TC-022 |
| `PUT` on an unknown id → **405** instead of 404 | TC-036 |
| `POST /auth` with bad credentials → **200** + `{ "reason": "Bad credentials" }` instead of 401 | TC-009, TC-017, TC-023 |
