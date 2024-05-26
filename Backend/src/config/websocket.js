'use strict';  // bật chế độ nghiêm ngặt trong js 
const { createServer } = require('http');
const { WebSocketServer, WebSocket } = require('ws');
const homeController = require('../app/controllers/HomeContrailer')
const adminControler = require('../app/controllers/adminControler')
const createWebsocket = (app) => {
    const connections = new Map();
    const server = createServer(app)   
    const wss = new WebSocketServer({ server })
    const controllersWebsocket = {
        feetback(data, id) {
            const resultFeetback = homeController.createNewFeetback(data);
            resultFeetback.then(result => {
                if (result) {
                    return wss.clients.forEach(function each(client) {
                        if (connections.get(client) === id && client.readyState === WebSocket.OPEN) {
                            client.send(JSON.stringify(result));
                        }
                    });
                }
            })
        },
        cancelOder(data, id, ws) {
            const resultCancelOder = homeController.canCelOder(data.idBill);
            resultCancelOder.then(result => {
                if (result) {
                    return wss.clients.forEach(function each(client) {
                        if (client === ws && client.readyState === WebSocket.OPEN || connections.get(client).includes('mybill_admin')) {
                            client.send(JSON.stringify({ idBill: data.idBill }))
                        }
                    })
                }
            })
        },
        newMessage(data, id, ws) {
            const createNewMessage = homeController.createNewmessage(data.idUser, data.message);
            createNewMessage.then(resultNewmessage => {
                if (resultNewmessage) {
                    return wss.clients.forEach(function each(client) {
                        if (client === ws && client.readyState === WebSocket.OPEN || connections.get(client).includes('chat_admin')) {
                            client.send(JSON.stringify(resultNewmessage))
                        }
                    })
                }
            })
        },
        adminReply(data, id, ws) {
            const { idchat, idAdmin, answer } = data;
            const replyMess = adminControler.adminReplyMess(idchat, idAdmin, answer)
            replyMess.then(responseReplly => {
                if (responseReplly) {
                    return wss.clients.forEach(function each(client) {
                        if (client === ws && client.readyState === WebSocket.OPEN || connections.get(client).includes(idchat)) {
                            client.send(JSON.stringify(responseReplly))
                        }
                    })
                }
            })

        }
    }
    wss.on('connection', function (ws, request) {
        const id = request.url.split('/')[1]
        connections.set(ws, id)
        const ip = request.socket.remoteAddress; // cachs lay ip user
        ws.on('error', console.error);
        ws.on('message', function message(data) {
            const dataParse = JSON.parse(data);
            controllersWebsocket[dataParse.type] && controllersWebsocket[dataParse.type](dataParse, id, ws);
        });
        ws.on('close', () => connections.delete(ws))
    });
    return server

}

module.exports = { createWebsocket }