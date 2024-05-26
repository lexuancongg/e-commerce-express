import { memo } from "react"
import { useNavigate } from 'react-router-dom';
const Category = ({listCategorys}) => {
    
    const navigate = useNavigate();
    return (
        <div className="categoryBody">
            {listCategorys && listCategorys.map((category, index) => {
                return (
                    <div key={index} onClick={() => navigate(`/category/${category.name}`)} className="category-item">
                        <div className="image">
                            <img src={category.avatar} alt="" />
                        </div>
                        <div className="name">
                            {category.name}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default memo(Category)
