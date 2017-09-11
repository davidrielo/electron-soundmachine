'use strict';

const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc, globalShortcut } = electron;
const reload = require('electron-reload');
const isDev = require('electron-is-dev');

const path = require('path');

var configuration = require('./configuration');

let mainWindow = null;
let settingsWindow = null;

if(isDev) {
    const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
    reload(__dirname, {electron: electronPath});
}

app.on('ready', function() {
    if(!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    mainWindow = new BrowserWindow({
        frame: false,
        resizable: false,
        height: 700,
        width: 368,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');

    setGlobalShortcuts();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function() {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function() {
        mainWindow.webContents.send('global-shortcut', 1);
    });
}

ipc.on('close-main-window', () => {
    app.quit();
});

ipc.on('open-settings-window', () => {
    if(settingsWindow) return;

    settingsWindow = new BrowserWindow({
        frame: false,
        resizable: false,
        height: 200,
        width: 200
    });

    settingsWindow.loadURL(`file://${__dirname}/app/settings.html`);

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
});

ipc.on('close-settings-window', () => {
    if(settingsWindow) {
        settingsWindow.close();
    }
});

ipc.on('set-global-shortcuts', () => {
    setGlobalShortcuts();
});
