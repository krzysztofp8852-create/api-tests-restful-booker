# Restful Booker — API tests

**Postman + Newman + GitHub Actions.** 22 cases (TC-001–TC-022) covered by the collection, including negatives and three filed defects.

**Polish:** [README.md](README.md)

## Goal

Test the public [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) API: auth, booking CRUD, negatives (validation, missing auth, unknown IDs). The API is shared and imperfect — defects are in `docs/bugs/`.

## Run

```bash
npm install
npm test
```

HTML report: `reports/newman-report.html`.

Import `postman/` into Postman, select **Restful Booker — Local**, run folders **00 → 07** in order.

## QA artifacts

- [Test plan](docs/en/test-plan.md) · [Test cases](docs/en/test-cases.md)
- [BUG-001](docs/bugs/BUG-001.md) · [BUG-002](docs/bugs/BUG-002.md) · [BUG-003](docs/bugs/BUG-003.md)
