import React from "react";
import { Link } from "react-router-dom";
import formatCurrency from "../../../until/formatMoney";
import getToken from "../../../until/gettoken";

const StoreProduct = () => {
    const [products, setProduct] = React.useState([]);
    const token = getToken();
    // call API
    React.useEffect(() => {
      
        // get len sever lấy du lieu
        fetch('http://localhost:3000/admin/myProducts', {
            
            mode: 'cors',
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(data => {
                console.log(data);
                setProduct(data)
            })
            .catch(errot => console.log(errot))
        const exampleModal = document.getElementById('exampleModal')
        if (exampleModal) {
            exampleModal.addEventListener('show.bs.modal', function (event) {
                // Button that triggered the modal
                const button = event.relatedTarget
                // Extract info from data-bs-* attributes
                const id_Product = button.getAttribute('data-bs-whatever')
                const buttonAgreeDelete = document.getElementById('agreeDelete')
                buttonAgreeDelete.onclick = function () {
                    const token = localStorage.getItem('token');
                    const formToDelete = document.getElementById('formToDelete')
                    formToDelete.action = `http://localhost:3000/admin/delete/${id_Product}?_method=DELETE&token=${token}`;
                    formToDelete.submit();
                }
            })
        }
    }, [])
    return (
        <div className="spaceMyproduct">
            <div className="myProducts">
                <div className='row' style={{ marginTop: 20 }}>
                    {products.map((product, index) => (
                        <div className ="col-sm-6 col-lg-3 mb-2" key={product._id} >
                            <div className="card" >
                                <img style={{ objectFit: 'cover', height: 250 }} src={product.image} className="card-img-top" alt="..." />
                                <div className="card-body">
                                    <div className="card-title"> {product.name}</div>
                                    <p className="price"> {formatCurrency(product.price, "VND")} </p>
                                    <div style={{ justifyContent: 'space-around', display: 'flex' }}>
                                        <Link to={`/edit/${product._id}`} className="btn btn-primary">sửa</Link>
                                        <a href={`/delete/${product._id}`} className="btn btn-danger"
                                            data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever={product._id}>
                                            xóa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">xác nhận xóa</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                bạn có chắc chắn muốn xóa không
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary " data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-danger" id="agreeDelete" data-bs-dismiss="modal">delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                <form method="post" id='formToDelete'></form>
            </div>
        </div>
    )
}
export default StoreProduct;