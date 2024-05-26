
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode';
import getToken from '../../until/gettoken';
import Category from '../../components/home/category';
import Slide from '../../components/home/slide';
import Top3Products from '../../components/home/top3Products';
import ListProducts from '../../components/home/listProducts';

const Home = () => {
    const navigate = useNavigate();
    const token = getToken();
    const modalViewAddCategory = useRef();
    const [data, setData] = useState({});
    const [addCategory, setAddCategory] = useState(false)
    const [dataAddCategory, setDataAddCategory] = useState({})
    const [page, setPage] = useState(1);
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Tạo hiệu ứng cuộn mượt
        });
        fetch(`http://localhost:3000`, {
            mode: 'cors',
            method: 'get', headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.log(error));
    }, [page]);

    const handelAddCategory = useCallback(
        () => {
            modalViewAddCategory.current.classList.add("active")
            setAddCategory(true)
        }, []
    )
    const handelCanel = useCallback(
        () => {
            modalViewAddCategory.current.classList.remove("active")
            setAddCategory(false)
        }, []
    )


    const handelAdd = useCallback(
        (event) => {
            event.preventDefault();
            fetch("http://localhost:3000/admin/addcategory", {
                method: "POST",
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataAddCategory)
            }).then(response => {
                if (response.ok) {
                    setAddCategory(false)
                    modalViewAddCategory.current.classList.remove("active");
                    return setData(prevData => ({ ...prevData, listCategorys: [...prevData.listCategorys, dataAddCategory] }));
                }
                throw new Error("lỗi")
            }).catch(err => console.log(err))
        }, [dataAddCategory, token, data]
    )
    const handelInsert = useCallback(
        (event) => {
            setDataAddCategory(function (prevData) {
                return {
                    ...prevData,
                    [event.target.name]: event.target.value
                }
            })
        }
        , []
    )
    return (
        <>
            <Slide listProducts={data.listProducts}></Slide>

            <div className='listProduct'>
                <div className="container">
                    <div className="category">
                        <h5>DANH MỤC</h5>
                        {(token && jwtDecode(token).role === "admin") && (
                            <div onClick={handelAddCategory} className="logoadd">
                                <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" stroke-width="2">
                                        <line x1="12" y1="2" x2="12" y2="22" />
                                        <line x1="2" y1="12" x2="22" y2="12" />
                                    </g>
                                </svg>
                            </div>
                        )}
                    </div>
                    <Category listCategorys={data.listCategorys}></Category>
                    <Top3Products top3Product={data.top3Product}></Top3Products>
                    <ListProducts listProducts={data.listProducts}></ListProducts>

                </div>
                <div className="seeMore">
                    <div onClick={() => navigate(`/listProduct/page=${page + 1}`)} className="div">Xem thêm</div>
                </div>
            </div>


            {addCategory && (
                <div className="overlay"></div>
            )}
            <div ref={modalViewAddCategory} className="modalAddcategory">
                <div className="title">
                    THÊM DANH MỤC
                </div>
                <form onSubmit={handelAdd} className="addCategory ">
                    <label htmlFor="name">tên danh mục</label>
                    <input onChange={handelInsert} type="text" id='name' name="name" required placeholder="nhập tên danh mục" />
                    <label htmlFor="avatar">hình ảnh</label>
                    <input onChange={handelInsert} type="text" id='avatar' required name="avatar" placeholder="ảnh đại diện" />
                    <button type='button' onClick={handelCanel}>Hủy</button>
                    <button type="submit" onClick={handelAdd}  >Lưu</button>
                </form>

            </div>
        </>
    );
}
export default Home;




















// const Modal_View = React.memo(
//     () => {
//         console.log(5)
//         return (
//             <div className="modalAddcategory">
//                 <div className="title">
//                     THÊM DANH MỤC
//                 </div>
//                 <form onSubmit={handelAdd} className="addCategory ">
//                     <label htmlFor="name">tên danh mục</label>
//                     <input onChange={handelInsert} type="text" id='name' name="name" required placeholder="nhập tên danh mục" />
//                     <label htmlFor="avatar">hình ảnh</label>
//                     <input onChange={handelInsert} type="text" id='avatar' required name="avatar" placeholder="ảnh đại diện" />
//                     <button type='button' onClick={handelCanel}>Hủy</button>
//                     <button type="submit" onClick={handelAdd}  >Lưu</button>
//                 </form>
//             </div>

//         )
//     })