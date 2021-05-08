let _ = require('lodash');

class Esp8266_handler {

    constructor() {
        this.is_connected = false;
        this.sockets = [];
        this.io = null;
    }

    connected(){
        return this.is_connected;
    }

    connect(io){
        this.is_connected = true;
        this.io = io;
        io.on('connection', (socket) => {
            this.sockets.add(socket);

            console.log(`ESP ${socket.handshake.address} connected!`);
            socket.on('disconnect', () => {
                console.log(`ESP ${socket.handshake.address} disconnected!`);
                this.sockets = _.filter(this.sockets, (_socket) => {
                    return _socket !== socket;
                });
            });
            this._defineMessages(socket);
        });
    }

    _defineMessages(socket){
        socket.on('ping', (msg) => {
            console.log(`${socket.handshake.address} send: ${msg}`);
            this.io.emit('ping', 'Hello from PC!');
        });
    };

    sendData(data){
        this.io.emit('data', data);
        //console.log(`Send data: ${JSON.stringify(data)}`)
    }
}

module.exports = Esp8266_handler;
