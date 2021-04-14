const { autoUpdater } = require('electron-updater');
const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  // mainWindow.once('ready-to-show', () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
}

app.on('ready', () => {
  createWindow();
  process.env.GH_TOKEN = "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";
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});