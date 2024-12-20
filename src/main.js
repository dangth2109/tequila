const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(() => {
    createWindow();
    
    // Kiểm tra update khi khởi động
    autoUpdater.checkForUpdatesAndNotify();
});

// Xử lý các sự kiện update
autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-message', 'Checking for updates...');
});

autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update-message', 'Update available. Downloading...');
});

autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update-message', 'Your app is up to date.');
});

autoUpdater.on('download-progress', (progressObj) => {
    let message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
    mainWindow.webContents.send('update-message', message);
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-message', 'Update downloaded. Will install now...');
    autoUpdater.quitAndInstall();
});

// Lắng nghe sự kiện kiểm tra update từ renderer
ipcMain.on('check-updates', () => {
    autoUpdater.checkForUpdates();
});

// Xử lý đóng ứng dụng
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});