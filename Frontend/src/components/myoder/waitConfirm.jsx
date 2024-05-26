import React from "react"
import { Link } from "react-router-dom"
const WaitConfirm = ({ data, setListMyOder }) => {
    const [ws, setWs] = React.useState(null)
    React.useEffect(() => {
        const wws = new WebSocket(`ws://localhost:3000/cancelOder`);
        wws.onopen = function (event) {
            setWs(wws);
        };
        wws.onmessage = function (event) {
            const idBill = JSON.parse(event.data).idBill;
            setListMyOder(prev => prev.map(item => {
                if (item.idBill === idBill) {
                    return { ...item, status: 'cancel' }
                }
                return item;
            }))
        };
        return () => { wws.close() }
    }, [])
    const handelCancalOder = (idBill) => {
        if (ws) {
            ws.send(JSON.stringify({ idBill, type: "cancelOder" }))
        }
    }
    return (
        <div className="container">
            {
                data.filter(item => item.status === 'Normal').map(function (myOder, index) {
                    return (
                        <div className="myoder">
                            <div className="image">
                                <Link to={`/confirmationProduct/${myOder.idProduct}`}> <img src={myOder.image} alt="" /></Link>
                            </div>
                            <div className="informationmyOder">
                                <div className="nameProduct">{myOder.name}</div>

                                <div>
                                    <span>Số lượng :</span> {myOder.quantityProduct}
                                </div>
                                <div className="buyDate"><span>ngày đặt:</span> {myOder.createdAt}</div>
                                <div className="intoMoney"><span>thành tiền : </span>{myOder.totalMoney}</div>
                                <div className="option">
                                    <button onClick={() => handelCancalOder(myOder.idBill)} className="buyAgain">hủy đơn hàng</button>
                                    <button className="contact">liên hệ người bán</button>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}
export default WaitConfirm