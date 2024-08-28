import { useCallback, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import checkToken from "../../until/checktoken";
import formatCurrency from "../../until/formatMoney";
import getToken from "../../until/gettoken";
import AssessProduct from "../../components/informationProduct/assessProduct";
import ProductAtCategory from "../../components/informationProduct/productAtCategory";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Orderconfirmation = ({ setQuantityProductInCart }) => {
    const idProduct = useParams().id;
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1)
    const token = getToken()
    const [informationProduct, SetInformationProduct] = useState({});
    const fc_nextPage = (idProduct) => navigate(`/oderProduct/${idProduct}`)

    const addToCart = useCallback(
        idProduct => {
            // fetch tạo dữ liệu trên database
            fetch(`http://localhost:3000/addtocart/${idProduct}`, {
                method: "post",
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            }).then(function (responseAddToCart) {
                if (responseAddToCart.ok) {
                    
                    toast.success("Thêm vào giỏ hành thành công");
                    return setQuantityProductInCart((prevQuantity) => prevQuantity + 1);
                }
                else {
                    return responseAddToCart.json().then(messageErr => { throw new Error(messageErr.message) }).catch(err => alert(err.message))
                }
            }).catch((err) => console.log(err))
        }, [token, quantity]
    )
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        const fetchData = async () => {
            try {
                const responseInformationOder = await fetch(`http://localhost:3000/informationProduct/${idProduct}`, {
                    method: "get", mode: "cors",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (responseInformationOder.ok) {
                    const data = await responseInformationOder.json();
                    SetInformationProduct(data);
                }

            } catch (err) {
                console.log("Error en la peticion", err);
            }
        }
        fetchData();
    }, [idProduct, token]);
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className="spaceOderInformation ">
                <div className="container ">
                    <div className="infomation">
                        <div className="informationBotom">
                            <div className="imgProduct">
                                <img src={informationProduct?.image} alt="" />
                            </div>
                            <div className="informationoder">
                                <h4>{informationProduct?.name}</h4>
                                <p> {informationProduct.quantity} sản phẩm có sẵn    ||   {informationProduct.totalQuantitySold} đã bán</p>
                                <div className="price">
                                    <h3>{formatCurrency(informationProduct?.price, 'VND')}</h3>
                                </div>
                                <div className="transport">
                                    <p>phương thức vận chuyển </p>
                                </div>
                                <div className="chooseQuantity">
                                    <p>Số Lượng :</p>
                                    <div className="choose">
                                        <button onClick={() => setQuantity(prevQuantity => {
                                            if (prevQuantity > 1) {
                                                return prevQuantity - 1
                                            }
                                            return 1;
                                        })}><span>-</span></button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(prevQuantity => {
                                            if (prevQuantity < informationProduct.quantity) {
                                                return prevQuantity + 1
                                            }
                                            return informationProduct.quantity;
                                        })}><span>+</span></button>
                                    </div>
                                </div>

                                <div className="cartandpay">
                                    <button className="cart" onClick={() => addToCart(idProduct)}>thêm vào giỏ hàng</button>
                                    <button className="cart" onClick={function () {
                                        if (token) {
                                            const isCheckToken = checkToken(token);
                                            isCheckToken ? fc_nextPage(idProduct) : navigate("/login");
                                        } else {
                                            navigate("/login")
                                        }
                                    }} >mua ngay </button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <AssessProduct idProduct={idProduct}></AssessProduct>
                    <ProductAtCategory listProductAtCategory={informationProduct.listProductAtCategory}></ProductAtCategory>
                </div>
            </div >
        </>
    )
}
export default Orderconfirmation;