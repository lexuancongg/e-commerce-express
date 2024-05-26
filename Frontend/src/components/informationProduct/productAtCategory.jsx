import { memo } from "react"
import { useParams, useNavigate } from "react-router-dom";

import formatCurrency from "../../until/formatMoney"
const ProductsAtCategory = ({ listProductAtCategory }) => {
    const navigate = useNavigate();
    const fc_nextPage = (idProduct) => navigate(`/confirmationProduct/${idProduct}`)
    return (
        <div className="row">
            {listProductAtCategory?.map(item => {
                return (
                    <div class="col-lg-2 items">
                        <div onClick={() => fc_nextPage(item._id)} className="card">
                            <img src={item.image} alt="" />
                            <div className="card-body">
                                <div class="card-title">
                                    {item.name}
                                </div>
                                <p className="priceProduct">{formatCurrency(item.price, "VND")}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default memo(ProductsAtCategory)