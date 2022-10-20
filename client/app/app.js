const { app, BrowserWindow } = require('electron')

function createWindow () {
	let mainWindow = new BrowserWindow({
		width: 500,
		height: 640,
		icon:'app/icon.png',
	  });
	mainWindow.loadFile('./app/Login.html');
	mainWindow.setResizable(false);
}
app.whenReady().then(createWindow);