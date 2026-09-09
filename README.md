# Testy API — Restful Booker

Testy API [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html): Postman, Newman, GitHub Actions.

Zakres: autoryzacja (token i HTTP Basic), CRUD rezerwacji, filtry, negocjacja treści, kontrakty JSON Schema, scenariusze negatywne i smoke testy bezpieczeństwa. 42 przypadki (TC-001–TC-042), 268 asercji. Znalezione defekty są w [`docs/bugs/`](docs/bugs/README.md).

[English version](README_EN.md)

![API Tests](https://github.com/krzysztofp8852-create/api-tests-restful-booker/actions/workflows/api-tests.yml/badge.svg)

## Uruchomienie

```bash
npm install
npm test
```

Raport HTML: `reports/newman-report.html`. Krótkie podsumowanie w konsoli: `npm run report:summary`.

| Skrypt | Do czego |
|---|---|
| `npm test` | pełny przebieg + raport HTML i JSON |
| `npm run test:cli` | szybki przebieg, tylko konsola |
| `npm run test:ci` | jak `test`, plus raport JUnit (używane przez CI) |
| `npm run lint:collection` | walidacja kolekcji i powiązania przypadków z requestami |
| `npm run report:summary` | podsumowanie ostatniego raportu Newman |

W Postmanie: import folderu `postman/`, environment **Restful Booker — Local**, uruchom kolekcję od góry (foldery 00–08). Kolejność jest ważna — token i `bookingId` powstają na happy path, testy autoryzacji idą przed DELETE, a folder `08 Cleanup` usuwa dane utworzone przez przypadki negatywne. Szczegóły w [`postman/README.md`](postman/README.md).

## Jak zbudowana jest suita

- **Dane per przebieg.** Skrypt pre-request kolekcji generuje `runId` i dokleja go do imienia i nazwiska, a wszystkie daty liczy względem dnia uruchomienia. Żadna asercja nie zależy od zaszytej daty, a filtry po `firstname` / `lastname` trafiają dokładnie w rezerwacje z tego przebiegu.
- **Kontrakty, nie tylko pola.** Każda odpowiedź JSON jest walidowana względem JSON Schema (token, rezerwacja, odpowiedź create, lista ID), więc dodane lub przemianowane pole łamie test od razu.
- **Asercje globalne.** Skrypt testowy kolekcji sprawdza dla *każdej* odpowiedzi budżet czasu, obecność `Content-Type` i niepuste body.
- **Teardown.** Rezerwacje z przypadków negatywnych trafiają do kolejki i są usuwane w folderze `08 Cleanup` — publiczna piaskownica nie puchnie po każdym nocnym uruchomieniu CI.
- **Traceability pilnowane przez skrypt.** `npm run lint:collection` wywala build, jeśli przypadek z dokumentacji nie ma requestu, request nie ma przypadku, request nie ma asercji albo w payloadzie pojawi się zaszyta data.

## Struktura

```
postman/                 kolekcja i environment
docs/en/                 plan i przypadki (EN)
docs/pl/                 plan i przypadki (PL)
docs/bugs/               zgłoszenia BUG-001 … BUG-007
scripts/                 walidacja kolekcji, podsumowanie raportu
.github/workflows/       Newman: push, PR, nocna regresja
```

## Dokumentacja

- [Plan testów (PL)](docs/pl/plan-testow.md) · [EN](docs/en/test-plan.md)
- [Przypadki (PL)](docs/pl/przypadki-testowe.md) · [EN](docs/en/test-cases.md)
- [Zgłoszenia defektów](docs/bugs/README.md) — 7 defektów, 5 z jednej przyczyny: brak walidacji payloadu w `POST /booking`
