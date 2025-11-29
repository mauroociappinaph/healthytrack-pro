---
description: Automates the process of committing changes, pushing the feature branch, merging into develop, and cleaning up.
---

1. Check the git status to see what files are changed.
   `git status`

2. Add all changes to the staging area.
   `git add .`

3. Commit the changes. **CRITICAL**: You must ask the user for a commit message if they haven't provided one. If they have, use it.
   `git commit -m "<COMMIT_MESSAGE>"`

4. Push the current feature branch to origin.
   `git push origin <CURRENT_BRANCH>`

5. Checkout the develop branch.
   `git checkout develop`

6. Pull the latest changes from origin develop to ensure it's up to date.
   // turbo
   `git pull origin develop`

7. Merge the feature branch into develop.
   `git merge <CURRENT_BRANCH>`

8. Push the updated develop branch to origin.
   `git push origin develop`

9. Delete the local feature branch to keep the workspace clean.
   `git branch -d <CURRENT_BRANCH>`
