import { test, expect } from '@playwright/test';
import { register, login, logout } from './helpers/auth';
import { testUsers } from './fixtures/data';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Limpiar localStorage antes de cada test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should register a new user successfully', async ({ page }) => {
    const timestamp = Date.now();
    const newUser = {
      name: 'New Test User',
      email: `test${timestamp}@healthytrack.com`,
      password: 'Test123456!',
    };

    await register(page, newUser.name, newUser.email, newUser.password);

    // Verificar que estamos en el dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verificar que el nombre del usuario aparece en la UI (el botón muestra solo la inicial)
    await expect(page.locator('[data-testid="user-menu-button"]')).toContainText('N');
  });

  test('should login with valid credentials', async ({ page }) => {
    // Primero registrar un usuario
    const timestamp = Date.now();
    const user = {
      name: 'Login Test User',
      email: `login${timestamp}@healthytrack.com`,
      password: 'Test123456!',
    };

    await register(page, user.name, user.email, user.password);

    // Hacer logout
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Intentar login
    await login(page, user.email, user.password);

    // Verificar que estamos en el dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="login-email-input"]', 'invalid@test.com');
    await page.fill('[data-testid="login-password-input"]', 'wrongpassword');
    // Hacer clic en login
    await page.click('[data-testid="login-submit-button"]');

    // Esperar a que se procese la solicitud
    await page.waitForTimeout(1000);

    // Verificar que aparece un mensaje de error
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible({ timeout: 10000 });
  });

  test('should persist session after page reload', async ({ page }) => {
    const timestamp = Date.now();
    const user = {
      name: 'Session Test User',
      email: `session${timestamp}@healthytrack.com`,
      password: 'Test123456!',
    };

    await register(page, user.name, user.email, user.password);

    // Recargar la página
    await page.reload();

    // Verificar que seguimos autenticados
    await expect(page).toHaveURL('/dashboard');
  });

  test('should logout successfully', async ({ page }) => {
    const timestamp = Date.now();
    const user = {
      name: 'Logout Test User',
      email: `logout${timestamp}@healthytrack.com`,
      password: 'Test123456!',
    };

    await register(page, user.name, user.email, user.password);

    // Hacer logout usando el helper
    await logout(page);

    // Verificar que fuimos redirigidos al login
    await expect(page).toHaveURL('/login');
  });
});
