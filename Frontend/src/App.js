import React, { useState, useEffect, createContext, useCallback, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DotLoader } from "react-spinners"
import Orderconfirmation from './pages/users/informationProduct';
import Routers from './Router/Router.js';
import Mycart from './pages/users/mycart.jsx';
import Footer from './layouts/footer.jsx';
import Header from './layouts/header.jsx';
import getToken from './until/gettoken.js';
import message from './until/message'
import { jwtDecode } from 'jwt-decode';
export const wsChatContext = createContext();
export const showContext = createContext();
function App() {
  const [DataAboutLoggin, SetDataAboutLoggin] = useState({});
  const [wsChat, setWsChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantityProductInCart, setQuantityProductInCart] = useState(0);
  const token = getToken();
  const [show, setShow] = useState(false)
  const showRef = useRef(show);

  useEffect(() => {
    const getRiviewDataAplication = (async () => {
      try {
        if (token) {
          const response = await fetch('http://localhost:3000/checkLoginStatus', {
            method: 'get',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch');
          }
          const data = await response.json();
          connectWebsocket(data.role)

          SetDataAboutLoggin({ role: data.role, avatar: data.avatar });
          setQuantityProductInCart(data.quantityCard);
        } else {
          SetDataAboutLoggin({ role: false });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })()
  }, [token]);
  const connectWebsocket = useCallback(
    (role) => {
      const wss = new WebSocket(`ws://localhost:3000/chat_${role}_${jwtDecode(token).idUser}`);
      wss.onopen = () => setWsChat(wss);
      wss.onmessage = (event) => {  
        const data = JSON.parse(event.data)
        // dùng kiểu tham chiếu để cập nhật khi có sự thay đổi 
        const isShow = showRef.current;
        if (!isShow) {
          const toast = document.querySelector('.toasts');
          message(toast, { type: 'succes', title: 'Message', text: 'bạn có một tin nhắn mới' })
        }
      }
    }, [token]
  )
  // if (wsChat) { : setwschat kiểu tham chiếu nên sẽ gắn địa chỉ ô nhớ wss cho wschat  nên có thể bị ghì đè nếu muốn 
  //   wsChat.onmessage = () => console.log('app')
  // }
  // cập nhật sự thay đổi của địa chỉ ô nhớ
  useEffect(() => {
    showRef.current = show; // Cập nhật giá trị của showRef mỗi khi show thay đổi
  }, [show]);
  return (
    <>
      {loading ? (
        <div className='spaceLoading'>
          <DotLoader color='white' size={50} loading={true} />
        </div>
      ) : (
        <wsChatContext.Provider value={wsChat}>
          <div className='toasts'></div>
          <Header wsChat={wsChat} show={show} setShow={setShow} DataAboutLoggin={DataAboutLoggin} SetDataAboutLoggin={SetDataAboutLoggin} quantityProductInCart={quantityProductInCart} />
          <showContext.Provider value={{ show: show, setShow }}>
            <Routes>
              {Routers.map((router, index) => (
                <Route key={index} path={router.path} element={router.element}></Route>
              ))}
              <Route path='/confirmationProduct/:id' element={<Orderconfirmation setQuantityProductInCart={setQuantityProductInCart} />}></Route>
              <Route path='/mycart' element={<Mycart>{setQuantityProductInCart}</Mycart>}></Route>
            </Routes>
          </showContext.Provider>
          <Footer></Footer>
        </wsChatContext.Provider>
      )}
    </>
  );
}


export default App;
