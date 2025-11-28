import { test, expect } from '@playwright/test';
import { register } from './helpers/auth';

test.describe('Reports', () => {
  test.beforeEach(async ({ page }) => {
    // Registrar y hacer login antes de cada test
    const timestamp = Date.now();
    await register(page, 'Reports User', `reports${timestamp}@test.com`, 'Test123456!');
  });

  test('should display weekly report', async ({ page }) => {
    await page.goto('/reports');

    // Verificar que los elementos del reporte están visibles
    await expect(page.locator('h1:has-text("Reportes")')).toBeVisible();
    await expect(page.locator('[data-testid="week-navigator"]')).toBeVisible();
  });

  test('should navigate to previous week', async ({ page }) => {
    await page.goto('/reports');

    // Hacer clic en el botón de semana anterior
    await page.click('[data-testid="week-nav-prev"]');

    // Esperar a que se actualice
    await page.waitForTimeout(1000);

    // Verificar que la página sigue cargada
    await expect(page).toHaveURL('/reports');
  });

  test('should navigate to next week', async ({ page }) => {
    await page.goto('/reports');

    // Hacer clic en el botón de semana siguiente
    await page.click('[data-testid="week-nav-next"]');

    // Esperar a que se actualice
    await page.waitForTimeout(1000);

    // Verificar que la página sigue cargada
    await expect(page).toHaveURL('/reports');
  });

  test('should display charts', async ({ page }) => {
    await page.goto('/reports');

    // Verificar que hay gráficos visibles usando los test-ids
    await expect(page.locator('[data-testid="chart-activity-breakdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-sleep-stress"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-heart-health"]')).toBeVisible();
    await expect(page.locator('[data-testid="chart-calories"]')).toBeVisible();
  });

  test('should have export button disabled when no data', async ({ page }) => {
    await page.goto('/reports');

    // Verificar que el botón de exportar está visible pero deshabilitado para un usuario nuevo
    const exportButton = page.locator('[data-testid="export-csv-button"]');
    await expect(exportButton).toBeVisible();
    await expect(exportButton).toBeDisabled();
  });
});
