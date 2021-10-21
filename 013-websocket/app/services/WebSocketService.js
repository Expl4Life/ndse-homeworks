const socketIO = require('socket.io');
const db = require('../db');
const { ChatMessage } = require('../models');

class WebSocketService {
    constructor(server) {
        if (this.instance) {
            return this.instance;
        }

        this.io = socketIO(server);
    }
    
    init() {
        this.io.on('connection', async (socket) => {

            const { id } = socket;
            console.log(`Socket connected: ${id}`);
            const { roomName } = socket.handshake.query;
            let chat = await db.chats.findChatById(roomName);

            if(!chat) {
                chat = await db.chats.createChat({chatId: roomName});
            } 

            chat && socket.emit('create-comments', chat.messages || []);

            socket.join(roomName);
            socket.on('comment-to-book', async (msg) => {
                const message = new ChatMessage({
                    userName: msg.userName,
                    userId: msg.userId,
                    text: msg.text,
                });
                await db.chats.addMessage(roomName, message);
                console.log(message);
                msg.time = `${new Date().toLocaleDateString()}  ${getTime()}`;
                socket.to(roomName).emit('comment-to-book', msg);
                socket.emit('comment-to-book', msg);
            });

            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${id}`);
            });
        });
    }
}

function getTime() {
    let moscowTimeZone = 3;
    let today = new Date();
    let h = today.getUTCHours() + moscowTimeZone;
    let m = today.getMinutes();
    let s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    return `${h >= 24 ? h - 24 : h}` + ":" + m + ":" + s;
}

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

module.exports = WebSocketService;