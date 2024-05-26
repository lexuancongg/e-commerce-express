import React from "react";
import StoreProduct from "../../components/admin/manageProduct/myProducts"
import CreatProduct from "../../components/admin/manageProduct/createProduct";
import BinProducts from "../../components/admin/manageProduct/binProducts"
const ProductManagament = () => {
    const items = [{ title: "Home", element: StoreProduct }, { title: "Thêm sản phẩm", element: CreatProduct }, { title: "Thùng rác", element: BinProducts }]
    const [choose, setChoose] = React.useState("Home")
    const activeMenu = () => {
        const line = document.querySelector(".line");
        const item = document.querySelectorAll(".menuManagement div");
        Array.from(item).forEach(itemElement => {
            itemElement.onclick = function () {
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
        activeMenu()
    }, [])
    return (
        <div className="spaceManagement">
            <div className="container">
                <div className="menuManagement">
                    <div className="Home" onClick={() => setChoose('Home')}>
                        HOME
                    </div>
                    <div className="addProducts" onClick={() => setChoose('Thêm sản phẩm')}>
                        THÊM SẢN PHẨM
                    </div>
                    <div onClick={() => setChoose("Thùng rác")}>
                        THÙNG RÁC
                    </div>
                    <div className="line"></div>
                </div>
                {items.map(item => {
                    if (item.title === choose) {
                        return <item.element></item.element>
                    }
                })}
            </div>
        </div>
    )
}
export default ProductManagament