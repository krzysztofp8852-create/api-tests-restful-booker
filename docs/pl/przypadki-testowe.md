# Przypadki testowe — Restful Booker API

Status: **wykonane** · Plan: [`plan-testow.md`](plan-testow.md)  
English copy: [`../en/test-cases.md`](../en/test-cases.md)

**Statusy:** `Pass` = API zgodne z oczekiwaniem jakościowym/dokumentacją · `Fail` = defekt (kolumna Bug) · `Not run` / `Blocked` / `Skipped`

Newman asseruje **faktyczne** zachowanie API, żeby CI było zielone. Przy `Fail` kolekcja i tak sprawdza bieżącą (błędną) odpowiedź, a lukę opisują zgłoszenia w `docs/bugs/`. `npm run lint:collection` wywala build, jeśli przypadek z tej listy nie ma requestu albo request nie ma przypadku.

Dane testowe są generowane per uruchomienie (nazwy z sufiksem `runId`, daty względem dnia bieżącego), więc każdy przypadek jest powtarzalny na współdzielonej piaskownicy i żadna asercja nie zależy od zaszytej daty.

## Przypadki pozytywne i funkcjonalne

| ID | Tytuł | Typ | Priorytet | Warunki wstępne | Kroki | Oczekiwany rezultat | Status | Bug / uwagi |
|---|---|---|---|---|---|---|---|---|
| TC-001 | Health check — ping | Smoke | High | API dostępne | 1. `GET /ping` | Status **201**, body zawiera `Created`, `Content-Type: text/plain` | Pass | Bramka dla całego przebiegu |
| TC-002 | Token — poprawne dane | Funkcjonalny | High | Dane demo | 1. `POST /auth` z `{{username}}` / `{{password}}` | Status **200**, body zgodne ze schematem tokenu, niepusty alfanumeryczny `token` | Pass | Token w zmiennej kolekcji |
| TC-003 | Utworzenie rezerwacji — poprawny payload | Funkcjonalny | High | — | 1. `POST /booking` z pełnym payloadem | Status **200**, body zgodne ze schematem, payload zwrócony bez zmian | Pass | Dostarcza `bookingId` dla folderów 03–07 |
| TC-004 | Odczyt rezerwacji po ID | Funkcjonalny | High | TC-003 Pass | 1. `GET /booking/{{bookingId}}` | Status **200**, body zgodne ze schematem, wszystkie 7 pól równe temu, co wysłał TC-003 | Pass | |
| TC-005 | Lista ID rezerwacji | Funkcjonalny | Medium | TC-003 Pass | 1. `GET /booking` | Status **200**, zgodne ze schematem listy, utworzone ID obecne | Pass | Dane współdzielone — nigdy nie asseruj długości listy |
| TC-006 | Pełna aktualizacja (PUT, cookie token) | Funkcjonalny | High | Token + bookingId | 1. `PUT /booking/{{bookingId}}` z `Cookie: token=` | Status **200**, każde wysłane pole zastosowane | Pass | |
| TC-007 | Częściowa aktualizacja (PATCH, cookie token) | Funkcjonalny | Medium | TC-006 Pass | 1. `PATCH` tylko `additionalneeds` | Status **200**, `additionalneeds` zmienione, pozostałe pola z TC-006 zachowane | Pass | |
| TC-008 | Usunięcie rezerwacji (cookie token) | Funkcjonalny | High | Token + bookingId | 1. `DELETE /booking/{{bookingId}}` z `Cookie: token=` | Status **201**, body zawiera `Created` | Pass | Udokumentowany quirk — oczekiwane byłoby 204 |
| TC-013 | Filtr po firstname | Funkcjonalny | Medium | Własna rezerwacja (przed delete) | 1. `GET /booking?firstname={{runFirstname}}` | Status **200**, utworzone ID obecne, zwrócone **tylko** ID z tego przebiegu | Pass | Nazwa per przebieg czyni filtr dokładnym |
| TC-025 | Filtr po lastname | Funkcjonalny | Low | Własna rezerwacja | 1. `GET /booking?lastname={{runLastname}}` | Status **200**, utworzone ID obecne | Pass | |
| TC-026 | Filtr po zakresie dat | Funkcjonalny | Medium | Własna rezerwacja | 1. `GET /booking?checkin=…&checkout=…` obejmujący daty z TC-003 | Status **200**, zgodne ze schematem listy, utworzone ID w zakresie | Pass | |
| TC-033 | Rezerwacja — nieznane dodatkowe pole | Funkcjonalny | Medium | — | 1. `POST /booking` z dodanym `isAdmin` i `unknownField` | Status **200**, nieznane pola pomijane, nie zwracane, nie zapisane | Pass | Kontrola mass assignment |
| TC-035 | Pełna aktualizacja (PUT, HTTP Basic auth) | Funkcjonalny | Medium | bookingId istnieje | 1. `PUT` z `Authorization: Basic` zamiast cookie | Status **200**, aktualizacja zastosowana | Pass | Udokumentowana alternatywa uwierzytelnienia |
| TC-037 | Częściowa aktualizacja — puste body | Funkcjonalny | Medium | TC-007 Pass | 1. `PATCH` z `{}` | Status **200**, rezerwacja zwrócona bez zmian, żadne pole nie wyczyszczone | Pass | No-op nie może kasować danych |
| TC-038 | Usunięcie rezerwacji (HTTP Basic auth) | Funkcjonalny | Medium | Utworzona rezerwacja pomocnicza | 1. `DELETE` z `Authorization: Basic`<br>2. `GET` tego samego ID | Status **201**, kolejny `GET` zwraca **404** | Pass | Korzysta z własnej rezerwacji pomocniczej |
| TC-041 | Usunięta rezerwacja znika z listy filtrowanej | Funkcjonalny | Medium | TC-008 Pass | 1. `GET /booking?firstname={{runFirstname}}` | Status **200**, usunięte ID **nieobecne** | Pass | Delete musi działać też w zapytaniach, nie tylko w `GET` po ID |

