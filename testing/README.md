# Smoke Testing

Playwright smoke tests for SmartWallet.

## Setup

From the repository root:

```bash
cd testing
npm install
npx playwright install
```

## Run

Playwright starts the frontend and backend automatically through `playwright.config.ts`, so you do not need to run either server manually.

From the `testing` folder:

```bash
npm test
```

Run only the smoke suite from the `testing` folder:

```bash
npm run test:smoke
```

Or from the repository root:

```bash
npm run smoke:test
```

If you want to run the smoke suite directly with Playwright from `testing`, you can also use:

```bash
npx playwright test tests/smoke
```

To run a single smoke spec:

```bash
npx playwright test tests/smoke/application.smoke.spec.ts
```

## Environment

Optional overrides:

- `BASE_URL` defaults to `http://127.0.0.1:5173`
- `BACKEND_URL` defaults to `http://127.0.0.1:3000`

## Notes

- The smoke suite covers the available critical paths: availability, dashboard, navigation, expenses page, add-expense flow, and API availability.
