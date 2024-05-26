import { memo } from "react"
import { useNavigate } from "react-router-dom"
import formatCurrency from '../../until/formatMoney.js'
const ListProducts = ({ listProducts }) => {
    const navigate = useNavigate();
    const fc_nextPage = (idProduct) => navigate(`/confirmationProduct/${idProduct}`)
    return (
        <div>
            <div className="suggest">
                <h5>GỢI Ý HÔM NAY</h5>
            </div>
            <div className="row">
                {listProducts && listProducts.map(function (product, index) {
                    return (
                        <div className='col-lg-2 items' key={product._id} >
                            <div class="card" onClick={() => fc_nextPage(product._id)}>
                                <img src={product.image} class="card-img-top" alt="..." />
                                <div class="card-body">
                                    <div class="card-title">{product.name}</div>
                                    <p className='priceProduct'>{formatCurrency(product.price, 'VND')}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default memo(ListProducts)