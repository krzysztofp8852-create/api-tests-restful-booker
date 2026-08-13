# Przypadki testowe — Restful Booker API

Status: **szablon** · Plan: [`plan-testow.md`](plan-testow.md)  
English copy: [`../en/test-cases.md`](../en/test-cases.md)

**Statusy:** `Not run` · `Pass` · `Fail` · `Blocked` · `Skipped`

Wpisz wiersz po wykonaniu. TC-001–TC-007 to wzorzec happy path — **odpal je i ustaw prawdziwy status**. Puste ID są Twoje.

| ID | Tytuł | Typ | Priorytet | Warunki wstępne | Kroki | Oczekiwany rezultat | Status | Bug / uwagi |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API dostępne | 1. `GET /ping` | Status **201**, body zawiera `Created` | Not run | Postman: 00 Health |
| TC-002 | Token — poprawne dane | Funkcjonalny | High | Dane demo | 1. `POST /auth` z `{{username}}` / `{{password}}` | Status **200**, JSON z niepustym `token` | Not run | Token do env |
| TC-003 | Utworzenie rezerwacji — poprawny payload | Funkcjonalny | High | — | 1. `POST /booking` z imieniem, nazwiskiem, datami, ceną | Status **200**, `bookingid` to liczba, payload zwrócony | Not run | Zapis `bookingId` |
| TC-004 | Odczyt rezerwacji po ID | Funkcjonalny | High | TC-003 Pass | 1. `GET /booking/{{bookingId}}` | Status **200**, firstname/lastname zgodne | Not run | |
| TC-005 | Lista ID rezerwacji | Funkcjonalny | Medium | — | 1. `GET /booking` | Status **200**, niepusta tablica `{ bookingid }` | Not run | API współdzielone — nie asseruj długości |
| TC-006 | Pełna aktualizacja (PUT) | Funkcjonalny | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` z Cookie | Status **200**, lastname = `Updated` | Not run | |
| TC-007 | Częściowa aktualizacja (PATCH) | Funkcjonalny | Medium | Token + bookingId | 1. `PATCH` tylko `additionalneeds` | Status **200**, additionalneeds = `Parking`, firstname bez zmian | Not run | |
| TC-008 | Usunięcie rezerwacji | Funkcjonalny | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` | Status **201** | Not run | |
| TC-009 | Auth — złe hasło | Negatywny | High | — | 1. `POST /auth` ze złym hasłem | `[UZUPEŁNIJ po odpaleniu]` | Not run | Folder 90 |
| TC-010 | Rezerwacja — brak firstname | Negatywny | High | — | 1. `POST /booking` bez `firstname` | `[UZUPEŁNIJ]` | Not run | Jeśli przyjmie → bug |
| TC-011 | Rezerwacja — checkout przed checkin | Negatywny | High | — | 1. `POST /booking` z checkout < checkin | `[UZUPEŁNIJ]` | Not run | Jeśli przyjmie → bug |
| TC-012 | GET — nieistniejące ID | Negatywny | Medium | — | 1. `GET /booking/99999999` | `[UZUPEŁNIJ — często 404]` | Not run | |
| TC-013 | Filtr po firstname | Funkcjonalny | Low | Własna rezerwacja | 1. `GET /booking?firstname={{firstname}}` | `[UZUPEŁNIJ]` | Not run | API współdzielone |
| TC-014 | PUT bez tokenu | Negatywny | High | bookingId istnieje | 1. `PUT` bez Cookie | `[UZUPEŁNIJ — często 403]` | Not run | Przed delete |
| TC-015 | DELETE bez tokenu | Negatywny | High | bookingId istnieje | 1. `DELETE` bez Cookie | `[UZUPEŁNIJ — często 403]` | Not run | Przed delete |
| TC-016 | GET po usunięciu | Negatywny | Medium | TC-008 Pass | 1. `GET /booking/{{bookingId}}` | `[UZUPEŁNIJ — często 404]` | Not run | |
| TC-017 | `[UZUPEŁNIJ]` | | | | | | Not run | |
| TC-018 | `[UZUPEŁNIJ]` | | | | | | Not run | |
| TC-019 | `[UZUPEŁNIJ]` | | | | | | Not run | |
| TC-020 | `[UZUPEŁNIJ]` | | | | | | Not run | |

## Powiązanie z automatyzacją (opcjonalnie)

| Przypadek | Request w Postmanie | Automatyzacja |
|---|---|---|
| TC-001 | GET Ping — API is up | Newman |
| TC-002 | POST Create token | Newman |
| TC-003 | POST Create booking — valid | Newman |
| TC-004 | GET Booking by id | Newman |
| TC-009+ | folder 90 | Newman po zdjęciu skip |
| `[UZUPEŁNIJ]` | | |
