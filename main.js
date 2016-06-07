const electron = require("electron"),
      app = electron.app,
      BrowserWindow = electron.BrowserWindow;

let mainWindow;


function createWindow () {
  mainWindow = new BrowserWindow({
                                  useContentSize:false,
                                  skipTaskbar:true,  
                                  kiosk: false, 
                                  icon:__dirname+'/PlexusMain/public/images/favicons/favicon-194x194.png',
                                  title:'Plexus! Create, Read and Compose',
                                  webPreferences: {nodeIntegration: true},
                                  width: 1000,
                                  height: 800});
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  
  //Webtools for electron, is not used by express
  //mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  })
}

app.on("ready", createWindow);
app.on("browser-window-created",function(e,window) {
  window.setMenu(null);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});