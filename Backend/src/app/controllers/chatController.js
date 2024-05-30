const chatService = require('../../service/chatService')
class chatController {
    async getChats(req, res, next) {
        try {
            const data = await chatService.getChats();
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
    async getcontentChatById(req, res, next) {
        try {
            const { id } = req.params;
            const chat = await chatService.getContenchatById(id);
            if (chat) {
                return res.status(200).json(chat);
            }
            res.status(404).json({ message: 'Chat not found.' });
        } catch (error) {
            next(error);
        }
    }
    async getChats(req, res, next) {
        const idUser = req.user;
        try {
            const myChats = await chatService.getChats(idUser);
            if (myChats) {
                return res.status(200).json(myChats);
            }
            res.status(404).json("found");
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new chatController()