# Contributing to HealthyTrack Pro

## Git Workflow & Best Practices

To ensure a stable and organized codebase, all contributors (human and AI) must follow these rules:

### 1. Branching Strategy
- **`main`**: Production-ready code. **Protected.** No direct commits.
- **`develop`**: Integration branch. **Protected.** No direct commits. All features merge here via PR.
- **`feature/*`**: Working branches. All development happens here.

### 2. Workflow for New Tasks
1.  **Start from `develop`**:
    ```bash
    git checkout develop
    git pull origin develop
    ```
2.  **Create a Feature Branch** (MANDATORY):
    Use the naming convention `feature/task-name` or `fix/issue-name`.
    ```bash
    git checkout -b feature/my-new-feature
    ```
3.  **Commit Changes**:
    - Make small, atomic commits.
    - Use descriptive commit messages.
    ```bash
    git add .
    git commit -m "feat: add new activity tracking component"
    ```
4.  **Merge Back**:
    - Push your branch: `git push origin feature/my-new-feature`
    - Create a Pull Request (PR) to merge into `develop`.
    - OR (if working locally/solo): Merge into `develop` locally.
    ```bash
    git checkout develop
    git merge feature/my-new-feature
    git push origin develop
    ```

### 3. Code Style
- Follow the existing project structure (NestJS backend, React+Vite frontend).
- Ensure all tests pass before merging.
- Run linting if available.
