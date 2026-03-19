# Branch Protection

Use this baseline for `main`:

1. Open `Settings -> Branches -> Add branch protection rule`.
2. Branch name pattern: `main`.
3. Enable:
   - `Require a pull request before merging`
   - `Require status checks to pass before merging`
   - `Require branches to be up to date before merging`
   - `Do not allow bypassing the above settings`
4. Required checks:
   - `lint`
   - `test`
   - `coverage`
   - `build_strict`
5. Save rule.

## Why these checks

- `lint`: runs semantic safety lint checks.
- `test`: runs the Vitest suite in CI.
- `coverage`: runs tests with coverage instrumentation and threshold validation.
  - thresholds: statements/lines `>= 42.5%`, branches `>= 45.3%`, functions `>= 20.8%`
- `build_strict`: runs strict build with version consistency enforcement.

## Local preflight command

Before pushing, run:

```bash
npm run ci:gate
```

This runs:

- `npm run lint`
- `npm run test:coverage`
- `npm run build:strict`
