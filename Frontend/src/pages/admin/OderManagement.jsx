import React from 'react';
import MyBills from '../../components/admin/oderManage/myBills';
import Statistical from '../../components/admin/oderManage/statistical';
const OderManagement = () => {
    const activeItem = () => {
        const line = document.querySelector(".line");
        const items = document.querySelectorAll(".spaceOderManagement .menu div");
        Array.from(items).forEach(item => {
            item.onclick = function () {
                line.style.left = this.offsetLeft + 'px';
                line.style.width = this.offsetWidth + 'px';
            }
        })
    }
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        activeItem()


    }, []);
    const items = [{ title: "Order awaiting confirmation", element: MyBills }, { title: "all orders", element: Statistical }]
    const [chooseItem, setChooseItem] = React.useState("Order awaiting confirmation");
    return (
        <div className="spaceOderManagement">
            <div className="container">
                <div className="menu">
                    <div onClick={() => setChooseItem("Order awaiting confirmation")}>ĐƠN HÀNG CHỜ XÁC NHẬN</div>
                    <div onClick={() => setChooseItem("all orders")}>TẤT CẢ ĐƠN HÀNG</div>
                    <div className="line"></div>
                </div>
                {items.map(item => {
                    if (item.title === chooseItem) {
                        return <item.element></item.element>
                    }
                })}

            </div>

        </div>
    )
}
export default OderManagement