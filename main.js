const { app, ipcMain, BrowserWindow } = require("electron");
const { incurring, reportIncurring } = require('./src/backend/process/Kenjo');
var propertiesReader = require('properties-reader');
var rootPath = require('electron-root-path').rootPath + (process.platform == "linux" ? "/auto-kenjo" : "");

let appWin;
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

    appWin.webContents.openDevTools();

    appWin.on("closed", () => {
        appWin = null;
    });
}

ipcMain.on("button_click", async (event, arg) => {
    //override console.log
    console.log = function (message) {
        event.reply("log", message);
    }
    //override console.info
    console.info = function (message) {
        event.reply("info", `[INFO] ${message}`);
    }
    //override console.warn
    console.warn = function (message) {
        event.reply("warn", message);
    }
    //override console.error
    console.error = function (message) {
        event.reply("error", `[ERROR] ${message}`);
    }

    try {
        //Proces button click event
        console.info("Connecting to Kenjo")
        switch (arg[0]) {
            case "incur":
                await incurring(arg[1], arg[2]);
                break;
            case "report":
                await reportIncurring(arg[1], arg[2]);
                break;
        }
    }
    catch (e) {
        console.error(e.message);
    }
});

ipcMain.on("get_credentials", async (event, arg) => {    //override console.log
    console.log = function (message) {
        event.reply("log", message);
    }
    //override console.info
    console.info = function (message) {
        event.reply("info", message);
    }
    //override console.warn
    console.warn = function (message) {
        event.reply("warn", message);
    }
    //override console.error
    console.error = function (message) {
        event.reply("error", message);
    }

    var properties = propertiesReader(`${rootPath}/kenjo.properties`);
    event.reply("get_credentials", [properties.get("USERNAME"), properties.get("PASSWORD")])
});

ipcMain.on("launch_game", async (event, arg) => {
    var game = arg;
    console.log(`Launch game ${game.name} with emulator ${game.emulator}`);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});