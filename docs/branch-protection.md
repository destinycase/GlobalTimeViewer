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
   - `test`
   - `build_strict`
5. Save rule.

## Why these checks

- `test`: runs the Vitest suite in CI.
- `build_strict`: runs strict build with version consistency enforcement.

## Local preflight command

Before pushing, run:

```bash
npm run ci:gate
```

This runs:

- `npm run test -- --run`
- `npm run build:strict`
