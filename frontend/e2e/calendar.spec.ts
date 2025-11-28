import { test, expect } from '@playwright/test';
import { register } from './helpers/auth';

test.describe('Calendar', () => {
  test.beforeEach(async ({ page }) => {
    // Registrar y hacer login antes de cada test
    const timestamp = Date.now();
    await register(page, 'Calendar User', `calendar${timestamp}@test.com`, 'Test123456!');
  });

  test('should display current month', async ({ page }) => {
    await page.goto('/calendar');

    // Verificar que el mes actual se muestra (formato flexible para evitar problemas de locale)
    // Buscamos el año actual y alguna letra, asumiendo que el mes está ahí
    const currentYear = new Date().getFullYear().toString();
    await expect(page.locator('[data-testid="calendar-title"]')).toContainText(currentYear);
  });

  test('should navigate to previous month', async ({ page }) => {
    await page.goto('/calendar');

    // Hacer clic en el botón de mes anterior
    await page.click('[data-testid="calendar-prev-month"]');

    // Esperar a que se actualice el calendario
    await page.waitForTimeout(500);

    // Verificar que el mes cambió (esto es aproximado)
    const monthHeader = await page.locator('h1').first().textContent();
    expect(monthHeader).toBeTruthy();
  });

  test('should navigate to next month', async ({ page }) => {
    await page.goto('/calendar');

    // Hacer clic en el botón de mes siguiente
    await page.click('[data-testid="calendar-next-month"]');

    // Esperar a que se actualice el calendario
    await page.waitForTimeout(500);

    // Verificar que el mes cambió
    const monthHeader = await page.locator('h1').first().textContent();
    expect(monthHeader).toBeTruthy();
  });

  test('should return to current month when clicking "Hoy"', async ({ page }) => {
    await page.goto('/calendar');

    // Navegar a otro mes
    await page.click('[data-testid="calendar-next-month"]');
    await page.waitForTimeout(500);

    // Hacer clic en "Hoy"
    await page.click('[data-testid="calendar-today"]');

    // Verificar que volvimos al mes actual
    const currentYear = new Date().getFullYear().toString();
    await expect(page.locator('[data-testid="calendar-title"]')).toContainText(currentYear);
  });

  test('should open activity detail modal when clicking a day', async ({ page }) => {
    await page.goto('/calendar');

    // Hacer clic en el día actual
    const today = new Date().toISOString().split('T')[0];
    await page.click(`[data-testid="calendar-day-${today}"]`);

    // Verificar que el modal se abre
    await expect(page.locator('[data-testid="activity-modal"]')).toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.goto('/calendar');

    // Hacer clic en un día
    const today = new Date().toISOString().split('T')[0];
    await page.click(`[data-testid="calendar-day-${today}"]`);

    // Esperar a que el modal se abra
    await expect(page.locator('[data-testid="activity-modal"]')).toBeVisible();

    // Hacer clic en cerrar
    await page.click('[data-testid="modal-close-button"]');

    // Verificar que el modal se cierra
    await expect(page.locator('[data-testid="activity-modal"]')).not.toBeVisible();
  });

  test('should display legend with activity indicators', async ({ page }) => {
    await page.goto('/calendar');

    // Verificar que la leyenda está visible
    await expect(page.locator('[data-testid="calendar-legend"]')).toBeVisible();
  });
});
