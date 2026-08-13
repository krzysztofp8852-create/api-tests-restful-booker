# Przypadki testowe — Restful Booker API

Status: **wykonane** · Plan: [`plan-testow.md`](plan-testow.md)  
English copy: [`../en/test-cases.md`](../en/test-cases.md)

**Statusy:** `Pass` = API zgodne z oczekiwaniem jakościowym/dokumentacją · `Fail` = defekt (kolumna Bug) · `Not run` / `Blocked` / `Skipped`

Newman asseruje **faktyczne** zachowanie API, żeby CI było zielone. Przy `Fail` kolekcja i tak sprawdza bieżącą (błędną) odpowiedź, a lukę opisują zgłoszenia w `docs/bugs/`.

| ID | Tytuł | Typ | Priorytet | Warunki wstępne | Kroki | Oczekiwany rezultat | Status | Bug / uwagi |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API dostępne | 1. `GET /ping` | Status **201**, body zawiera `Created` | Pass | Postman: 00 Health |
| TC-002 | Token — poprawne dane | Funkcjonalny | High | Dane demo | 1. `POST /auth` z `{{username}}` / `{{password}}` | Status **200**, JSON z niepustym alfanumerycznym `token` | Pass | Token do env |
| TC-003 | Utworzenie rezerwacji — poprawny payload | Funkcjonalny | High | — | 1. `POST /booking` z imieniem, nazwiskiem, datami, ceną, additionalneeds | Status **200**, liczbowe `bookingid`, payload zwrócony | Pass | Zapis `bookingId` |
| TC-004 | Odczyt rezerwacji po ID | Funkcjonalny | High | TC-003 Pass | 1. `GET /booking/{{bookingId}}` | Status **200**, firstname/lastname zgodne | Pass | |
| TC-005 | Lista ID rezerwacji | Funkcjonalny | Medium | TC-003 Pass | 1. `GET /booking` | Status **200**, niepusta tablica `{ bookingid }`, utworzone ID na liście | Pass | API współdzielone — nie asseruj długości |
| TC-006 | Pełna aktualizacja (PUT) | Funkcjonalny | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` z Cookie | Status **200**, lastname = `Updated`, firstname bez zmian | Pass | |
| TC-007 | Częściowa aktualizacja (PATCH) | Funkcjonalny | Medium | Token + bookingId po TC-006 | 1. `PATCH` tylko `additionalneeds` | Status **200**, additionalneeds = `Parking`, lastname nadal `Updated` | Pass | |
| TC-008 | Usunięcie rezerwacji | Funkcjonalny | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` z Cookie | Status **201**, body zawiera `Created` | Pass | Udokumentowany quirk (201 zamiast 204) |
| TC-009 | Auth — złe hasło | Negatywny | High | — | 1. `POST /auth` ze złym hasłem | Brak tokenu. Dokumentacja: **200** + `{ "reason": "Bad credentials" }` (nie 401) | Pass | Zachowanie zgodne z docs |
| TC-010 | Rezerwacja — brak firstname | Negatywny | High | — | 1. `POST /booking` bez `firstname` | **4xx**, bez 500, bez `bookingid` | Fail | **BUG-001** · faktycznie **500** `Internal Server Error` |
| TC-011 | Rezerwacja — checkout przed checkin | Negatywny | High | — | 1. `POST /booking` z checkout `2026-09-01` < checkin `2026-09-10` | **4xx**, daty odrzucone, brak rezerwacji | Fail | **BUG-002** · faktycznie **200** i rezerwacja powstaje |
| TC-012 | GET — nieistniejące ID | Negatywny | Medium | — | 1. `GET /booking/99999999` | Status **404**, body `Not Found` | Pass | |
| TC-013 | Filtr po firstname | Funkcjonalny | Low | Własna rezerwacja (przed delete) | 1. `GET /booking?firstname={{firstname}}` | Status **200**, tablica, utworzone `bookingId` na liście | Pass | API współdzielone |
| TC-014 | PUT bez tokenu | Negatywny | High | bookingId istnieje | 1. `PUT` bez Cookie | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-015 | DELETE bez tokenu | Negatywny | High | bookingId istnieje | 1. `DELETE` bez Cookie | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-016 | GET po usunięciu | Negatywny | Medium | TC-008 Pass | 1. `GET /booking/{{bookingId}}` | Status **404**, body `Not Found` | Pass | |
| TC-017 | Auth — puste dane | Negatywny | Medium | — | 1. `POST /auth` z `{}` | Jak złe hasło: **200** + `Bad credentials`, bez tokenu | Pass | |
| TC-018 | Rezerwacja — brak lastname | Negatywny | High | — | 1. `POST /booking` bez `lastname` | **4xx**, bez 500 | Fail | **BUG-001** · faktycznie **500** (jak TC-010) |
| TC-019 | Rezerwacja — totalprice jako string | Negatywny | Medium | — | 1. `POST /booking` z `"totalprice": "abc"` | **4xx** (błąd typu), brak rezerwacji | Fail | **BUG-003** · faktycznie **200**, `totalprice: null` |
| TC-020 | PATCH bez tokenu | Negatywny | High | bookingId istnieje | 1. `PATCH` bez Cookie | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-021 | PUT ze złym tokenem | Negatywny | High | bookingId istnieje | 1. `PUT` z `Cookie: token=invalidtoken` | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-022 | DELETE już usuniętej rezerwacji | Negatywny | Medium | TC-008 Pass | 1. Ponowny `DELETE` z ważnym Cookie | Status **405**, body `Method Not Allowed` | Pass | Nie 404 |

## Powiązanie z automatyzacją

| Przypadek | Request w Postmanie | Folder | Automatyzacja |
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
