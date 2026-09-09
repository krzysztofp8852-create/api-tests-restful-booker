# Plan testów — Restful Booker API

Status: **wykonany** · Autor: Krzysztof Pabich · Data: 2026-09-09 · Wersja: `1.1`

English copy: [`../en/test-plan.md`](../en/test-plan.md)

---

## 1. Cel

Sprawdzić, czy API Restful Booker działa zgodnie z publiczną dokumentacją w zakresie autoryzacji i CRUD rezerwacji, zweryfikować każdą odpowiedź względem kontraktu (JSON Schema), a luki (brak walidacji, niejasne kody statusu, błędne typy mediów) udokumentować jako defekty.

## 2. Zakres

**W zakresie**

- `GET /ping`
- `POST /auth`
- `POST /booking`, `GET /booking`, `GET /booking/:id`
- `PUT /booking/:id`, `PATCH /booking/:id`
- `DELETE /booking/:id`
- Oba udokumentowane sposoby uwierzytelnienia: `Cookie: token=…` i HTTP Basic
- Filtry: `firstname`, `lastname`, `checkin`/`checkout`
- Negocjacja treści: `application/json`, `application/xml`, typy nieobsługiwane
- Kontrakty odpowiedzi (JSON Schema) dla każdego endpointu JSON
- Negatywy: złe dane logowania, brakujące pola, błędne typy, wartości poza zakresem, nieparsowalne daty, niepoprawny JSON, nieistniejące ID, brak lub zły token
- Smoke testy bezpieczeństwa: payload SQL injection w danych logowania, enumeracja użytkowników, mass assignment przez nieznane pola

**Poza zakresem**

- UI ewentualnego frontendu
- Testy wydajnościowe / obciążeniowe (JMeter) — asserowany jest tylko budżet czasu odpowiedzi
- Pełne testy bezpieczeństwa (authn/authz poza powyższymi przypadkami, rate limiting, konfiguracja TLS)
- Inne środowiska niż publiczne demo

## 3. Obiekt i środowisko

| Element | Wartość |
|---|---|
| Aplikacja | Restful Booker |
| Base URL | `https://restful-booker.herokuapp.com` |
| Dokumentacja | https://restful-booker.herokuapp.com/apidoc/index.html |
| Auth | `admin` / `password123` (publiczne) |
| Narzędzia | kolekcja Postman v2.1, Newman 6, Node.js 20 |
| CI | GitHub Actions — każdy push, każdy PR, nocnie o 04:15 UTC |
| Ograniczenie | Współdzielona piaskownica — w `GET /booking` mogą być dane innych osób |

## 4. Rodzaje testów

| Rodzaj | Pokryte? | Uwagi |
|---|---|---|
| Smoke | tak | Ping + auth + create + get (TC-001–TC-004) |
| Funkcjonalne (pozytywne) | tak | 16 przypadków w folderach 00–07, oba sposoby uwierzytelnienia |
| Negatywne / walidacja | tak | 17 przypadków: brakujące pola, błędne typy, zakresy, niepoprawny JSON, nieistniejące ID |
| Autoryzacja | tak | TC-014, TC-015, TC-020, TC-021, TC-040 (folder 05, przed DELETE) |
| Kontrakt / schema | tak | JSON Schema dla `/auth`, `POST /booking`, `GET /booking`, `GET /booking/:id`, odpowiedzi PUT/PATCH |
| Negocjacja treści | tak | TC-027 (XML), TC-042 (typ nieobsługiwany) |
| Bezpieczeństwo (smoke) | tak | TC-024 injection, TC-023 enumeracja użytkowników, TC-033 mass assignment |
| Niefunkcjonalne (budżet czasu) | częściowo | Asercja globalna: każda odpowiedź poniżej `responseTimeBudgetMs` (5000 ms) |
| Regresja | tak | Newman przy każdym pushu i nocnie (GitHub Actions) |

## 5. Podejście

1. Eksploracja API w Postmanie, potem zamrożenie asercji w kolekcji.
2. Najpierw happy path (auth → create → get → update → delete), potem warstwa negatywów.
3. Negatywy: zapis faktycznego zachowania, porównanie z dokumentacją i oczekiwaniem jakościowym, zgłoszenie buga przy rozjeździe. Asercja zawsze przypina **faktyczną** odpowiedź, więc CI jest zielone, a naprawa objawi się jako failujący test.
4. Walidacja każdej odpowiedzi JSON względem schematu, nie tylko pól istotnych dla danego przypadku — dodane albo przemianowane pole od razu łamie test kontraktowy.
5. Newman w GitHub Actions jako bramka smoke i regresji, poprzedzona lintem traceability.

