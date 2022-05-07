const { app, ipcMain, BrowserWindow } = require("electron");
const { launchGame } = require("./src/backend/gameLauncher"); 
const electronLocalshortcut = require('electron-localshortcut');

const keys = ["A", "S", "D", "Q", "W", "Enter", "R"]

let appWin;
var mode = "main";

createWindow = async () => {
    icons = {
        "darwin": "darwin/icon.icns",
        "win32": "win32/icon.ico",
        "linux": "linux/icon.png"
    }
    //Create app window
    appWin = new BrowserWindow({
        width: 1920,
        height: 1080,
        title: "Cross Game",
        icon: `${__dirname}src/assets/icons/${icons[process.platform]}`,
        resizable: false,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    //Load main html
    appWin.loadURL(`file://${__dirname}/release/index.html`);
    //Disable menu
    appWin.setMenu(null);

    //appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

function onKeyPress(event, key){
    console.log(`send_keys_${mode}`)
    event.reply(`send_keys_${mode}`, key);
    console.log(key);
}

ipcMain.on("initialized", async (event, arg) => {
    for (i in keys){
        const key = keys[i]
        electronLocalshortcut.register(appWin, key, () => onKeyPress(event, key));
    }

});
ipcMain.on("launch_game", async (event, arg) => launchGame(arg));
ipcMain.on("change_mode", async (event, arg) => mode = arg);

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-input-event", (event, input) => {
    console.log(input);
});