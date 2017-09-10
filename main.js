'use strict';

const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc } = electron;
const reload = require('electron-reload');
const isDev = require('electron-is-dev');

const path = require('path');

let mainWindow = null;

if(isDev) {
    const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
    reload(__dirname, {electron: electronPath});
}

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        resizable: false,
        height: 700,
        width: 368,
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});

ipc.on('close-main-window', () => {
    app.quit();
});
