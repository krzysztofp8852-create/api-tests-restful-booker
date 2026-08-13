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
- Negatywy: złe dane logowania, brakujące pola, nieistniejące ID, brak tokenu, niepoprawny zakres dat, błędne typy

**Poza zakresem**

- UI ewentualnego frontendu
- Testy wydajnościowe / obciążeniowe (JMeter) — poza tym projektem
- Bezpieczeństwo poza brakiem lub błędnym tokenem
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
| Smoke | tak | Ping + create + get (TC-001, TC-003, TC-004) |
| Funkcjonalne (pozytywne) | tak | foldery 00–04 i 06 |
| Negatywne / walidacja | tak | TC-009–TC-012, TC-017–TC-019, TC-022 |
| Autoryzacja | tak | TC-014, TC-015, TC-020, TC-021 (folder 05, przed DELETE) |
| Kontrakt / schema | nie | Tylko asercje na pola, bez JSON Schema |
| Regresja | tak | Newman przy każdym pushu (GitHub Actions) |

## 5. Podejście

1. Eksploracja API w Postmanie, potem zamrożenie asercji w kolekcji.
2. Najpierw happy path (auth → create → get → update → delete).
3. Negatywy: zapis faktycznego zachowania, porównanie z dokumentacją / oczekiwaniem jakościowym, zgłoszenie buga przy rozjeździe.
4. Newman w GitHub Actions jako bramka smoke i regresji.

## 6. Kryteria wejścia

- [x] Kolekcja importuje się bez błędów
- [x] Wybrane środowisko (`Restful Booker — Local`)
- [x] `GET /ping` zwraca 201
- [x] Node.js 20+ i `npm install` zakończone

## 7. Kryteria wyjścia

- [x] Wszystkie przypadki w `przypadki-testowe.md` mają status Pass lub Fail
- [x] Fail ma ID buga (BUG-001, BUG-002, BUG-003)
- [x] `npm test` jest zielone lokalnie i na CI (22 requesty, 48 asercji)
- [x] Trzy zgłoszenia w `docs/bugs/`
- [x] Udokumentowana kolejność kolekcji (foldery 00–07)

## 8. Dostarczane artefakty

- Kolekcja Postmana + environment
- Raport Newman HTML/JSON (`reports/` po `npm test`)
- Ten plan
- Lista przypadków (TC-001–TC-022)
- Zgłoszenia BUG-001, BUG-002, BUG-003

## 9. Ryzyka

| Ryzyko | Wpływ | Mitygacja |
|---|---|---|
| Publiczne, współdzielone API | Średni | Twórz własną rezerwację; nie polegaj na cudzych ID |
| Niedostępność / wolne odpowiedzi | Średni | Retry; budżet czasu asercji 3 s |
| Dokumentacja ≠ rzeczywistość | Niski | Zgłaszaj bugi; w Newmanie aseruj faktyczną odpowiedź |
| `GET /booking?firstname=` trafia też w cudze rezerwacje | Niski | Sprawdzaj obecność własnego `bookingId`, nie długość listy = 1 |

## 10. Harmonogram

| Kamień milowy | Data |
|---|---|
| Plan gotowy | 2026-08-13 |
| Happy path zautomatyzowany | 2026-08-13 |
| Negatywy + przypadki uzupełnione | 2026-08-13 |
| Bugi spisane | 2026-08-13 |
| CI zielone na GitHubie | 2026-08-13 |

## 11. Akceptacja

| Rola | Imię | Data |
|---|---|---|
| Autor (tester) | Krzysztof Pabich | 2026-08-13 |
| Reviewer | — | — |
