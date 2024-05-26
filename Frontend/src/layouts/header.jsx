import { Link } from 'react-router-dom';
import { memo, useEffect } from 'react';
import Chat from '../components/Header/chat';
import ChatAdmin from '../components/Header/chatAdmin'
const Header = ({ wsChat, setShow, show, DataAboutLoggin, SetDataAboutLoggin, quantityProductInCart }) => {
    useEffect(() => {
        const getDataMychat = (async () => {
            try {

            } catch (error) {

            }
        })()

    })

    const HenDalLogOut = () => {
        localStorage.removeItem("token");
        SetDataAboutLoggin('');
        if (wsChat) wsChat.close();
    }
    return (
        <div>
            <div style={{ height: '100px' }}></div>
            <div class="header">
                <div class="container">
                    <div class="row">
                        <div class="logo col-lg-1">
                            <a href="/">
                                <img
                                    src="https://maludesign.vn/wp-content/uploads/2021/11/thiet-ke-logo-fashion-malu_80548090.png"
                                    alt="" />
                            </a>
                        </div>

                        <div class="form-search col-lg-4">
                            <form method='post' action="http://localhost:3000/search?_method=get">
                                <input type="text" name="search" id="" placeholder='tìm kiếm sản phẩm' />
                                <button type="submit">tìm kiếm</button>
                            </form>
                        </div>
                        <div className="menu col-lg-7">
                            <ul class="iteam-menu">
                                <li><a href="">HOME</a></li>
                                <li><a href="">PAGES</a></li>
                                <li><a href="">GALLERY</a></li>
                                <li><a href="">CONTACT</a></li>
                                {!DataAboutLoggin.role ? (
                                    <>
                                        <li><a href="/login">ĐĂNG NHẬP </a></li>
                                        <li><a href="/Register">ĐĂNG KÝ</a></li>
                                    </>
                                ) : ''}


                                {DataAboutLoggin.role && <>
                                    <li class="user">
                                        <a href="">
                                            <img class="img-user" href="#" role=""
                                                src={DataAboutLoggin.avatar || "https://banner2.cleanpng.com/20180714/hxu/kisspng-user-profile-computer-icons-login-clip-art-profile-picture-icon-5b49de2f52aa71.9002514115315676633386.jpg"}
                                                alt="" />
                                        </a>

                                        <ul class="dropdownmenu">
                                            <li><a href="/myAccount">tài khoản của tôi </a></li>
                                            <li><a href="/myOder">đơn mua </a></li>
                                            <li><a onClick={HenDalLogOut} href="">Đăng xuất</a></li>
                                        </ul>

                                    </li>
                                    <li >
                                        <Link to="/mycart">
                                            <div className='blockLogoCart'>
                                                <img class="img-cart"
                                                    src="https://img.pikbest.com/png-images/qiantu/black-and-white-icon-shopping-cart-collection_2688834.png!w700wp"
                                                    alt="" />
                                                {quantityProductInCart > 0 && <div className="numberProductsInCart">{quantityProductInCart}</div>}
                                            </div>
                                        </Link>

                                    </li>
                                </>
                                }
                                {DataAboutLoggin.role == "admin" &&
                                    <li className='manage'>
                                        <a>
                                            <img className='img-manage'
                                                src='https://banner2.cleanpng.com/20180516/yfw/kisspng-computer-icons-businessperson-5afbcfa9909ee2.9122857315264521375924.jpg'
                                            >
                                            </img>
                                        </a>
                                        <ul class="dropdownmenu">
                                            <li><Link to="/odermanagement">quản lý đơn hàng </Link></li>
                                            <li><Link to="/ProductManagament">quản lý sản phẩm</Link></li>
                                        </ul>
                                    </li>
                                }
                                {DataAboutLoggin.role && <li className='manage chat_icon'>
                                    <a>
                                        <img onClick={() => setShow(prev => !prev)} className='img-manage'
                                            src='https://erado.vn/img/a/128.png'
                                        >
                                        </img>
                                    </a>
                                    {show && DataAboutLoggin.role && (
                                        <>
                                            {DataAboutLoggin.role === "admin" ? <ChatAdmin /> : <Chat />}
                                        </>
                                    )}
                                </li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default memo(Header)