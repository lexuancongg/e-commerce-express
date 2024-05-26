import { memo, useEffect, useState, useContext, useRef } from "react"
import getToken from "../../until/gettoken";
import { jwtDecode } from "jwt-decode";
import { wsChatContext } from '../../App.js'
const ModalChat = ({ setMychat, idchat, setIdchat, inforUserChat }) => {
    const wschat = useContext(wsChatContext);
    const [conttentChat, setContentchat] = useState([]);
    const [message, setMessage] = useState('');
    const messagesContainerRef = useRef(null);
    useEffect(() => {
        fetch(`http://localhost:3000/admin/getcontentchat/${idchat}`, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
        }).then(response => {
            document.querySelector('.sendMessage').focus();
            if (response) return response.json();
            throw new Error();
        }).then(dataContentChat => setContentchat(dataContentChat.chats))
            .catch(err => console.log("error", err));
    }, [idchat])
    useEffect(() => {
        if (wschat) {
            wschat.onmessage = (event) => {
                const data = JSON.parse(event.data)
                console.log(data)
                if (data.newMessage._id === idchat || data.newMessage._id === jwtDecode(getToken()).idUser) {
                    setContentchat(prev => [...prev, data.newMessage])
                }
                if (data.newUserChat) {
                    return setMychat(prevData => [data.newUserChat, ...prevData])
                } else {
                    setMychat(prevData => {
                        const index = prevData.findIndex(userChat => userChat._id === idchat)
                        let firtUserChat = prevData[index];
                        firtUserChat.lastMessage = data.lastMessage
                        return [firtUserChat, ...prevData.filter(item => item._id !== idchat)]
                    })
                }
            }
        }

    }, [])
    // console.log(wschat)

    useEffect(() => {
        // Cuộn xuống dưới cùng mỗi khi messages thay đổi
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [conttentChat]);
    const hendalSubmitMessage = (event) => {
        event.preventDefault();

        wschat.send(JSON.stringify({ type: 'adminReply', idchat: idchat, answer: message, idAdmin: jwtDecode(getToken()).idUser }))
        setMessage('')
    }


    return (
        <div className="chat" >
            <div className="headerChat">
                <div className="avatarChat">
                    <img src={inforUserChat.avatar || 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png'} alt="" />
                </div>
                <div className="name">
                    {inforUserChat.userName}
                </div>
                <div onClick={() => setIdchat(null)} className="close ">
                    <svg viewBox="0 0 12 13" width="20" height="20" fill="currentColor" class="x19dipnz x1lliihq x1k90msu x2h7rmj x1qfuztq"><g fill-rule="evenodd" transform="translate(-450 -1073)"><g fill-rule="nonzero"><path d="m98.095 917.155 7.75 7.75a.75.75 0 0 0 1.06-1.06l-7.75-7.75a.75.75 0 0 0-1.06 1.06z" transform="translate(353.5 159)"></path><path d="m105.845 916.095-7.75 7.75a.75.75 0 1 0 1.06 1.06l7.75-7.75a.75.75 0 0 0-1.06-1.06z" transform="translate(353.5 159)"></path></g></g></svg>
                </div>
            </div>
            <div ref={messagesContainerRef} className="contentChat">
                {conttentChat.map(message => (
                    <div className={message._id === idchat ? 'left' : 'right'}>
                        <div className='myMessage' >{message.content}</div>
                    </div>
                ))}
            </div>
            <div className="footerChat">
                <form onSubmit={hendalSubmitMessage}>
                    <div className="icon_opption">
                        <img src="https://play-lh.googleusercontent.com/s9eL3dU5I9rnxVxDeqYpqNkPcK3DRcp-FGMXg3Ul4jhbDpwMXxWKKF3Y5M9GzsTE6K8" alt="" />
                        <img src="https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png" alt="" />
                    </div>
                    <input className="sendMessage" value={message} onChange={(event) => setMessage(event.target.value)} type="text" />

                    <div className="iconsend">
                        <img src="https://w7.pngwing.com/pngs/47/737/png-transparent-telegram-message-chat-logo-rounded-social-media-icon.png" alt="" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default memo(ModalChat)