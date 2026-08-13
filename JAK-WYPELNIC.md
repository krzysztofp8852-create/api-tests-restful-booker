# Jak wypełnić ten szablon

Stanowisko jest gotowe: kolekcja Postmana, Newman, GitHub Actions i puste artefakty QA.
Twoja robota to **myślenie testerskie**, nie setup.

## Kolejność (ok. 3–5 dni)

1. Zaimportuj `postman/` do Postmana i odpal folder **00–05** (happy path). Ma przejść.
2. Weź folder **90 Negative / TODO**. Zdejmij `pm.test.skip`, uzupełnij asercje, zapisz faktyczny status i body.
3. Każdy zaliczony (albo świadomie failed) scenariusz wpisz do przypadków testowych:
   - EN: [`docs/en/test-cases.md`](docs/en/test-cases.md)
   - PL: [`docs/pl/przypadki-testowe.md`](docs/pl/przypadki-testowe.md)
4. Jeśli API zachowa się dziwnie (np. przyjmie checkout przed check-in) — zgłoś bug z szablonu w `docs/bugs/`.
5. Dokończ plan testów: zakres, ryzyka, kryteria wyjścia.
6. Odpal `npm test` lokalnie, wypchnij na GitHub, sprawdź zielone Actions.
7. Dopisz repo do CV (wzorzec w README).

## Czego nie ruszać bez potrzeby

- `.github/workflows/api-tests.yml` — już uruchamia Newmana.
- Happy path (00–05) — to wzorzec asercji. Możesz dodać, nie kasuj działających testów.
- Raporty w `reports/` — generowane, nie commituj HTML-i.

## Znaczniki w plikach

| Znacznik | Znaczenie |
|---|---|
| `[FILL IN]` / `[UZUPEŁNIJ]` | Wpisz treść |
| `[DATE]` | Data, np. 2026-08-13 |
| `pm.test.skip` | Test szkicowy — zdejmij skip, gdy asercja jest gotowa |
| `TODO` w skryptach Postmana | Asercja do dodania, nie do usunięcia folderu |

## Jakość, której szuka rekruter

- Przypadki mają **expected result**, nie tylko kroki.
- Bug ma **kroki reprodukcji** i załącznik (screenshot / fragment response).
- README mówi **co, czym i jak odpalić** w 30 sekund.
- CI jest zielone albo świadomie czerwone z wyjaśnieniem w Issues.
