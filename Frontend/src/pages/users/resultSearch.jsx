import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import formatCurrency from "../../until/formatMoney";

const ResultSearch = () => {
    const [listResultProducts, setListResultProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const fc_nextPage = useCallback((_idProduct) => {
        navigate(`/confirmationProduct/${_idProduct}`);
    }, [navigate]);


    useEffect(() => {
        console.log("tìm i")
        // Hàm để lấy giá trị của cookie
        function getCookie(cookieName) {
            const name = cookieName + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookieArray = decodedCookie.split(';');

            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }

            return null;
        }

        // Hàm để xóa cookie
        function deleteCookie(cookieName) {
            document.cookie = cookieName + '=; Max-Age=0; path=/;';
        }

        // Kiểm tra giá trị cookie khi component được mount
        const resultSearchCookie = getCookie('resultSearch');
        console.log(resultSearchCookie)

        if (resultSearchCookie) {
            try {
                const decodedResult = JSON.parse(resultSearchCookie);
                setListResultProducts(decodedResult);
                deleteCookie('resultSearch'); // Xóa cookie sau khi đọc
            } catch (e) {
                console.error("Error parsing resultSearch cookie:", e);
            }
        }

        setIsLoading(false); // Kết thúc quá trình tải
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='listProduct spaceResult'>
            <div className="container">
                <div className="suggest">
                    <h5>KẾT QUẢ TÌM KIẾM</h5>
                </div>
                <div className="row">
                    {listResultProducts.map((product) => (
                        <div className='col-lg-2 items' key={product._id}>
                            <div className="card" onClick={() => fc_nextPage(product._id)}>
                                <img src={product.image} className="card-img-top" alt={product.name} />
                                <div className="card-body">
                                    <div className="card-title">{product.name}</div>
                                    <p className='priceProduct'>{formatCurrency(product.price, "VND")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ResultSearch;
