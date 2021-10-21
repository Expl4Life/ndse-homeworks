const { Chat } = require('../models');

exports.findChatById = async(chatId) => {
    const chats = await Chat.find().select('-__v');
    const chat = chats.find((chat) => chat.chatId === chatId);
    return chat;
}

exports.createChat = async (chat) => {
    console.log('%chats.js line:10 chat', 'color: #007acc;', chat);
    const newChat = new Chat(chat);
    await newChat.save();
    return newChat;
};

exports.addMessage = async (chatId, message) => {
    console.log('%cchats.js line:17 chatId', 'color: #007acc;', chatId);
    // const chat = await Chat.find((item) => item && item.chatId === chatId);
    let chat = await exports.findChatById(chatId);
    if(chat) {
        chat = await Chat.findByIdAndUpdate(chat._id, {
            messages: [
                message,
                ...(chat && chat.messages || []),
            ]
        });
    }  else {
        throw new Error('Не удалось добавить сообщение в чат');
    }

    return chat;
};
