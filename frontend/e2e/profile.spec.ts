import { test, expect } from '@playwright/test';
import { register } from './helpers/auth';

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Registrar y hacer login antes de cada test
    const timestamp = Date.now();
    await register(page, 'Profile User', `profile${timestamp}@test.com`, 'Test123456!');
  });

  test('should display user profile information', async ({ page }) => {
    await page.goto('/profile');

    // Verificar que la información del perfil está visible
    await expect(page.locator('[data-testid="profile-header"]')).toBeVisible();
    await expect(page.locator('[data-testid="profile-name"]')).toHaveText('Profile User');
    await expect(page.locator('[data-testid="profile-email"]')).toContainText('profile');
  });

  test('should update profile bio', async ({ page }) => {
    await page.goto('/profile');

    const newBio = 'Entusiasta del fitness y la vida saludable';

    // Llenar el campo de biografía
    await page.fill('[data-testid="profile-bio-input"]', newBio);

    // Hacer clic en guardar
    await page.click('[data-testid="profile-save-button"]');

    // Verificar mensaje de éxito
    await expect(page.locator('[data-testid="profile-success-message"]')).toBeVisible({ timeout: 5000 });

    // Verificar que la bio se actualizó en el header
    await expect(page.locator('[data-testid="profile-bio-display"]')).toHaveText(newBio);
  });

  test('should update profile name', async ({ page }) => {
    await page.goto('/profile');

    const newName = 'Updated Profile User';

    // Actualizar el nombre
    await page.fill('[data-testid="profile-name-input"]', newName);

    // Hacer clic en guardar
    await page.click('[data-testid="profile-save-button"]');

    // Verificar mensaje de éxito
    await expect(page.locator('[data-testid="profile-success-message"]')).toBeVisible({ timeout: 5000 });

    // Verificar que el nombre se actualizó en la UI
    await expect(page.locator('[data-testid="profile-name"]')).toHaveText(newName);
  });

  test('should show error when changing password with wrong current password', async ({ page }) => {
    await page.goto('/profile');

    // Intentar cambiar la contraseña con una contraseña actual incorrecta
    await page.fill('[data-testid="password-current-input"]', 'WrongPassword123!');
    await page.fill('[data-testid="password-new-input"]', 'NewPassword123!');
    await page.fill('[data-testid="password-confirm-input"]', 'NewPassword123!');

    // Hacer clic en cambiar contraseña
    await page.click('[data-testid="password-change-button"]');

    // Esperar a que se procese la solicitud
    await page.waitForTimeout(1000);

    // Verificar mensaje de error
    await expect(page.locator('[data-testid="password-error-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('should show error when new passwords do not match', async ({ page }) => {
    await page.goto('/profile');

    // Intentar cambiar la contraseña con contraseñas que no coinciden
    await page.fill('[data-testid="password-current-input"]', 'Test123456!');
    await page.fill('[data-testid="password-new-input"]', 'NewPassword123!');
    await page.fill('[data-testid="password-confirm-input"]', 'DifferentPassword123!');

    // Hacer clic en cambiar contraseña
    await page.click('[data-testid="password-change-button"]');

    // Esperar a que se procese la solicitud
    await page.waitForTimeout(500);

    // Verificar mensaje de error
    await expect(page.locator('[data-testid="password-error-message"]')).toBeVisible({ timeout: 10000 });
  });
});
