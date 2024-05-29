import React from "react";
import $ from "jquery";
import formatCurrency from "../../until/formatMoney";
import { Link } from "react-router-dom"
const Mycart = ({ children }) => {
    const token = localStorage.getItem("token");
    const [listProductInCart, setListProductInCart] = React.useState([]);
    const [isRender, setIsRender] = React.useState(false)
    // const [dataProductChecked, setDataProductChecked] = React.useState({})
    React.useEffect(function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        fetch(`http://localhost:3000/mycart`, {
            method: 'get',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(messageErr => {
                    throw new Error(messageErr.message);
                })
            }
        }).then(data => setListProductInCart(data)
        ).catch(err => alert(err.message))
    }, [])

    const handalDeleteProductInCard = React.useCallback(
        (idCard) => {
            fetch(`http://localhost:3000/deleteProductInCard/${idCard}`, {
                method: "delete",
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    children(prevQuantity => prevQuantity - 1)
                    return setListProductInCart(listProductInCart.filter(item => item.idCard !== idCard));

                }
            }).catch(err => console.log(err))
        }, [listProductInCart]
    )

    // viết theo jquery
    const handalCheckboxAll = (event) => {
        const inputs = $('.blockinput input');
        // kiểm tra xem có checked hay không 
        //  event.target.checked : cũng được
        const isCheked = $(event.target).prop('checked');
        // đỡ phải set qua bằng map và set item.checked = true;
        inputs.prop('checked', isCheked);

        setIsRender(prev => !prev)
    }

    const handalOnchanInput = () => {
        const checkboxAll = $("#chooseAll");
        // const inputs = $(".blockinput input");
        const countInput = Array.from($(".blockinput input")).length;
        const InputChecked = $('.blockinput input:checked');
        checkboxAll.prop('checked', countInput === InputChecked.length);

        setIsRender(prev => !prev)
    }

    // ĐĂNG KÍ NGOÀI VÒNG ĐỜI CỦA REACT KHIẾN KHI RENDER LẠI THÌ LẮNG NGHE SỰ KIỆN LẠI VÀ LƯU SỰ KIỆN VÀO BỘ NHỚ GÂY NÊN LẮNG NGHE MỘT SỰ KIỆN NHIỀU LẦN VÀ CHẠY NHIỀU LẦN  
    // CHỔ NÀY KHÔNG HIỂU SAO CÓ ĐƯỢC ELEMENT 
    // const deleteChecked = document.querySelector(".deleteChecked");
    // deleteChecked?.addEventListener('click', async () => {
    //     const inputChecked = $('.blockinput input:checked');
    //     const idCardProductChecked = Array.from(inputChecked).map(item => item.id);
    //     // thực hiện xóa lên sever
    //     try {
    //         const response = await fetch('http://localhost:3000/deletedProductCheckedInCard', {
    //             method: "delete", mode: 'cors',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({ idCardProductChecked })
    //         })
    //         if (response.ok) {
    //             // TẠI SAO KHI NHẤN DELETE THÌ TỰ ĐỘNG CHECKED 
    //             $('.blockinput input').prop("checked", false);
    //             children(prev => {
    //                 console.log(prev);
    //                 return prev;
    //             })
    //             return setListProductInCart(prevData => prevData.filter(item => !idCardProductChecked.includes(item.idCard)))
    //         }
    //         throw new Error()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // })
    const HandelDeleteProductChecked = async () => {
        const inputChecked = $('.blockinput input:checked');
        const idCardProductChecked = Array.from(inputChecked).map(item => item.id);
        const checkboxAll = $("#chooseAll");
        // thực hiện xóa lên sever
        try {
            const response = await fetch('http://localhost:3000/deletedProductCheckedInCard', {
                method: "delete", mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idCardProductChecked })
            })
            if (response.ok) {
                // TẠI SAO KHI NHẤN DELETE THÌ TỰ ĐỘNG CHECKED 
                $('.blockinput input').prop("checked", false);
                checkboxAll.prop("checked", false)
                children(prev => prev - idCardProductChecked.length)
                return setListProductInCart(prevData => prevData.filter(item => !idCardProductChecked.includes(item.idCard)))
            }
            throw new Error()
        } catch (error) {
            console.log(error);
        }
    }

    const hanDalOderProductChecked = () => {
        const InputChecked = Array.from($(".blockinput input:checked"));
        const idCardChecked = InputChecked.map(inputElement => inputElement.id);
        const informationOderInCard = listProductInCart.reduce((accumulator, item) => {
            if (idCardChecked.indexOf(item.idCard) !== -1) {
                return [...accumulator, { idProduct: item._id, quantity: item.quantity, price: item.price }]
            }
            return accumulator;
        }, [])

        fetch('http://localhost:3000/OderProductChecked', {
            method: "post", mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ informationOderInCard })
        }).then(response => {
            if (response.ok) {
                return alert("thanh cong")
            }
        }).catch(err => console.log(err))

        // thực hiện mua hàng 

    }
    console.log(listProductInCart)

    return (
        <div className="spaceMycart">
            <div className="container  mybill_container mycart">
                <div className="cart">
                    <h5>GIỎ HÀNG CỦA TÔI</h5>
                </div>
                {listProductInCart.map((product, index) => {
                    return (
                        <div key={index} className="item">
                            <div className="blockinput">
                                <input price={product.price} id={product.idCard} onChange={handalOnchanInput} type="checkbox" />
                            </div>
                            <div className="image">
                                <Link to={ `/confirmationProduct/${product._id}`}   > <img src={product.image} alt="" /></Link>
                            </div>
                            <div className="bodyContent">
                                <div className="name">
                                    {product.name}
                                </div>
                                <div className="childrent changeQuantity">
                                    <button onClick={() => {
                                        const newData = listProductInCart.map(item => {
                                            if (item.idCard === product.idCard) {
                                                return {
                                                    ...item,
                                                    quantity: product.quantity > 1 ? product.quantity - 1 : 1
                                                }
                                            }
                                            return item
                                        })
                                        setListProductInCart(newData)
                                    }}>-</button>
                                    <input type="text" value={product.quantity} />
                                    <button onClick={() => {
                                        const newData = listProductInCart.map(item => {
                                            if (item.idCard === product.idCard) {
                                                return {
                                                    ...item,
                                                    quantity: product.quantity + 1
                                                }
                                            }
                                            return item
                                        })
                                        setListProductInCart(newData)
                                    }}>+</button>
                                </div>
                                <div className="childrent">
                                    {formatCurrency(product.price, "VND")}
                                </div>
                                <div className="childrent delete">
                                    <button onClick={() => {
                                        handalDeleteProductInCard(product.idCard);
                                    }} className="btn">Xóa</button>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div className="section">
                    <div>
                        LỰA CHỌN CỦA BẠN
                    </div>
                    <div>
                    </div>
                    <div>
                        <div>
                            <input onChange={handalCheckboxAll} id="chooseAll" type="checkbox" />
                            <label htmlFor="chooseAll">Chọn Tất Cả</label>
                        </div>
                        <div className="deleteChecked" onClick={HandelDeleteProductChecked}>Xóa</div>
                        <span>Tổng thanh toán ({Array.from($('.blockinput input:checked')).length} Sản phẩm):₫
                            {
                                formatCurrency(listProductInCart.reduce((accumulator, item) => {
                                    if (Array.from($('.blockinput input:checked')).map(inputElement => inputElement.id).includes(item.idCard)) {
                                        return accumulator + item.price * item.quantity
                                    }
                                    return accumulator
                                }, 0), 'VND')
                            }
                        </span>
                        <button onClick={hanDalOderProductChecked}>Mua Hàng</button>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default Mycart