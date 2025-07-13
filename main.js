const { app, BrowserWindow } = require('electron')
//const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
//      contextIsolation: true,
//      nodeIntegration: false,
//      sandbox: false,
//      media: true,
//        preload: path.join(__dirname, 'preload.js'), // jika pakai preload
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: true,
        enableRemoteModule: false,
        sandbox: false // ← ini penting!
    }
  })

  win.webContents.openDevTools();

  win.loadFile('index.html')
}

app.on('ready', () => {
  createWindow();

  // Tambahkan handler izin kamera di sini
//  app.on('web-contents-created', (_, contents) => {
//    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
//      if (permission === 'media') {
//        callback(true); // izinkan kamera
//      } else {
//        callback(false); // tolak izin lain
//      }
//    });
//  });

  app.on('web-contents-created', (event, contents) => {
    contents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      if (permission === 'media') {
        console.log('🔐 Permission media diminta');
        callback(true);
      } else {
        callback(false);
      }
    });
  });
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})