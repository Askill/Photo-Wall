const electron = require('electron');
const path = require('path');
const {app, BrowserWindow, Menu, dialog} = electron;

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

process.env.NODE_ENV = 'production'

const { autoUpdater } = require("electron-updater");

const server = 'http://update.jpmatz.de'
const feed = `${server}/update/win/latest`
let update = true;
autoUpdater.setFeedURL(feed)

const ipcMain = electron.ipcMain

setInterval(() => {
    autoUpdater.checkForUpdates()
   }, 60000)

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";

autoUpdater.on('update-downloaded', () => {
    if(update){
        dialog.showMessageBox({
            type: 'info',
            title: 'Found Updates',
            message: 'Found updates, do you want to update now?',
            buttons: ['Sure', 'Nope']
          }, (buttonIndex) => {
            if (buttonIndex === 0) {
              const isSilent = true;
              const isForceRunAfter = true; 
              autoUpdater.quitAndInstall(isSilent, isForceRunAfter); 
            } 
            else {
              update = false;
              
            }
          })
    }
})

autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
})


let mainWindow;
// when app is ready
app.on('ready', function(){
    autoUpdater.checkForUpdates()
    var dns = require('dns');
 
    dns.resolve4('query.jpmatz.de', function (err, addresses) {
      if (err) app.quit();
    });

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
        webPreferences: {
            nodeIntegration: true,
            //preload: path.join(__dirname, 'preload.js')
        }
	})

    // load html
    mainWindow.loadFile(path.join(__dirname, 'mainWindow.html'));
    mainWindow.maximize();

    
    //mainWindow.webContents.openDevTools();
    //mainWindow.show();
    // close all windows
    mainWindow.on('closed', function(){
        app.quit();
    });

    
    // build Menue from Template
    const mainMenu = Menu.buildFromTemplate(mainMenueTemplate);
    // insert menu
    Menu.setApplicationMenu(mainMenu);

});

// create menue template

const mainMenueTemplate = [
    {
        label: 'File', 
        submenu:[{
            label: 'save',
            accelerator: process.platform== 'darwin' ? 'Command+S' : 'Ctrl+S', 
            click(){
                let path = dialog.showSaveDialog({
                    filters: [
                        { name: 'png', extensions: ['png'] }
                    ]
                });
                mainWindow.webContents.send('saveCanvas', path);
                
            }
        },
        {
            label: 'Quit',
            accelerator: process.platform== 'darwin' ? 'Command+Q' : 'Ctrl+Q', 
            click(){
                app.quit();
            }
        }
            
        ]
    },
    {
        label: 'Scale', 
        submenu:[{
            label: 'set scale',
            click(){
                mainWindow.webContents.send('setScale');
            }
        }            
        ]
    }
];

// if mac add empty object to menue

if(process.platform == 'darwin'){
    mainMenueTemplate.unshift({});
}

// add dev tools if debug

if(process.env.node_env != 'production'){
    mainMenueTemplate.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'toogle',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}