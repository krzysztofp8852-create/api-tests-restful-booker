# Testy API — Restful Booker

Testy API [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html): Postman, Newman, GitHub Actions.

Zakres: autoryzacja, CRUD rezerwacji, scenariusze negatywne. 22 przypadki (TC-001–TC-022). Znalezione defekty są w `docs/bugs/`.

[English version](README_EN.md)

![API Tests](https://github.com/krzysztofp8852-create/api-tests-restful-booker/actions/workflows/api-tests.yml/badge.svg)

## Uruchomienie

```bash
npm install
npm test
```

Raport HTML: `reports/newman-report.html`.

W Postmanie: Import folderu `postman/`, environment **Restful Booker — Local**, uruchom kolekcję od góry (foldery 00–07). Kolejność jest ważna — token i `bookingId` są przekazywane między requestami, DELETE na końcu.

## Struktura

```
postman/                 kolekcja i environment
docs/en/                 plan i przypadki (EN)
docs/pl/                 plan i przypadki (PL)
docs/bugs/               zgłoszenia
.github/workflows/       Newman na push
```

## Dokumentacja

- [Plan testów (PL)](docs/pl/plan-testow.md) · [EN](docs/en/test-plan.md)
- [Przypadki (PL)](docs/pl/przypadki-testowe.md) · [EN](docs/en/test-cases.md)
- [BUG-001](docs/bugs/BUG-001.md) · [BUG-002](docs/bugs/BUG-002.md) · [BUG-003](docs/bugs/BUG-003.md)
