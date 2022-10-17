const { app, BrowserWindow } = require('electron')
function createWindow () {
	let mainWindow = new BrowserWindow({
		width: 550,
		height: 650,
		icon:'app/icon.png',
		webPreferences: {
		  nodeIntegration: true
		}
	  });
	mainWindow.loadFile('./app/login.html');
	mainWindow.setMenuBarVisibility(true);
	mainWindow.setResizable(false);
}
app.whenReady().then(createWindow);