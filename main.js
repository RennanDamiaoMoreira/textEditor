const {
    app,
    BrowserWindow,
    Menu,
    dialog,
    ipcMain
} = require('electron');

const fs = require('fs');



const path = require('path')
var win;

const templateMenu = [{
    'label': "Arquivo",
    'submenu': [{
            'label': 'novo',
            click() {
                createNewFile()
            }
        }, {
            'label': 'abrir'
        }, {
            'label': 'salvar',
            click() {
                if (file.saved)
                    saveFile()
                else
                    saveFileAs()
            }
        }, {
            'label': 'salvar como',
            click() {
                saveFileAs()
            }
        }

    ]
}, {
    'label': "Editar"
}];

const menu = Menu.buildFromTemplate(templateMenu)
Menu.setApplicationMenu(menu)


async function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {

            nodeIntegration: true,
            contextIsolation: false

        }
    })

    await win.loadFile('index.html');

    win.webContents.openDevTools()

    createNewFile()
    ipcMain.on('update-content', function(event, data) {
        file.content = data;
    })
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();

        }
    })
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//ACTIVATE
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
})




var file = {
    'nome': "Novo_Arquivo",
    'content': '',
    'saved': false,
    'path': app.getPath('documents') + "Novo_Arquivo.txt"
};

function createNewFile() {
    file = {
        'nome': "Novo_Arquivo",
        'content': '',
        'saved': false,
        'path': app.getPath('documents') + "Novo_Arquivo.txt"
    };
    win.webContents.send('set-File', file);

}


async function saveFileAs() {
    let dialogFile = await dialog.showSaveDialog(win, {
        defaultPath: file.path
    });
    if (dialogFile.canceled) return;

    writeFile(dialogFile.filePath)


}

function saveFile() {

    writeFile(file.path)


}

function writeFile(filePath) {
    try {
        console.log(filePath)
        fs.writeFile(filePath, file.content, function(error) {
            if (error) throw error

            file.path = filePath;
            file.saved = true;
            file.nome = path.basename(filePath)
            console.log("chegou ate aqui nome " + file.nome)
            win.webContents.send('set-File', file);
        })
    } catch (err) {
        console.log(err.toString())
    }
}