## Przypadki negatywne i autoryzacyjne

| ID | Tytuł | Typ | Priorytet | Warunki wstępne | Kroki | Oczekiwany rezultat | Status | Bug / uwagi |
|---|---|---|---|---|---|---|---|---|
| TC-009 | Auth — złe hasło | Negatywny | High | — | 1. `POST /auth` ze złym hasłem | Brak użytecznego tokenu. Dokumentacja: **200** + `{ "reason": "Bad credentials" }`, nie 401 | Pass | Zachowanie zgodne z docs; ważny token nietknięty |
| TC-017 | Auth — puste dane | Negatywny | Medium | — | 1. `POST /auth` z `{}` | Jak złe hasło: **200** + `Bad credentials`, bez tokenu | Pass | |
| TC-023 | Auth — nieistniejący użytkownik | Negatywny | Medium | — | 1. `POST /auth` z `no-such-user` | **200** + `Bad credentials`; komunikat nie może ujawniać, czy użytkownik istnieje | Pass | Brak enumeracji użytkowników |
| TC-024 | Auth — payload SQL injection | Bezpieczeństwo (smoke) | High | — | 1. `POST /auth` z `admin' OR '1'='1` | **200** + `Bad credentials`, brak tokenu, brak błędu SQL i stack trace w body | Pass | Payload tautologiczny odrzucony |
| TC-010 | Rezerwacja — brak firstname | Negatywny | High | — | 1. `POST /booking` bez `firstname` | **4xx**, bez 5xx, bez `bookingid` | Fail | **BUG-001** · faktycznie **500** `Internal Server Error` |
| TC-018 | Rezerwacja — brak lastname | Negatywny | High | — | 1. `POST /booking` bez `lastname` | **4xx**, bez 5xx | Fail | **BUG-001** · faktycznie **500** |
| TC-030 | Rezerwacja — puste body | Negatywny | High | — | 1. `POST /booking` bez body | **400** | Fail | **BUG-001** · faktycznie **500** |
| TC-029 | Rezerwacja — niepoprawny JSON | Negatywny | Medium | — | 1. `POST /booking` z `{ "firstname": "Malformed",` | **400** `Bad Request`, rezerwacja nie powstaje | Pass | Odrzucenie na poziomie parsera działa poprawnie |
| TC-011 | Rezerwacja — checkout przed checkin | Negatywny | High | — | 1. `POST /booking` z odwróconym zakresem dat | **4xx**, zakres odrzucony, rezerwacja nie powstaje | Fail | **BUG-002** · faktycznie **200**, rezerwacja zapisana |
| TC-019 | Rezerwacja — totalprice jako string | Negatywny | Medium | — | 1. `POST /booking` z `"totalprice": "abc"` | **4xx** (błąd typu), rezerwacja nie powstaje | Fail | **BUG-003** · faktycznie **200**, `totalprice: null` |
| TC-039 | Rezerwacja — depositpaid jako string | Negatywny | Medium | — | 1. `POST /booking` z `"depositpaid": "yes"` | **4xx** (błąd typu), rezerwacja nie powstaje | Fail | **BUG-003** · faktycznie **200**, skonwertowane na `true` |
| TC-031 | Rezerwacja — nieparsowalna data | Negatywny | High | — | 1. `POST /booking` z `"checkin": "not-a-date"` | **4xx**, rezerwacja nie powstaje | Fail | **BUG-004** · faktycznie **200**, zapisane jako literał `0NaN-aN-aN` |
| TC-032 | Rezerwacja — ujemna totalprice | Negatywny | Medium | — | 1. `POST /booking` z `"totalprice": -500` | **4xx**, ujemna cena odrzucona | Fail | **BUG-005** · faktycznie **200**, `-500` zapisane |
| TC-012 | GET — nieistniejące ID | Negatywny | Medium | — | 1. `GET /booking/99999999` | Status **404**, body `Not Found` | Pass | |
| TC-028 | GET — nieliczbowe ID | Negatywny | Medium | — | 1. `GET /booking/not-a-number` | Status **404**, body `Not Found`, bez wycieku szczegółów | Pass | |
| TC-027 | GET — `Accept: application/xml` | Kontrakt | Medium | bookingId istnieje | 1. `GET /booking/{{bookingId}}` z `Accept: application/xml` | **200**, payload XML, `Content-Type: application/xml` | Fail | **BUG-006** · body XML podane jako `text/html` |
| TC-042 | GET — nieobsługiwany typ Accept | Negatywny | Low | bookingId istnieje | 1. `GET /booking/{{bookingId}}` z `Accept: application/pdf` | **406 Not Acceptable** | Fail | **BUG-007** · faktycznie **418 I'm a teapot** |
| TC-034 | Pełna aktualizacja — niepełny payload | Negatywny | High | Token + bookingId | 1. `PUT` bez `lastname`<br>2. `GET` rezerwacji | **400** `Bad Request`, rezerwacja niezmieniona | Pass | Walidacja jest w PUT, ale nie w POST — dowód do BUG-001 |
| TC-036 | Pełna aktualizacja — nieistniejące ID | Negatywny | Medium | Ważny token | 1. `PUT /booking/99999999` | Udokumentowany quirk: **405 Method Not Allowed** (oczekiwane 404) | Pass | |
| TC-014 | PUT bez tokenu | Negatywny | High | bookingId istnieje | 1. `PUT` bez `Cookie` | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-021 | PUT ze złym tokenem | Negatywny | High | bookingId istnieje | 1. `PUT` z `Cookie: token=invalidtoken` | Status **403**, body `Forbidden` | Pass | Przed delete |
| TC-020 | PATCH bez tokenu | Negatywny | High | bookingId istnieje | 1. `PATCH` bez `Cookie`<br>2. `GET` rezerwacji | Status **403**, a odrzucony patch **nie** zmienił rezerwacji | Pass | Przed delete |
| TC-015 | DELETE bez tokenu | Negatywny | High | bookingId istnieje | 1. `DELETE` bez `Cookie`<br>2. `GET` rezerwacji | Status **403**, a rezerwacja nadal zwraca **200** | Pass | Przed delete |
| TC-040 | DELETE ze złym Basic auth | Negatywny | High | bookingId istnieje | 1. `DELETE` ze złymi danymi Basic | Status **403**, body `Forbidden` | Pass | Oba sposoby uwierzytelnienia odrzucają jednakowo |
| TC-016 | GET po usunięciu | Negatywny | Medium | TC-008 Pass | 1. `GET /booking/{{bookingId}}` | Status **404**, body `Not Found` | Pass | |
| TC-022 | DELETE już usuniętej rezerwacji | Negatywny | Medium | TC-008 Pass | 1. Ponowny `DELETE` tego ID z ważnym tokenem | Udokumentowany quirk: **405 Method Not Allowed** (oczekiwane 404) | Pass | |

