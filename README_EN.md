# Restful Booker — API test workstation (template)

API testing setup: **Postman + Newman + GitHub Actions**.
The happy path runs out of the box. Negative cases, test cases and bug reports are templates for you to fill in.

**Polish:** [README.md](README.md) · **How to fill this in:** [JAK-WYPELNIC.md](JAK-WYPELNIC.md)

## Goal

Test the public [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) API:

- authentication (token)
- booking CRUD
- negatives (validation, missing auth, unknown IDs)

The API is shared and intentionally imperfect — good for writing defect reports.

## Run

```bash
npm install
npm test
```

HTML report: `reports/newman-report.html`.

Import `postman/` into Postman, select **Restful Booker — Local**, run folders 00–05, then complete folder **90 Negative / TODO**.

## QA artifacts to complete

- [Test plan](docs/en/test-plan.md)
- [Test cases](docs/en/test-cases.md)
- [Bug template](docs/bugs/_TEMPLATE.md)

Polish copies live in `docs/pl/` and `docs/bugs/_TEMPLATE.pl.md`.
