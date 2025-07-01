# Frontend

## Status
- All tests pass (81/81)
- High code coverage
- Linting and formatting with Biome
- Testing with Vitest and @testing-library/react

## Scripts
- `npm run test:coverage` — run all tests with coverage
- `npm run lint` — run Biome linter
- `npm run test:e2e:headless` — run Cypress E2E tests in headless mode

## E2E Testing
- E2E tests are run automatically in CI/CD (see .github/workflows/ci.yml)
- To run locally:
  ```bash
  npm run test:e2e:headless
  ```
- For fullstack testing, use Docker Compose:
  ```bash
  docker-compose up -d
  # Then run E2E tests
  cd frontend && npm run test:e2e:headless
  ```

## Troubleshooting
- If tests hang, check for async/await issues or infinite loops.
- If you get selector errors, use more specific queries (e.g., `getByLabelText`, `getByRole`).
- For mocking issues, use `vi.mock` and reset modules as needed.

## More
- See the root README for full-stack info and backend details. 