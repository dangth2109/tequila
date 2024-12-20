const { ipcRenderer } = require('electron');

// Cập nhật trạng thái update
ipcRenderer.on('update-message', (event, message) => {
    document.getElementById('updateStatus').innerHTML = message;
    if (message.includes('available')) {
        document.getElementById('updateStatus').classList.add('update-available');
    }
});

// Xử lý nút kiểm tra update
document.getElementById('checkUpdate').addEventListener('click', () => {
    ipcRenderer.send('check-updates');
});