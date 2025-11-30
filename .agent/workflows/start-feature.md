---
description: Automates the process of starting a new feature branch from the latest develop.
---

1. Checkout the develop branch.
   `git checkout develop`

2. Pull the latest changes from origin develop to ensure it's up to date.
   // turbo
   `git pull origin develop`

3. Create and checkout a new feature branch. **CRITICAL**: You must ask the user for the branch name (e.g., feature/my-new-feature) if they haven't provided one.
   `git checkout -b <BRANCH_NAME>`
