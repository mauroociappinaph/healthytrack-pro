import { Page } from '@playwright/test';

/**
 * Helper para registrar un nuevo usuario
 */
export async function register(page: Page, name: string, email: string, password: string) {
  await page.goto('/register');
  await page.fill('[data-testid="register-name-input"]', name);
  await page.fill('[data-testid="register-email-input"]', email);
  await page.fill('[data-testid="register-password-input"]', password);
  await page.waitForTimeout(500);
  await page.click('[data-testid="register-submit-button"]');

  // Verificar si hay error
  const errorLocator = page.locator('[data-testid="register-error"]');
  if (await errorLocator.isVisible()) {
    const errorText = await errorLocator.textContent();
    throw new Error(`Registration failed: ${errorText}`);
  }

  // Esperar a que la navegación complete
  await page.waitForURL('/dashboard', { timeout: 60000 });
}

/**
 * Helper para hacer login
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[data-testid="login-email-input"]', email);
  await page.fill('[data-testid="login-password-input"]', password);
  await page.waitForTimeout(500);
  await page.click('[data-testid="login-submit-button"]');

  // Esperar a que la navegación complete
  await page.waitForURL('/dashboard', { timeout: 60000 });
}

/**
 * Helper para hacer logout
 */
export async function logout(page: Page) {
  // Hacer clic en el menú de usuario y luego en logout
  await page.click('[data-testid="user-menu-button"]');
  await page.click('[data-testid="logout-button"]');

  // Esperar a que la navegación complete
  await page.waitForURL('/login');
}

/**
 * Helper para crear una actividad de caminata
 */
export async function createWalk(page: Page, duration: number, intensity: string) {
  await page.goto('/walks');
  await page.fill('input[name="duration"]', duration.toString());
  await page.selectOption('select[name="intensity"]', intensity);
  await page.click('button[type="submit"]');

  // Esperar confirmación
  await page.waitForSelector('text=Actividad creada exitosamente', { timeout: 5000 });
}

/**
 * Helper para crear una sesión de gimnasio
 */
export async function createGymSession(page: Page, name: string, duration: number) {
  await page.goto('/gym');
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="duration"]', duration.toString());
  await page.click('button[type="submit"]');

  // Esperar confirmación
  await page.waitForSelector('text=Sesión creada exitosamente', { timeout: 5000 });
}
