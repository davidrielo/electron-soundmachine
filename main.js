'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;

var path = require('path');
var reload = require('electron-reload');
var isDev = require('electron-is-dev');

if(isDev) {
    const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');
    reload(__dirname, {electron: electronPath});
}

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});
