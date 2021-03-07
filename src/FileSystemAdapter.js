const childProcess = require('child_process');
const path = require('path');
const fileSystem = require('fs');

class FileSystemAdapter {
    constructor(win) {
        this._win = win;
        this._curDir = '';
        this._homeDir = '';
        this._allDisks = [];
        this.getLocalDiskNames()
    }
    getLocalDiskNames() {
        const buffer = childProcess.execSync('wmic logicaldisk get Caption  /format:list').toString();
        const lines = buffer.split('\r\r\n');

        for (const line of lines) {
            if(line) {
                const lineData = line.split('=');
                this._allDisks.push(lineData[1]);
            }
        }

        if (!this._allDisks.length){
            process.exit(-1);
        }
        this._homeDir = this._allDisks[0]+":\\\\";
    }
    start(){
        this._win.webContents.send(
            'total:start',
            this._allDisks,
            this._homeDir,
            this.lsDir()
        );
    }
    lsDir(directory){
        return fileSystem.readdirSync(directory);
    }
}
module.exports= {
    FileSystemAdapter
};