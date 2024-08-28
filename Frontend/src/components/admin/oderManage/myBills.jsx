import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "../../../until/formatMoney";
import getToken from "../../../until/gettoken";

const MyBills = () => {
    const [MyBills, SetMyBills] = React.useState([]);
    const token = getToken();
    React.useEffect(function () {
        const fetchDataBills = async () => {
            try {
                const responseDataBills = await fetch("http://localhost:3000/admin/myBills", {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                });
                if (responseDataBills.ok) {
                    const dataBills = await responseDataBills.json();
                    SetMyBills(dataBills)
                    return;
                }
                throw new Error();

            } catch (error) {
                console.log(error)
            }
        }
        fetchDataBills();
        const wws = new WebSocket(`ws://localhost:3000/mybill_admin`);
        wws.onopen = function (event) {
            // setWs(wws);
        };
        wws.onmessage = function (event) {
            const idBill = JSON.parse(event.data).idBill
            SetMyBills(prev => prev.filter(item => item._idbill !== idBill))
        };
        return () => { wws.close() }

    }, [token])
    const fc_confirm = React.useCallback(
        function (idBill) {
            // fetch lên sever 
            fetch(`http://localhost:3000/admin/confirmBill/${idBill}`, {
                method: "delete",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                if (response.ok) {
                    // nếu k có lỗi thì reload lại
                    SetMyBills(prevMybills => prevMybills.filter(item => item._idbill !== idBill))
                } else {
                    throw new Error({ mesage: "có lỗi khi xác nhận đơn hàng " })
                }
            }).catch(function (error) {
                alert("lỗi " + error)
            })
        }, [token]
    )

    return (
        <>
            {MyBills.length > 0 ?
                <div className="spaceMyBills">
                    <div className=" mybill_container">
                        {MyBills.map((bill, index) => {
                            return (
                                <div key={index} className="bill">
                                    <div className="image">
                                        <Link to={`/confirmationProduct/${bill._id}`} >
                                            <img src={bill.image} alt="" />
                                        </Link>

                                    </div>
                                    <div className="informationBill">
                                        <div className="product">
                                            <p> <span>Sản phẩm :</span> {bill.name}</p>
                                            <p><span>Số lượng: </span> {bill.quantityProduct}</p>
                                            <p> <span>Đơn giá :</span> {formatCurrency(bill.price, 'VND')}</p>
                                            <p><span>Tổng tiền :</span>{formatCurrency(bill.totalMoney, "VND")}</p>
                                        </div>
                                        <div className="customer">
                                            <p><span>Tên khách hàng: </span> {bill.fullName}</p>
                                            <p><span>Số điện thoại:</span> {bill.phoneNumberOder}</p>
                                            <p><span>Địa chỉ:</span> {bill.address}</p>
                                            <p><span>Ngày đặt:</span>{bill.dateOder}</p>
                                        </div>

                                    </div>
                                    <button className="confirm" onClick={function () {
                                        fc_confirm(bill._idbill);
                                    }}>xác nhận</button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                :
                <div className="spaceMyBills" style={{ display: "flex", alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontSize: 20 }}>bạn chưa có đơn hàng nào </p>
                </div>
            }
        </>

    )
}
export default MyBills