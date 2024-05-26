import React, { memo, useEffect } from "react"
const Slide = ({ listProducts }) => {
    React.useEffect(() => {
        const slide = document.querySelector(".slide");
        const idInterval = setInterval(() => {
            // document.querySelectorAll(".slide .item").prepend(slide[slide.length -1]);
            const items = document.querySelectorAll(".slide .item");
            slide.append(items[0]);
        }, 2500);
        // khi unmouser
        return () => {
            clearInterval(idInterval);
        }
    }, [listProducts])
    return (
        <div className="spaceSlide">
            <div className="slide">
                {listProducts && listProducts.map((product, index) => {
                    return (
                        <div key={product._id} className="item" style={{ backgroundImage: `url(${product.image})` }}></div>
                    )
                })}
            </div>
        </div>
    )
}

export default memo(Slide)