## 6. Strategia danych testowych

Piaskownica jest współdzielona i długowieczna, więc naiwne dane testowe są źródłem niestabilnych wyników. Dlatego kolekcja:

- generuje `runId` raz na przebieg i dokleja go do `firstname` / `lastname`, żeby przypadki filtrów (TC-013, TC-025, TC-041) mogły asserować **dokładne** trafienie, a nie tylko „nasze ID jest gdzieś na liście”;
- wyprowadza wszystkie daty z dnia uruchomienia (`dzisiaj + 7`, `+11`, `+13`, …), więc żadna asercja się nie przedawnia — poprzednia wersja tej suity miała zaszyte daty z września 2026;
- trzyma stan przebiegu (token, ID rezerwacji, wygenerowane dane, schematy) w zmiennych **kolekcji**, a konfigurację (base URL, dane logowania, budżet czasu) w **environmencie**, więc przebieg nigdy nie nadpisuje commitowanego pliku environmentu;
- zbiera każdą rezerwację utworzoną przez przypadek negatywny do kolejki teardown i usuwa ją w folderze `08 Cleanup`, więc nocne uruchomienia CI nie zaśmiecają współdzielonych danych.

## 7. Kryteria wejścia

- [x] Kolekcja importuje się bez błędów
- [x] Wybrane środowisko (`Restful Booker — Local`)
- [x] `GET /ping` zwraca 201
- [x] Node.js 20+ i `npm install` zakończone
- [x] `npm run lint:collection` przechodzi (kolekcja poprawna, traceability pełne)

## 8. Kryteria wyjścia

- [x] Wszystkie przypadki w `przypadki-testowe.md` mają status Pass lub Fail — 32 Pass, 10 Fail, 0 Not run
- [x] Każdy Fail ma ID buga (BUG-001 … BUG-007)
- [x] `npm test` jest zielone lokalnie i na CI — 53 requesty, 268 asercji, 0 błędów
- [x] Siedem zgłoszeń w `docs/bugs/`
- [x] Każdy przypadek powiązany z requestem w Postmanie, pilnowane przez `npm run lint:collection`
- [x] Przebieg nie zostawia danych testowych (folder `08 Cleanup` opróżnia kolejkę teardown)

## 9. Dostarczane artefakty

- Kolekcja Postmana + environment (`postman/`)
- Raporty Newman HTML / JSON / JUnit (`reports/` po `npm test` albo `npm run test:ci`)
- Ten plan
- Lista przypadków (TC-001–TC-042) z traceability i pokryciem per endpoint
- Zgłoszenia BUG-001 … BUG-007
- Pipeline CI z lintem kolekcji, bramką dostępności, podsumowaniem przebiegu i artefaktami raportów

## 10. Ryzyka

| Ryzyko | Wpływ | Mitygacja |
|---|---|---|
| Publiczne, współdzielone API, cudze dane na listach | Średni | Nazwy per przebieg; asercja obecności własnych ID, nigdy długości listy |
| Niedostępność / uśpiony dyno / wolne odpowiedzi | Średni | CI czeka na `GET /ping` → 201 przed uruchomieniem (6 prób); timeout requestu 15–20 s; budżet 5 s na odpowiedź |
| Narastanie danych testowych w piaskownicy | Średni | Folder `08 Cleanup` usuwa każdą rezerwację z przypadków negatywnych |
| Przedawnianie się asercji (zaszyte daty) | Średni | Wszystkie daty generowane względem dnia uruchomienia |
| Dokumentacja ≠ rzeczywistość | Niski | Zgłaszaj bugi; asercje na faktycznej odpowiedzi, żeby naprawa objawiła się jako fail |
| Rozjazd kolekcji i dokumentacji | Niski | `npm run lint:collection` wywala build przy nieopisanym przypadku lub requeście |

## 11. Harmonogram

| Kamień milowy | Data |
|---|---|
| Plan gotowy | 2026-08-13 |
| Happy path zautomatyzowany | 2026-08-13 |
| Negatywy + przypadki uzupełnione (TC-001–TC-022) | 2026-08-13 |
| BUG-001 … BUG-003 spisane | 2026-08-13 |
| CI zielone na GitHubie | 2026-08-13 |
| Pokrycie rozszerzone do TC-042, kontrakty schema, teardown, hardening CI | 2026-09-09 |
| BUG-004 … BUG-007 spisane | 2026-09-09 |

## 12. Akceptacja

| Rola | Imię | Data |
|---|---|---|
| Autor (tester) | Krzysztof Pabich | 2026-09-09 |
| Reviewer | — | — |
