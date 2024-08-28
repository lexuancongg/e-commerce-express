import React from "react"
import { Link } from "react-router-dom"
const WaitDelivery = ({ data }) => {
    return (
        <div className="container">
            {
                data.filter(item => item.status === 'confirm').map(function (myOder, index) {
                    return (
                        <div className="myoder">
                            <div className="image">
                                <Link to={`/confirmationProduct/${myOder._id}`}> <img src={myOder.image} alt="" /></Link>
                            </div>
                            <div className="informationmyOder">
                                <div className="nameProduct">{myOder.name}</div>

                                <div>
                                    <span>Số lượng :</span> {myOder.quantityProduct}
                                </div>
                                <div className="buyDate"><span>ngày đặt:</span> {myOder.createdAt}</div>
                                <div className="intoMoney"><span>thành tiền : </span>{myOder.totalMoney}</div>
                                <div className="option">
                                    <Link to={`/confirmationProduct/${myOder.idProduct}`}> <button className="buyAgain">xem sản phẩm</button></Link>
                                    <button onClick={()=>{}} className="contact">liên hệ người bán</button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default WaitDelivery