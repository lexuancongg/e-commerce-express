import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import getToken from "../../../until/gettoken";

const Edit = () => {
    const navigate = useNavigate();
    // lấy ra id truyền theo url
    const { id } = useParams();
    const [data, setdata] = React.useState({});
    const token = getToken();
    const hendalOnchange = function (e) {
        const { name, value } = e.target;
        setdata(prevData => (
            {
                ...prevData,
                [name]: value
            }
        ))
    }
    React.useEffect(function () {
       
        fetch(`http://localhost:3000/admin/getInformationProduct/${id}`, {
            mode: 'cors',
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`); // Hoặc xử lý lỗi ở đây
                }
                return response.json();
            })
            .then(data => setdata(data))
            .catch(err => {
                console.log('Error:', err.message); // Đây sẽ bắt cả lỗi phân tích cú pháp JSON và các lỗi khác
            });
    }, [token, id]);
    const hendalAddProduct = async (event) => {
        event.preventDefault();
        try {
            const responseAddProduct = await fetch(`http://localhost:3000/admin/edit/${id}`, {
                method: 'put',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
            if (responseAddProduct.ok) {
                navigate('/ProductManagament')
            }
        } catch (error) {
            
        }
    }



    return (
        <div className="SpaceEdit">
            <div className="formEdit">
                <div className="title">
                    <h4>chỉnh sửa thông tin của bạn</h4>
                </div>
                {/* <form  method="POST" action={`http://localhost:3000/admin/edit/${id}?_method=PUT&token=${token}`}> */}
                <form action="" onSubmit={hendalAddProduct}>
                    <div class="mb-3">
                        <label for="name" class="form-label">tên sản phẩm</label>
                        <input
                            value={data.name} name="name" type="text" class="form-control"
                            onChange={hendalOnchange}
                        />
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">giá</label>
                        <input value={data.price} name="price" type="text" class="form-control"
                            onChange={hendalOnchange} />
                    </div>
                    <div class="mb-3">
                        <label for="image" class="form-label">image</label>
                        <input value={data.image} name="image" type="text" class="form-control"
                            onChange={hendalOnchange} />
                    </div>
                    <button type="submit" class="btn btn-primary" >chinh sua</button>
                </form>
            </div>
        </div>

    )
}
export default Edit;