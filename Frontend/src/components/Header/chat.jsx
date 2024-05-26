import React from 'react';
import gettoken from '../../until/gettoken.js'
import { jwtDecode } from 'jwt-decode';
import { wsChatContext } from "../../App.js"; // Import context từ App component
const Chat = () => {
    const messagesContainerRef = React.useRef(null);
    const wschat = React.useContext(wsChatContext);
    const [message, setMessage] = React.useState('')
    const [myChats, setMychats] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:3000/mychat', {
            method: 'get',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${gettoken()}`
            },
        }).then(response => { if (response.ok) return response.json() }).then(dataChat => setMychats(dataChat.chats))
            .catch(err => console.log("cos looix"))

    }, [])
    React.useEffect(() => {
        if (wschat) {
            wschat.onmessage = (event) => {
                const data = JSON.parse(event.data)
                setMychats(prev => [...prev, data.newMessage])
            }
            
        }
        return () => {
            wschat.onmessage = null;
          };
    }, [wschat])

    React.useEffect(() => {
        // Cuộn xuống dưới cùng mỗi khi messages thay đổi
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [myChats]);

    const handelSubmitFormChat = (event) => {

        event.preventDefault();
        try {
            setMessage('')
            wschat.send(JSON.stringify({ type: 'newMessage', message, idUser: jwtDecode(gettoken()).idUser }))
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className='chat'>
            <div className="headerChat">
                <div className="avatarChat">
                    <img src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png" alt="" />

                </div>
                <div className="name">
                    CHỦ SHOP
                </div>
            </div>
            <div ref={messagesContainerRef} className="contentChat">
                {myChats.map(message => (
                    <div className={message._id === jwtDecode(gettoken()).idUser ? 'right' : 'left'}>
                        <div className='myMessage' >{message.content}</div>
                    </div>
                ))}
            </div>
            <div className="footerChat">
                <form onSubmit={handelSubmitFormChat} action="">
                    <div className="icon_opption">
                        <img src="https://play-lh.googleusercontent.com/s9eL3dU5I9rnxVxDeqYpqNkPcK3DRcp-FGMXg3Ul4jhbDpwMXxWKKF3Y5M9GzsTE6K8" alt="" />
                        <img src="https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png" alt="" />
                    </div>
                    <input value={message} onChange={(event) => setMessage(event.target.value)} type="text" />

                    <div className="iconsend">
                        <img src="https://w7.pngwing.com/pngs/47/737/png-transparent-telegram-message-chat-logo-rounded-social-media-icon.png" alt="" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Chat;