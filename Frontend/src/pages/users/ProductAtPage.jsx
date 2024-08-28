import { useParams ,useNavigate } from "react-router-dom";
import ListProducts from "../../components/home/listProducts";
import { useEffect, useState } from "react";
const ProductAtPage = () => {
    const navigate = useNavigate();
    const [arrayPage,setArrayPage]=  useState([]);
    const slug = useParams().slug;
    const [listProduct, setListProduct] = useState([])
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        clickPage()
        const getDataListProductAtPage = (async () => {
            try {
                const responseProductAtPage = await fetch(`http://localhost:3000/lisproductAtPage?${slug}`, {
                    method: 'get',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                if (responseProductAtPage.ok) {
                    const dataListProducts = await responseProductAtPage.json();
                    setListProduct(dataListProducts.listProductsAtPage)
                    if (dataListProducts.numberPages) {
                       const page = [];
                       for (let i = 1; i <= dataListProducts.numberPages; i++) {
                            page.push(i);
                        }
                        setArrayPage(page)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        })()
    }, [slug])
    const clickPage =()=>{
        const elementPage= document.querySelectorAll('.page div');
        Array.from(elementPage).forEach((element,index)=>{
            element.onclick = function(){
                const pageCheckked = document.querySelector('.page .active');
                pageCheckked.classList.remove('active');
                this.classList.add('active');
                navigate(`/listProduct/page=${index+1}`)
            }
        })
    }
    return (
        <div className="spaceProductsAtPage">
            <div className="container">
                <ListProducts listProducts={listProduct}></ListProducts>
                <div className="page">
                    {
                        arrayPage.map((item,index)  => 
                        <div  className={slug.split('=')[1]==index+1 ? 'active': ''} >{item}</div>)
                    }
                </div>
            </div>
        </div>
    )
}
export default ProductAtPage














