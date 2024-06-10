import { useEffect, useContext, useRef, useState, memo } from "react";
import getToken from "../../until/gettoken.js";
import { wsChatContext } from "../../App.js"; // Import context từ App component
import Modalchat from "../templateChat/modalchat.jsx";
import { jwtDecode } from "jwt-decode";
import FindUserChat from "./findChat.jsx";
const ChatAdmin = () => {
    const wschat = useContext(wsChatContext);
    const [mychats, setMychat] = useState([]);
    const [idchat, setIdchat] = useState(null);
    const [findUser, setFindUser] = useState(false)
    useEffect(() => {
        fetch('http://localhost:3000/admin/chatAdmin', {
            method: 'get',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
        }).then(response => {
            if (response.ok) return response.json();
            throw new Error()
        }).then(dataMychat => setMychat(dataMychat))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (wschat) {
            wschat.onmessage = (event) => {
                const data = JSON.parse(event.data)
                if (data.newUserChat) {
                    return setMychat(prevData => [data.newUserChat, ...prevData])
                }
                // đã có lịch sử chat cần đưa lên đầu
                return setMychat(prevData => {
                    const index = prevData.findIndex(userChat => userChat._id === data.newMessage._id)
                    let firtUserChat = prevData[index];
                    firtUserChat.lastMessage = data.lastMessage
                    return [firtUserChat, ...prevData.filter(item => item._id !== data.newMessage._id)]
                })
            }
        }
    }, [idchat, wschat])


    return (
        idchat ?
            <Modalchat inforUserChat={mychats.find(userChat => userChat._id === idchat)} setMychat={setMychat} setIdchat={setIdchat} idchat={idchat} ></Modalchat>
            :
            findUser ? <FindUserChat mychats={mychats} setIdchat={setIdchat} setFindUser={setFindUser} ></FindUserChat> :
                <div className='chat'>
                    <div className="headerChatAdmin">
                        <div className="title">
                            Đoạn Chat
                        </div>
                        <div className="find">

                            <div className="icon">
                                <span class="x6s0dn4 x78zum5 xuxw1ft x47corl x1sln4lm">
                                    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq">
                                        <g fill-rule="evenodd" transform="translate(-448 -544)">
                                            <g fill-rule="nonzero"><path d="M10.743 2.257a6 6 0 1 1-8.485 8.486 6 6 0 0 1 8.485-8.486zm-1.06 1.06a4.5 4.5 0 1 0-6.365 6.364 4.5 4.5 0 0 0 6.364-6.363z" transform="translate(448 544)">
                                            </path><path d="M10.39 8.75a2.94 2.94 0 0 0-.199.432c-.155.417-.23.849-.172 1.284.055.415.232.794.54 1.103a.75.75 0 0 0 1.112-1.004l-.051-.057a.39.39 0 0 1-.114-.24c-.021-.155.014-.356.09-.563.031-.081.06-.145.08-.182l.012-.022a.75.75 0 1 0-1.299-.752z"
                                                transform="translate(448 544)"></path><path d="M9.557 11.659c.038-.018.09-.04.15-.064.207-.077.408-.112.562-.092.08.01.143.034.198.077l.041.036a.75.75 0 0 0 1.06-1.06 1.881 1.881 0 0 0-1.103-.54c-.435-.058-.867.018-1.284.175-.189.07-.336.143-.433.2a.75.75 0 0 0 .624 1.356l.066-.027.12-.061z" transform="translate(448 544)">
                                                </path><path d="m13.463 15.142-.04-.044-3.574-4.192c-.599-.703.355-1.656 1.058-1.057l4.191 3.574.044.04c.058.059.122.137.182.24.249.425.249.96-.154 1.41l-.057.057c-.45.403-.986.403-1.411.154a1.182 1.182 0 0 1-.24-.182zm.617-.616.444-.444a.31.31 0 0 0-.063-.052c-.093-.055-.263-.055-.35.024l.208.232.207-.206.006.007-.22.257-.026-.024.033-.034.025.027-.257.22-.007-.007zm-.027-.415c-.078.088-.078.257-.023.35a.31.31 0 0 0 .051.063l.205-.204-.233-.209z" transform="translate(448 544)">
                                                </path></g></g></svg></span>
                                <input onFocus={() => setFindUser(true)} type="text" placeholder="tìm kiếm trong đoạn chat" />
                            </div>
                        </div>
                    </div>
                    <div className="contentChat">
                        {mychats.map(userChat => (
                            <div onClick={() => setIdchat(userChat._id)} className="eachChat">
                                <div className="avatar">
                                    <img src={userChat.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png'} alt="" />
                                </div>
                                <div className="nameUser">
                                    <div className="name">
                                        {userChat.userName}
                                    </div>
                                    <div className="lastMessage">{jwtDecode(getToken()).idUser === userChat.lastMessage._id && 'bạn:'} {userChat.lastMessage.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="footerChat">
                    </div>
                </div>
    )

}

export default memo(ChatAdmin)