# Plan testów — Restful Booker API

Status: **wykonany** · Autor: Krzysztof Pabich · Data: 2026-08-13 · Wersja: `1.0`

English copy: [`../en/test-plan.md`](../en/test-plan.md)

---

## 1. Cel

Sprawdzić, czy API Restful Booker działa zgodnie z publiczną dokumentacją w zakresie autoryzacji i CRUD rezerwacji, a luki (brak walidacji, niejasne kody statusu) udokumentować jako defekty.

## 2. Zakres

**W zakresie**

- `GET /ping`
- `POST /auth`
- `POST /booking`, `GET /booking`, `GET /booking/:id`
- `PUT /booking/:id`, `PATCH /booking/:id`
- `DELETE /booking/:id`
- Negatywy: złe dane logowania, brakujące pola, nieistniejące ID, brak tokenu, niepoprawny zakres dat

**Poza zakresem**

- UI ewentualnego frontendu
- Wydajność / obciążenie (JMeter) — `[UZUPEŁNIJ: zostawiam / dodam później]`
- Bezpieczeństwo poza brakiem/błędnym tokenem
- Inne środowiska niż publiczne demo

## 3. Obiekt i środowisko

| Element | Wartość |
|---|---|
| Aplikacja | Restful Booker |
| Base URL | `https://restful-booker.herokuapp.com` |
| Dokumentacja | https://restful-booker.herokuapp.com/apidoc/index.html |
| Auth | `admin` / `password123` (publiczne) |
| Ograniczenie | Współdzielona piaskownica — w `GET /booking` mogą być dane innych osób |

## 4. Rodzaje testów

| Rodzaj | Pokryte? | Uwagi |
|---|---|---|
| Smoke | tak | Ping + create + get |
| Funkcjonalne (pozytywne) | tak | foldery 00–05 |
| Negatywne / walidacja | tak | TC-009–TC-012, TC-017–TC-019, TC-022 |
| Autoryzacja | tak | TC-014, TC-015, TC-020, TC-021 (folder 05, przed DELETE) |
| Kontrakt / schema | opcjonalnie | `[UZUPEŁNIJ]` |
| Regresja | CI przy każdym pushu | Newman |

## 5. Podejście

1. Eksploracja w Postmanie, potem zamrożenie asercji w kolekcji.
2. Najpierw happy path (już zrobiony w szkielecie).
3. Negatywy: zaobserwuj faktyczne zachowanie → wpisz expected → jeśli kłóci się z dokumentacją lub zdrowym rozsądkiem, zgłoś buga.
4. Newman w GitHub Actions jako bramka smoke/regresji.

## 6. Kryteria wejścia

- [ ] Kolekcja importuje się bez błędów
- [ ] Wybrane środowisko (`Restful Booker — Local`)
- [ ] `GET /ping` kończy się sukcesem
- [ ] `[UZUPEŁNIJ]`

## 7. Kryteria wyjścia

- [ ] Wszystkie przypadki w `przypadki-testowe.md` mają status Pass / Fail / Blocked
- [ ] Fail ma ID buga albo udokumentowane ograniczenie
- [ ] `npm test` (happy path) jest zielone lokalnie i na CI
- [ ] Co najmniej `[UZUPEŁNIJ: np. 2]` zgłoszenia, **jeśli** są defekty; jeśli brak — krótka notatka „nie znaleziono”
- [ ] `[UZUPEŁNIJ]`

## 8. Dostarczane artefakty

- Kolekcja Postmana + environment
- Raport Newman (HTML/JSON)
- Ten plan
- Lista przypadków
- Bug reporty w `docs/bugs/`

## 9. Ryzyka

| Ryzyko | Wpływ | Mitygacja |
|---|---|---|
| Publiczne, współdzielone API | Średni | Twórz własną rezerwację; nie polegaj na cudzych ID |
| Niedostępność / wolne odpowiedzi | Średni | Retry; budżet czasu asercji 3 s |
| Dokumentacja ≠ rzeczywistość | Niski (w portfolio: plus) | Zgłaszaj bugi, nie ukrywaj ich w testach |
| `[UZUPEŁNIJ]` | | |

## 10. Harmonogram

| Kamień milowy | Data |
|---|---|
| Plan gotowy | `[DATA]` |
| Happy path zautomatyzowany | `[DATA]` |
| Negatywy + przypadki uzupełnione | `[DATA]` |
| Bugi spisane | `[DATA]` |
| CI zielone na GitHubie | `[DATA]` |

## 11. Akceptacja

| Rola | Imię | Data |
|---|---|---|
| Autor (tester) | `[UZUPEŁNIJ]` | `[DATA]` |
| Reviewer (opcjonalnie) | `[UZUPEŁNIJ]` | `[DATA]` |
