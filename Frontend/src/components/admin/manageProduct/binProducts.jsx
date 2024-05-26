
import React, { useEffect } from "react";
import formatCurrency from "../../../until/formatMoney";
const BinProducts = () => {
    const [products, setProduct] = React.useState([]);
    const token = localStorage.getItem("token");
    const handlePermanentlyDelete = () => {
        const modal = document.getElementById('exampleModal')
            if (modal) {
                modal.addEventListener('show.bs.modal', function (event) {
                    // Button that triggered the modal
                    const button = event.relatedTarget
                    // lấy ra id của nut click 
                    const id_Product = button.getAttribute('data-bs-whatever');
                    const agrreDelete = document.getElementById('agreeDelete');
                    agrreDelete.onclick = function () {
                        const form_delete = document.getElementById('form_delete');
                        form_delete.action = `http://localhost:3000/admin/permanentlyDeleted/${id_Product}?_method=delete&token=${token}`
                        form_delete.submit();
                    }
                })
            }
    };

    const handleRestore = (id_Product) => {
        const form_restore = document.getElementById('form_restore');
        form_restore.action = `http://localhost:3000/admin/restore/${id_Product}?_method=patch&token=${token}`;
        form_restore.submit();
    };


    useEffect(() => {
        const fetchDatas = async () => {
            try {
                const response = await fetch('http://localhost:3000/admin/binProduct', {
                    mode: 'cors',
                    method:"get", 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    });
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                alert(err)
            }
        }
        fetchDatas();
        handlePermanentlyDelete();
    }, []);

    return (
        <div className="SpaceBin ">
            {products.length === 0 ? <p className="mesageBin">không có sản phẩm đã xóa</p> : (
                        <div className="row">   
                            {products.map((product) => (
                                <div className='col-lg-3 items' key={product._id} >
                                    <div className="card" >
                                        <img src={product.image} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <h6 className="card-title">{product.name}</h6>
                                            <p>{formatCurrency(product.price,"VND")} VNĐ</p>
                                            <div className="opptionBinproduct">
                                                <button className="btn btn-primary restore" onClick={() => handleRestore(product._id)}>Khôi phục</button>
                                                <button className="btn btn-danger delete" data-bs-whatever={product._id}
                                                    data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                   
                                                >Xóa vĩnh viễn</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
            )}

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Xác nhận xóa</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc chắn muốn xóa vĩnh viễn không
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" id="agreeDelete" data-bs-dismiss="modal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <form method="post" id="form_restore"></form>
            <form method="post" id="form_delete"></form>
        </div>
    );
};

export default BinProducts;
 