## Asercje globalne

Wykonywane dla **każdej** odpowiedzi przez skrypt testowy na poziomie kolekcji, więc regresja w dowolnym endpoincie zostanie wychwycona nawet wtedy, gdy jego własny przypadek przechodzi:

| Asercja | Cel |
|---|---|
| Czas odpowiedzi poniżej `responseTimeBudgetMs` (domyślnie 5000 ms) | Zabezpieczenie przed regresją wydajności |
| Odpowiedź deklaruje `Content-Type` | Brak nieopisanych odpowiedzi, także błędnych |
| Body odpowiedzi nie jest puste | Brak cichych pustych odpowiedzi |

## Powiązanie z automatyzacją

| Przypadek | Request w Postmanie | Folder |
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

Dwa requesty w kolekcji nie są przypadkami testowymi: `SETUP POST Create booking for TC-038` (dane pomocnicze dla TC-038) i `CLEAN DELETE bookings created by negative cases` (folder 08, teardown).

## Pokrycie endpointów

| Endpoint | Przypadki |
|---|---|
| `GET /ping` | TC-001 |
| `POST /auth` | TC-002, TC-009, TC-017, TC-023, TC-024 |
| `POST /booking` | TC-003, TC-010, TC-011, TC-018, TC-019, TC-029, TC-030, TC-031, TC-032, TC-033, TC-039 |
| `GET /booking` | TC-005, TC-013, TC-025, TC-026, TC-041 |
| `GET /booking/:id` | TC-004, TC-012, TC-016, TC-027, TC-028, TC-042 |
| `PUT /booking/:id` | TC-006, TC-014, TC-021, TC-034, TC-035, TC-036 |
| `PATCH /booking/:id` | TC-007, TC-020, TC-037 |
| `DELETE /booking/:id` | TC-008, TC-015, TC-022, TC-038, TC-040 |

42 przypadki: 32 `Pass`, 10 `Fail` (BUG-001 … BUG-007), 0 `Not run`.
