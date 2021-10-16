const { ipcRenderer } = require('electron');
const title = document.getElementById('title');
const text = document.getElementById('text')

ipcRenderer.on('set-File', function(event, data) {
    text.value = data.content;
    title.innerHTML = data.nome;
    console.log(data)
})

text.addEventListener("keyup", handleChangeText);

function handleChangeText() {

    ipcRenderer.send('update-content', text.value)
}