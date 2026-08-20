import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
const backendURL = process.env.BACKEND_URL || 'http://127.0.0.1:3000';

export default defineConfig({
  testDir: './tests/smoke',
  fullyParallel: false,
  retries: 0,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [['html', { open: "never" }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1440, height: 1024 },
    headless: false,
  },
  projects: [
    {
      name: 'smoke',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'node ..\\testing\\scripts\\seed-backend-data.mjs && npm run start',
      cwd: backendDir,
      url: `${backendURL}/health`,
      reuseExistingServer: false,
      timeout: 180_000,
    },
    {
      command: 'npm run dev',
      cwd: frontendDir,
      url: baseURL,
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
