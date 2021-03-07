const {MainWindow} = require("./src/MainWindow");
const {FtpConnection} = require("./src/FtpConnection");
const {app, ipcMain, dialog} = require('electron');


let win;
let ftp;

app.on('ready', () => {
    win = new MainWindow({
        width: 700,
        height: 600,
        icon: __dirname + "/public/img/icon.png",
        slashes: true,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegrationInWorker: true,
            nodeIntegration: true
        }
    });
    ftp = new FtpConnection(win);
});

ipcMain.on('ftp:login', (e,address,port,username,password)=>{
    ftp.login(address,port,username,password);
});

app.on('window-all-closed', () => {
    app.quit();
});
