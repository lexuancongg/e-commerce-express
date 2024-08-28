const passport = require('passport')
const userAuth = passport.authenticate('jwt', { session: false, failWithError: true });
const chatController = require('../controllers/chat.js')
module.exports = app => {
    app.get('/chat/mychat', userAuth, chatController.getMychat)
    app.get('/chat/chatAdmin', chatController.getChats)
    app.get('/chat/getcontentchat/:id', userAuth, chatController.getcontentChatById)
}