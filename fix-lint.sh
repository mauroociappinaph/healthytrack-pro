#!/bin/bash
# Script to fix all lint errors systematically

cd "$(dirname "$0")/frontend"

# Fix 1: Remove unused testUsers import
sed -i '' '/import { testUsers } from/d' e2e/auth.spec.ts

# Fix 2-3: Remove unused error variables in profile forms
sed -i '' 's/} catch (error) {/} catch {/g' src/components/profile/ChangePasswordForm.tsx
sed -i '' 's/} catch (error) {/} catch {/g' src/components/profile/ProfileForm.tsx

# Fix 4: Remove unused AnimatePresence import
sed -i '' 's/import { motion, AnimatePresence } from/import { motion } from/g' src/components/ui/Toast.tsx

# Fix 5: Remove unused 'e' variable in Reports
sed -i '' 's/} catch (e) {/} catch {/g' src/pages/Reports.tsx

# Fix 6-7: Remove unnecessary try-catch in authStore and unused 'e'
# This requires manual editing - will do separately

echo "Basic fixes applied. Running lint to check remaining errors..."
npm run lint
