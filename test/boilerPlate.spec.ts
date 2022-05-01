/* eslint-disable jest/valid-describe-callback */
import { ElectronApplication, Page, _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

test.describe('Check Man Page', async () => {
  let electronApp: ElectronApplication;
  let firstWindow: Page;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['http://localhost:1212/'] });
    firstWindow = await electronApp.firstWindow();
  });

  test('Check if main app window is open',async () => {
    const windowState: {
        isVisible: boolean;
        isDevToolsOpened: boolean;
        isCrashed: boolean;
      } = await electronApp.evaluate(async ({ BrowserWindow }) => {
        const mainWindow = BrowserWindow.getAllWindows()[0];
    
        const getState = () => ({
          isVisible: mainWindow.isVisible(),
          isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
          isCrashed: mainWindow.webContents.isCrashed(),
        });
    
        return new Promise((resolve) => {
          if (mainWindow.isVisible()) {
            resolve(getState());
          } else {
            mainWindow.once("ready-to-show", () =>
              setTimeout(() => resolve(getState()), 0)
            );
          }
        });
      });
    
      expect(windowState.isVisible).toBeTruthy();
      
  })

  test('Check title', async () => {
    const title = await firstWindow.title();
    expect(title).toBe('Hello Electron React!');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });
});

