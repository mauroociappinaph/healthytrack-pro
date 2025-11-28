import { test, expect } from '@playwright/test';
import { register } from './helpers/auth';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Registrar y hacer login antes de cada test
    const timestamp = Date.now();
    await register(page, 'Dashboard User', `dashboard${timestamp}@test.com`, 'Test123456!');
  });

  test('should display dashboard metrics', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que las tarjetas de métricas están visibles
    await expect(page.locator('[data-testid="metrics-active-minutes"]')).toBeVisible();
    await expect(page.locator('[data-testid="metrics-calories"]')).toBeVisible();
    await expect(page.locator('[data-testid="metrics-goal-progress"]')).toBeVisible();
  });

  test('should navigate to activity hub', async ({ page }) => {
    await page.goto('/dashboard');

    // Hacer clic en el enlace de actividad
    await page.click('[data-testid="nav-activity-hub"]');

    // Verificar que navegamos a activity-hub
    await expect(page).toHaveURL('/activity-hub');
  });

  test('should navigate to reports', async ({ page }) => {
    await page.goto('/dashboard');

    // Hacer clic en el enlace de reportes
    await page.click('[data-testid="nav-reports"]');

    // Verificar que navegamos a reports
    await expect(page).toHaveURL('/reports');
  });

  test('should navigate to calendar', async ({ page }) => {
    await page.goto('/dashboard');

    // Hacer clic en el enlace de calendario
    await page.click('[data-testid="nav-calendar"]');

    // Verificar que navegamos a calendar
    await expect(page).toHaveURL('/calendar');
  });

  test('should display user name in topbar', async ({ page }) => {
    await page.goto('/dashboard');

    // Verificar que el nombre del usuario aparece en el botón del menú (solo muestra la inicial)
    await expect(page.locator('[data-testid="user-menu-button"]')).toContainText('D');
  });
});
