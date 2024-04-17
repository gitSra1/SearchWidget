const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path'); 

let widgetVisible = false;

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 50, 
    alwaysOnTop: true,
    frame: false, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js') 
    }
  });

  win.loadFile('index.html');
  win.hide(); 

  globalShortcut.register('Control+Space', () => {
    widgetVisible = !widgetVisible;
    if (widgetVisible) {
      const { screen } = require('electron');
      const display = screen.getPrimaryDisplay();
      const x = display.bounds.width - win.getBounds().width;
      const y = 240; 
      win.setPosition(x, y);
      win.show();
    } else {
      win.hide();
    }
  });

  ipcMain.on('resize-window', (event, targetHeight) => {
    const win = BrowserWindow.getFocusedWindow(); 
    win.setSize(400, targetHeight);
  });
}

app.whenReady().then(() => { 
    createWindow();
});
