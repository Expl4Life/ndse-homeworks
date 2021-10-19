const socketIO = require('socket.io');

class WebSocketService {
    constructor(server) {
        if (this.instance) {
            return this.instance;
        }

        this.io = socketIO(server);
    }
    
    init() {
        this.io.on('connection', (socket) => {
            const { id } = socket;
            console.log(`Socket connected: ${id}`);

            // сообщение себе
            socket.on('message-to-me', (msg) => {
                msg.type = 'me';
                socket.emit('message-to-me', msg);
            });

            // сообщение для всех
            socket.on('message-to-all', (msg) => {
                msg.type = 'all';
                socket.broadcast.emit('message-to-all', msg);
                socket.emit('message-to-all', msg);
            });

            // работа с комнатами
            const { roomName } = socket.handshake.query;
            console.log(`Socket roomName: ${roomName}`);
            socket.join(roomName);
            socket.on('message-to-room', (msg) => {
                msg.type = `room: ${roomName}`;
                socket.to(roomName).emit('message-to-room', msg);
                socket.emit('message-to-room', msg);
            });

            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${id}`);
            });
        });
    }
}


module.exports = WebSocketService;