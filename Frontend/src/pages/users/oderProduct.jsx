import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import formatCurrency from "../../until/formatMoney";
import getToken from "../../until/gettoken";
import messageAction from "../../until/message";
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
const OderProduct = () => {
    const navigate = useNavigate();
    const idProduct = useParams().id
    const token = getToken()
    const [quantity, setQuantity] = React.useState(1);

    const [informationOder, SetInformationOder] = React.useState({})

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        SetInformationOder(prevData => ({ ...prevData, informationBuyer: { ...prevData.informationBuyer, [name]: value } }))
    }

    const DoneBuyProduct = React.useCallback(
        async () => {
            fetch(`http://localhost:3000/payBuyProduct/${informationOder.informationProduct._id}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ totalMoney: informationOder.informationProduct.price * quantity, quantity: quantity, informationBuyer: informationOder.informationBuyer })
            }).then(responseOder => {
                if (responseOder.ok) {
                    Toastify({
                        text: "bàn đã đặt hàng thành công",
                        duration: 3000,  // thời gian hiển thị (ms)
                        close: true,     // có nút đóng
                        gravity: "top",  // vị trí: "top" hoặc "bottom"
                        position: "right", // vị trí: "left", "center" hoặc "right"
                        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
                      }).showToast();
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);

                }
            }).catch(err => console.log(err))
        }, [informationOder, quantity])   // phải dùng debendence để theo dõi nếu không thì nó sẽ không tự động cập nhật được giá trị mới 

    const saveInformationInsert = () => {
        const modalAlert = document.querySelector(".alterInformationBuyer");
        const overlay = document.querySelector(".overlay");
        const templatePhonenumber = /^(\d{3}-\d{3}-\d{4}|\d{10})$/;
        if (informationOder.informationBuyer.fullName.trim() && informationOder.informationBuyer.phoneNumberOder.trim() && informationOder.informationBuyer.address.trim()) {
            if (templatePhonenumber.test(informationOder.informationBuyer.phoneNumberOder)) {
                overlay.style.display = "none";
                return modalAlert.classList.remove("active")

            }
            return messageAction(document.querySelector('.toasts'), { type: 'error', title: 'Error ChangeInformation', text: 'số điện thoại không hợp lệ' })

        }
        return messageAction(document.querySelector('.toasts'), { type: 'error', title: 'Error ChangeInformation', text: 'vui lòng nhập dữ liệu' })

    }
    const showModal = () => {
        const modalAlert = document.querySelector(".alterInformationBuyer");
        const overlay = document.querySelector(".overlay");
        overlay.style.display = "block";
        modalAlert.classList.add("active")
    }
    React.useEffect(function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        const fetchData = () => {
            fetch(`http://localhost:3000/informationOder/${idProduct}`, {
                method: "get", mode: "cors",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

            }).then(function (responseInformationOder) {
                if (responseInformationOder.ok) {
                    return responseInformationOder.json();
                }
                throw new Error();
            }).then(function (dataInformationOder) {
                SetInformationOder(dataInformationOder)

            })
                .catch(function (err) {
                    navigate("/login")
                })
        }
        fetchData();
    }, [token, idProduct])
    return (
        <div className="spaceOderProduct">
            <div className="toasts"></div>
            <div className="container ">
                <div className="informationbuy">
                    {informationOder.informationBuyer ? (
                        <div className="informationOders ">
                            <div className="informationBuyer">
                                <div>thông tin nhận hàng</div>
                                <div>tên khách hàng :  {informationOder.informationBuyer.fullName}</div>
                                <div>số điện thoại: {informationOder.informationBuyer.phoneNumberOder}</div>
                                <div>địa chỉ :{informationOder.informationBuyer.address}</div>
                                <button className=" alterInformation" onClick={showModal}>sửa thông tin</button>
                            </div>

                        </div>
                    ) : (
                        <div className="informationOders ">
                            <div className="informationBuyer">
                                <p className="warning">bạn chưa nhập thông tin nhân hàng vui lòng nhập thông tin nhận hàng </p>
                                <button onClick={() => showModal()} className="btnInsertinformation">nhập thông tin</button>
                            </div>
                        </div>
                    )}

                    <div className="informationProduct">
                        <div> <img src={informationOder.informationProduct?.image} alt="" /></div>
                        <div className="productDetail">
                            <div className="name">{informationOder.informationProduct?.name}</div>
                            <div className="price">giá bán : {formatCurrency(informationOder.informationProduct?.price, "VND")}</div>
                            <div className="quantity">
                                <span>số lượng :</span>
                                <div>
                                    <button onClick={() => {
                                        if (quantity > 0) {
                                            setQuantity(function (prev) {
                                                return prev - 1
                                            })
                                        }
                                    }}>-</button>
                                    <button className="btn-quantity" >{quantity}</button>
                                    <button onClick={function () {
                                        setQuantity(prev => prev + 1)
                                    }}>+</button>
                                </div>
                            </div>
                            <div className="transport">phí vận chuyển :35.000</div>
                            <div className="totalMoney">tổng tiền : {formatCurrency(informationOder.informationProduct?.price * quantity + 35000, 'VND')}</div>
                        </div>
                        {informationOder.informationBuyer ? (
                            <button className="doneOder" onClick={DoneBuyProduct} >mua ngay</button>
                        ) : (<button class="btn btn-secondary doneOder" disabled >mua ngay</button>)}
                    </div>
                </div>
            </div>

            <div className="alterInformationBuyer">
                <div className="title">THÔNG TIN NHẬN HÀNG</div>
                <form className="inserInformation  ">
                    <input type="text" name="fullName" placeholder="nhập họ và tên" value={informationOder.informationBuyer?.fullName} onChange={handleInputChange} />
                    <input type="text" name="phoneNumberOder" placeholder="nhập số điện thoại" value={informationOder.informationBuyer?.phoneNumberOder} onChange={handleInputChange} />
                    <input type="text" name="address" placeholder="nhập địa chỉ" value={informationOder.informationBuyer?.address} onChange={handleInputChange} />
                    <button type="button" className="btn_saveInformation" onClick={saveInformationInsert}>lưu thông tin</button>
                </form>
            </div>
            <div style={{ display: "none" }} className="overlay"></div>

        </div>
    )
}
export default OderProduct