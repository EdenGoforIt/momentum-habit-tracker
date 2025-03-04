# Branching Strategy

## Overview
This document outlines the **branching strategy** for the Momentum project, ensuring a structured workflow for development, testing, and deployment.

## Branch Structure

### 1. **Main Branches**
- **`main`**: The stable production branch. Only tested and approved code is merged here.
- **`develop`**: The integration branch where features are merged before going into production.

### 2. **Supporting Branches**
- **Feature Branches (`feature/{feature-name}`)**
    - Used for developing new features.
    - Branches from `develop`.
    - Merges back into `develop` when complete.

- **Bugfix Branches (`bugfix/{issue-name}`)**
    - Used to fix bugs found during development.
    - Branches from `develop`.
    - Merges back into `develop`.

- **Release Branches (`release/{version}`)**
    - Created when preparing a new release.
    - Branches from `develop`.
    - Merges into `main` and `develop` after release.

- **Hotfix Branches (`hotfix/{issue-name}`)**
    - Used for critical fixes in production.
    - Branches from `main`.
    - Merges back into `main` and `develop`.

## Workflow
1. **Feature Development**
    - Create a feature branch: `git checkout -b feature/login-system develop`
    - Work on changes and commit.
    - Merge into `develop` via a Pull Request.

2. **Bug Fixes**
    - Create a bugfix branch: `git checkout -b bugfix/fix-auth develop`
    - Apply the fix and commit.
    - Merge back into `develop`.

3. **Release Process**
    - Create a release branch: `git checkout -b release/v1.0 develop`
    - Perform testing and final tweaks.
    - Merge into `main` and tag the release: `git tag v1.0`

4. **Hotfixes for Production**
    - Create a hotfix branch: `git checkout -b hotfix/critical-fix main`
    - Fix the issue and merge into `main`.
    - Merge back into `develop` to keep changes synced.

## Example Flow
```
* main
  |-- hotfix/fix-payment -> main -> develop
  |-- release/v1.0 -> main -> develop
  |-- develop
      |-- feature/user-auth -> develop
      |-- bugfix/ui-bug -> develop
```

## Best Practices
✔ Always create branches from the correct base branch.
✔ Use **meaningful branch names**.
✔ Create **small, focused** pull requests.
✔ Keep `develop` updated before starting new work.
✔ Delete feature/bugfix branches after merging.

## Conclusion
This strategy ensures a **structured, scalable, and efficient** development workflow. 🚀

