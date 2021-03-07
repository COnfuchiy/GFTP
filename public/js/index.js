window.$ = window.jQuery = require('jquery');
const {ipcRenderer} = require('electron');
const valid_url = require('valid-url');

$(document).ready(() => {

    $('.login-form').on('submit', (e) => {

        $('.login-form button').blur();
        ipcRenderer.send('ftp:login',
            $('.url').val(),
            $('.port').val(),
            $('.username').val(),
            $('.passwd').val());
        return false;
    });

    ipcRenderer.on('ftp:connect', (e) => {
        $('.login-form')[0].style.display = 'none';
    });
    ipcRenderer.on('ftp:viewDir', (e,nodes) => {
        let outputArea = $('.ftp-viewer');
        outputArea.empty();
        outputArea.append(`<table class="ftp-table"></table>`);
        let outputTable = $('.ftp-table');
        for (let node of nodes){
            outputTable.append(`
            <tr>
                <td>${node.type==='d'?'dir':'file'}</td>
                <td>${node.name}</td>
                <td>${(node.size/1000).toString()+' kb'}</td>
            </tr>
            `);
        }
    });
    ipcRenderer.on('total:start', (e) => {
        $('.login-form')[0].style.display = 'none';
    });
});
