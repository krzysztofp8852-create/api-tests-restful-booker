# Restful Booker API tests

API tests for [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) using Postman, Newman and GitHub Actions.

Coverage: authentication, booking CRUD, negative cases. 22 test cases (TC-001–TC-022). Defects are in `docs/bugs/`.

[Wersja polska](README.md)

![API Tests](https://github.com/krzysztofp8852-create/api-tests-restful-booker/actions/workflows/api-tests.yml/badge.svg)

## Run

```bash
npm install
npm test
```

HTML report: `reports/newman-report.html`.

In Postman, import `postman/`, select **Restful Booker — Local**, run the collection from the top (folders 00–07). Order matters: token and `bookingId` are passed between requests; DELETE runs last.

## Docs

- [Test plan](docs/en/test-plan.md) · [Test cases](docs/en/test-cases.md)
- [BUG-001](docs/bugs/BUG-001.md) · [BUG-002](docs/bugs/BUG-002.md) · [BUG-003](docs/bugs/BUG-003.md)
