const Client = require('ftp');

class FtpConnection {
    constructor(win) {
        this._win = win;
        this._client = '';
        this._connectionSettings = {};
        this._curDir = '/';
        this._homeDir = '/';
    }

    login(address='localhost', port=21, username='anonymous', password='anonymous@'){
        this.createClient(address,port,username,password);
        this._client.connect(this._connectionSettings);
    }

    createClient(address,port,username,password){
        this._client = new Client();
        this._client.on('ready',()=>{
           this.successConnect();
        });
        this._client.on('error',(error)=>{
            this.parseError(error);
        });
        this._connectionSettings.address = address;
        this._connectionSettings.port = port;
        this._connectionSettings.username = username;
        this._connectionSettings.password = password;
    }
    parseError(errorEvent){
        console.log(errorEvent);
    }
    successConnect(){
        this._win.webContents.send(
            'ftp:connect'
        );
        this.lsHomeDir();
    }
    lsHomeDir(){
        this.lsDir(this._homeDir);
    }
    lsDir(directory){
        this._client.cwd(directory,(error, currentDir)=>{
            console.log(currentDir);
            if(error){
                this.parseError(error);
                return;
            }
            this._client.list((error,list)=>{
                if(error){
                    this.parseError(error);
                    return;
                }
                this._win.webContents.send(
                    'ftp:viewDir',
                    this.createDirectoryView(list)
                );
            });
        });

    }
    createDirectoryView(ftpList){
        let outputNodes = [];
        outputNodes.push({
            type:'d',
            size: 0,
            name:'←'
        });
        for (let node of ftpList){
            outputNodes.push({
                type:node.type,
                size: node.size,
                name:node.name
            });
        }
        return outputNodes;
    }

}
module.exports= {
    FtpConnection
};