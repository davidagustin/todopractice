# Frontend

## Status
- All tests pass (81/81)
- High code coverage
- Linting and formatting with Biome
- Testing with Vitest and @testing-library/react

## Scripts
- `npm run test:coverage` — run all tests with coverage
- `npm run lint` — run Biome linter

## Troubleshooting
- If tests hang, check for async/await issues or infinite loops.
- If you get selector errors, use more specific queries (e.g., `getByLabelText`, `getByRole`).
- For mocking issues, use `vi.mock` and reset modules as needed.

## More
- See the root README for full-stack info and backend details. 