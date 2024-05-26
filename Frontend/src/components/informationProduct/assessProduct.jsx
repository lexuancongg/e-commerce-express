'use strict';
import React, { useState, useEffect ,memo } from "react";
import { jwtDecode } from "jwt-decode";
import getToken from "../../until/gettoken";
const AssessProduct = ({ idProduct }) => {
    const [listFeetBack, setListFeetback] = useState([]);
    const [feetback, setFeetback] = useState('');
    const token = getToken();
    useEffect(() => {
        fetch(`http://localhost:3000/feetback/${idProduct}`, {
            method: 'get',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(data => setListFeetback(data))
    }, [idProduct]);
    const handleSubmitFeedback = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3000/feetback/${idProduct}`, {
            method: 'post',
            mode: "cors",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: "feetback", content: feetback, idUser: jwtDecode(getToken()).idUser, idProduct })
        }).then(response => {
            if (response.ok) return response.json()
        }).then(newFeetback => { setListFeetback(prev => [...prev, newFeetback]); setFeetback('') })
    };
    return (
        <div className="spaceFeetback" >
            <div className="title">ĐÁNH GIÁ SẢN PHẨM</div>
            <div>4.9 trên 5 sao</div>
            <div className="content">
                <form onSubmit={handleSubmitFeedback}>
                    <input placeholder="nhập phản hồi của bạn" value={feetback} onChange={(event) => setFeetback(event.target.value)} type="text" />
                    <input type="submit" value="Gửi" />
                </form>
                <div className="feetbacks">
                    {listFeetBack.map((item, index) => (
                        <div>
                            <div className="personFeetback">
                                <div className="avatar">
                                    <img src={item.avatar ? item.avatar : 'https://banner2.cleanpng.com/20180714/hxu/kisspng-user-profile-computer-icons-login-clip-art-profile-picture-icon-5b49de2f52aa71.9002514115315676633386.jpg'} alt="" />
                                </div>
                                <div className="name">
                                    {item.userName}
                                </div>
                            </div>
                            <div className="contentFeetback">
                                {item.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default memo(AssessProduct);