# Restful Booker — testy API

Stanowisko testera API: **Postman + Newman + GitHub Actions**.
**22 przypadki (TC-001–TC-022)** pokryte kolekcją Postmana. Happy path, negatywy i trzy zgłoszone defekty.

**English:** see [README_EN.md](README_EN.md).

## Cel

Przetestować publiczne API [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html):

- autoryzacja (token)
- CRUD rezerwacji
- scenariusze negatywne (walidacja, brak auth, nieistniejące ID)

To API jest współdzielone i celowo niedoskonałe — nadaje się do zgłaszania defektów.

## Struktura

```
postman/          kolekcja + environment
docs/en/          plan, przypadki (EN — pod CV / rekrutera)
docs/pl/          to samo po polsku
docs/bugs/        szablony zgłoszeń + przykłady
.github/workflows CI (Newman przy pushu)
reports/          raport HTML/JSON po `npm test` (nie commitowany)
```

## Wymagania

- Node.js 20+
- Postman (aplikacja desktop)
- konto GitHub (do Actions)

## Uruchomienie

```bash
npm install
npm test
```

Raport: `reports/newman-report.html`.

### Postman (ręcznie)

1. Import → folder `postman/`
2. Wybierz environment **Restful Booker — Local**
3. Odpal kolekcję od góry (00 Health → 07 After delete) — kolejność ma znaczenie (token, `bookingId`, DELETE na końcu)

## Artefakty QA

| Plik | Język |
|---|---|
| [docs/en/test-plan.md](docs/en/test-plan.md) | EN |
| [docs/pl/plan-testow.md](docs/pl/plan-testow.md) | PL |
| [docs/en/test-cases.md](docs/en/test-cases.md) | EN |
| [docs/pl/przypadki-testowe.md](docs/pl/przypadki-testowe.md) | PL |
| [docs/bugs/BUG-001.md](docs/bugs/BUG-001.md) … [BUG-003](docs/bugs/BUG-003.md) | EN |

## Wpis do CV

**Testy API — Restful Booker** · Postman, Newman, GitHub Actions

- Zaprojektowałem przypadki testowe API (CRUD, autoryzacja, scenariusze negatywne).
- Zautomatyzowałem kolekcję Postmana i podłączyłem ją do CI (Newman).
- Udokumentowałem plan testów i zgłoszenia defektów.

Po publicznym repo dodaj link: `https://github.com/krzysztofp8852-create/api-tests-restful-booker`

## Badge CI

Po pierwszym pushu na GitHub podmień poniżej `USER/REPO`:

```markdown
![API Tests](https://github.com/krzysztofp8852-create/api-tests-restful-booker/actions/workflows/api-tests.yml/badge.svg)
```
