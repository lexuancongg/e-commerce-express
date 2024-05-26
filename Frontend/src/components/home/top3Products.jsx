import { memo } from "react"
import { useNavigate } from "react-router-dom";
const Top3Products = ({ top3Product }) => {
    const navigate = useNavigate();
    console.log(top3Product)
    return (
        <>
            <div className="top3Product">
                <h5>TOP 3 SẢN PHẨM BÁN CHẠY</h5>
            </div>
            <div className="top3ProductBody">
                {top3Product && top3Product.map(product => {
                    return (
                        <div key={product?._id} onClick={() => navigate(`/confirmationProduct/${product?._id}`)} className="top3ProductBody-item">
                            <div className="image">
                                <img src={product?.image} alt="" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )

}
export default memo(Top3Products)