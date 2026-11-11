# Contributing to Bingo.io 🎯

Thank you for your interest in contributing to **Bingo.io**! We welcome bug reports, feature suggestions, and pull requests.

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/Tanmayxbhadre/bingo.git
   cd bingo
   ```

2. **Branch Naming**
   - Features: `feature/your-feature-name`
   - Bug fixes: `fix/issue-description`
   - Documentation: `docs/what-changed`

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Dev Environment**
   ```bash
   npm run dev
   ```

5. **Verify Tests Before Submitting**
   Make sure all tests pass and the production build completes cleanly:
   ```bash
   npm test
   npm --workspace=client run build
   ```

6. **Submit a Pull Request**
   Push your branch and open a PR against `main` with a clear description of your changes.

## Code Standards
- Keep components modular and reusable under `client/src/components/`.
- Ensure authoritative game rules remain verified on the server in `server/src/game/`.
- Preserve the colorful skribbl.io playful styling.

