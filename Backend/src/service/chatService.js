const User = require("../app/models/User");
const chat = require("../app/models/chat");
const message = require("../app/models/message");
const messageModel = require("../app/models/message");

class chatService {
    getChatsByUserId(userId) {
        return chat.findOne({ _id: userId }, { chats: 1, _id: 1 }).sort({ updatedAt: -1 });
    }
    async createNewmessage(idUser, message) {
        const newMessage = new messageModel({ _id: idUser, content: message })
        // kieemx tra xem từng có cuộc trò chuyện chưa
        try {
            const checkExistChat = await chat.findOne({ _id: idUser }, { chats: 1 })
            const informationUserChat = await User.findOne({ _id: idUser }, { avatar: 1, userName: 1, _id: 1 })
            if (checkExistChat) {
                // thêm vào mảng
                const checkUpdate = await chat.updateOne({ _id: idUser }, { lastMessage: newMessage, $push: { chats: newMessage } });
                // trả về số tài liệu được cập nhật
                if (checkUpdate.modifiedCount) return { newMessage: newMessage.toObject(), lastMessage: newMessage };
                return false;
            }
            // tạo mới chat
            const newChat = await new chat({ _id: idUser, chats: [newMessage], lastMessage: newMessage }).save({}, { $sort: { createdAt: -1 } });
            if (newChat) return { newMessage: newMessage.toObject(), newUserChat: informationUserChat }
        } catch (error) {
            return false
        }
    }
    getChats() {
        return chat.find({}, { _id: 1, lastMessage: 1 }).sort({ updatedAt: -1 })
            .then(chats => {
                return Promise.all(chats.map(eachChat =>
                    User.findOne({ _id: eachChat._id }, { userName: 1, avatar: 1 })
                        .then(eachUser => ({ ...eachUser.toObject(), lastMessage: eachChat.lastMessage }))
                ))

            }).then(data => {
                return data
            })
    }
    getContenchatById(idChat) {
        return chat.findOne({ _id: idChat }, { chats: 1, _id: 1 }).sort({ updatedAt: -1 });
    }

    async adminReplyMess(idChat, idAdmin, messageAnswer) {
        const answer = new message({ _id: idAdmin, content: messageAnswer });
        const update = await chat.updateOne({ _id: idChat }, { lastMessage: answer, $push: { chats: answer } })
        if (update.modifiedCount) {
            return { newMessage: answer.toObject(), lastMessage: answer.toObject() }
        }
        return false
    }
   
}
module.exports = new chatService();