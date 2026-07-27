# Contributing to ClaimFlow

Thank you for considering contributing to **ClaimFlow**! This document provides guidelines and conventions for contributing code, reporting issues, and submitting pull requests.

---

## 🚀 Development Workflow

1. **Fork or Clone the Repository**:
   ```bash
   git clone https://github.com/your-org/ClaimFlow.git
   cd ClaimFlow
   ```

2. **Create a Feature Branch**:
   Branch names should follow the prefix convention:
   - `feat/feature-name` for new features
   - `fix/bug-description` for bug fixes
   - `docs/topic-name` for documentation updates
   - `refactor/component-name` for code refactoring

   ```bash
   git checkout -b feat/patient-claim-history
   ```

3. **Install Dependencies**:
   ```bash
   npm install              # Install root / frontend dependencies
   cd server && npm install # Install backend dependencies
   ```

4. **Start Development Servers**:
   ```bash
   # From project root:
   npm run dev              # Starts React frontend on http://localhost:5173
   npm run dev:server       # Starts Express backend on http://localhost:5000
   ```

5. **Test Your Changes**:
   Ensure all tests and type checks pass prior to submitting code:
   ```bash
   npm run build            # Verify frontend builds cleanly
   npm run build:server     # Verify backend builds cleanly
   ```

---

## 📝 Commit Message Convention

ClaimFlow follows the **[Conventional Commits Specification](https://www.conventionalcommits.org/)**.

### Format:
```text
<type>(<scope>): <short summary>

[optional body]

[optional footer(s)]
```

### Commit Types:
- **`feat`**: A new feature for the user or system.
- **`fix`**: A bug fix.
- **`docs`**: Documentation changes only.
- **`style`**: Changes that do not affect code logic (white-space, formatting, missing semi-colons, etc.).
- **`refactor`**: Code change that neither fixes a bug nor adds a feature.
- **`perf`**: A code change that improves performance.
- **`test`**: Adding missing tests or correcting existing tests.
- **`build`**: Changes that affect the build system or external dependencies.
- **`ci`**: Changes to CI configuration files and scripts.
- **`chore`**: Maintenance tasks, dependency updates, or internal configuration changes.

### Examples:
```bash
git commit -m "feat(claims): add patient document upload capability with PDF validation"
git commit -m "fix(auth): resolve JWT expiration token refresh issue"
git commit -m "docs(api): update claims patch endpoint specifications"
git commit -m "refactor(server): extract claim status update into claim.service.ts"
```

---

## 📥 Submitting Pull Requests (PRs)

1. Ensure code conforms to TypeScript and project formatting guidelines.
2. Push your feature branch to GitHub:
   ```bash
   git push origin feat/patient-claim-history
   ```
3. Open a Pull Request against the `main` branch.
4. Fill out the PR template completely, providing context, testing evidence, and screenshots if modifying UI components.
5. Address any feedback from code review before merging.

---

## 🛡 Security & Vulnerability Reporting

If you discover a security vulnerability within ClaimFlow, please do NOT open a public GitHub issue. Send an email directly to security@claimflow.health so it can be resolved promptly.
