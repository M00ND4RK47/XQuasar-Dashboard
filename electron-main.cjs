const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const http = require('http');

let mainWindow;

function checkServerReady(url, attempts = 0) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 304) {
        resolve(true);
      } else {
        setTimeout(() => resolve(checkServerReady(url, attempts + 1)), 200);
      }
    });

    req.on('error', () => {
      if (attempts > 60) {
        // Stop checking after 12 seconds
        resolve(false);
      } else {
        setTimeout(() => resolve(checkServerReady(url, attempts + 1)), 200);
      }
    });
  });
}

async function startLocalServer() {
  // Set production environment for server
  process.env.NODE_ENV = 'production';
  process.env.PORT = '3000';

  try {
    // Require the compiled CommonJS server bundle
    const serverPath = path.join(__dirname, 'dist', 'server.cjs');
    require(serverPath);
  } catch (err) {
    console.error('Failed to start local Express server:', err);
  }
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    title: 'XQuasar Dashboard - Bot & Moderasyon Yönetimi',
    backgroundColor: '#0f172a', // Dark slate background
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Open external links in default browser instead of electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  const serverUrl = 'http://localhost:3000';
  const isReady = await checkServerReady(serverUrl);

  if (isReady) {
    mainWindow.loadURL(serverUrl);
  } else {
    // Fallback load
    mainWindow.loadURL(serverUrl);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startLocalServer();
  await createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
