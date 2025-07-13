const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      media: true,
    }
  })

  win.loadFile('index.html')
}

app.on('ready', () => {
  createWindow();

  // Tambahkan handler izin kamera di sini
  app.on('web-contents-created', (_, contents) => {
    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'media') {
        callback(true); // izinkan kamera
      } else {
        callback(false); // tolak izin lain
      }
    });
  });
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})