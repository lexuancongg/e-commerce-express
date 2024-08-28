const chatService = require('../../service/chatService')
class chatController {
    async getcontentChatById(req, res, next) {
        try {
            const { id } = req.params;
            const chat = await chatService.getContenchatById(id);
            if (chat) {
                return res.status(200).json(chat);
            }
            res.status(404).json([]);
        } catch (error) {
            next(error);
        }
    }
    async getChats(req, res, next) {
        try {
            const myChats = await chatService.getChats();
            if (myChats) {
                return res.status(200).json(myChats);
            }
            res.status(404).json("found");
        } catch (error) {
            next(error);
        }
    }
    async getChatsByUserId(req, res, next) {
        const { idUser } = req;
        const contentChat = await chatService.getChatsByUserId(idUser);
        if (contentChat)
            return res.status(200).json(contentChat);
        res.status(403).json("found")
    }
}
module.exports = new chatController()