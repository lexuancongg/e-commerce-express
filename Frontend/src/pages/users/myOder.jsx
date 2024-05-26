import { useContext, useState, useEffect } from "react";
import AllmyOder from "../../components/myoder/allMyoder";
import WaitConfirm from "../../components/myoder/waitConfirm";
import WaitDelivery from "../../components/myoder/waitDelivery";
import DoneOders from "../../components/myoder/doneODers";
import Cancelled from "../../components/myoder/cancelled";
import getToken from "../../until/gettoken";
const MyOder = () => {
  
    const items = [
        { title: "AllmyOder", element: AllmyOder }, { title: "WaitConfirm", element: WaitConfirm },
        { title: "WaitDelivery", element: WaitDelivery }, { title: "DoneOders", element: DoneOders }, { title: "Cancelled", element: Cancelled }
    ]
    const [category, setCategory] = useState("AllmyOder");
    const [listMyOder, setListMyOder] = useState([]);
    const token = getToken()
    useEffect(function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        const fetchData = () => {
            fetch(`http://localhost:3000/myOder`, {
                method: 'get',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(function (responseMyoder) {
                if (responseMyoder.ok) { return responseMyoder.json() }
            }).then((dataMyOder) => setListMyOder(dataMyOder)
            ).catch(function (err) {
                console.log(err)
            })
        }
        fetchData();
        activeMenu()
    }, [token])
    // hàm lựa chọn menu
    const activeMenu = () => {
        const chooseMenu = document.querySelectorAll(".spaceMyoder .menu div");
        const line = document.querySelector(".line");
        
        Array.from(chooseMenu).forEach((item, index) => {
            // cài đặt sự kiện
            item.onclick = function () {
                line.style.left = this.offsetLeft + 'px';
                line.style.width = this.offsetWidth + 'px';
                setCategory(items[index].title)
            }
        })
    }
    return (
        <div className="spaceMyoder">
            <div  className="container">
                <div className="menu " >
                    <div  className="active">Tất cả</div>
                    <div>Chờ xác nhận</div>
                    <div>Chờ nhận hàng</div>
                    <div>Hoàn thành</div>
                    <div>Đã hủy</div>
                    <div className="line"></div>
                </div>
                <div className="spaceMyBills">
                    {items.map(item => {
                        if (item.title === category) return <item.element data={listMyOder} setListMyOder={setListMyOder} />
                    })}
                </div>
            </div>
        </div >
    )
}

export default MyOder;