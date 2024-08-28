import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import formatCurrency from "../../until/formatMoney";
const ProductAtCategory = () => {
    const slug = useParams().slug;
    const navigate = useNavigate();
    const [listProduct, setListProduct] = React.useState([]);
    React.useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        fetch(`http://localhost:3000/productAtCategory/${slug}`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json().then(data => setListProduct(data))
            }
            throw new Error();
        }).catch(err => console.log('error'));
    }, [slug])
    const fc_nextPage = (idProduct) => navigate(`/confirmationProduct/${idProduct}`)
    return (
        <div className="listProduct  spaceProductAtCategory">
            <div className="container">
                <div className="suggest">
                    <h5>{slug}</h5>
                </div>
                <div className="row">
                    {listProduct.map(item => {
                        return (
                            <div class="col-lg-2 items">
                                <div onClick={() => fc_nextPage(item._id)} className="card"  >
                                    <img src={item.image} alt="" />
                                    <div class="card-body">
                                        <div class="card-title">{item.name}</div>
                                        <p className="priceProduct">{formatCurrency(item.price, "VND")}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </div>
    );
};

export default ProductAtCategory;
