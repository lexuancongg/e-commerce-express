import React from 'react';
const CreatProduct = () => {
    const token = localStorage.getItem('token');
    const [category, setCategory] = React.useState([]);

    React.useEffect(() => {
       
        fetch("http://localhost:3000/admin/category", {
            method: 'get',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                return response.json().then(data => setCategory(data))
            }
            throw new Error();
        }).catch(err => console.log(err));
    }, [token])
    return (
        <div className="spaceCreateProduct" >
            <div className="createProduct">
                <div className='title'>
                    <h4>thêm sản phẩm</h4>
                </div>
                <form className='formCreateProduct' method="post" action={`http://localhost:3000/admin/create?token=${token}`}>
                    <div class="mb-3">
                        <label for="name" class="form-label">Tên sản phẩm</label>
                        <input id="name" name='name' required type="text" class="form-control" />
                    </div>

                    <div style={{display:'flex'}}>
                        <div style={{marginRight:'10px'}} class="mb-3">
                            <label for="price" class="form-label">Giá bán</label>
                            <input id="price" name='price' required type="text" class="form-control" />
                        </div>
                        <div class="mb-3">
                            <label for="quantity" class="form-label">Số lượng</label>
                            <input id='quantity' required name="quantity" type="number" class="form-control" />
                        </div>

                    </div>
                    <div class="mb-3">
                        <label for="image" class="form-label">Hình ảnh</label>
                        <input id="image" name='image' required type="text" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label for="category" class="form-label">Danh mục</label>
                        <select id="category" name='nameCategory' required type="text" class="form-control" >
                            <option value="">chọn danh mục cho sản phẩm</option>
                            {category.map(item => <option value={item.name}>{item.name}</option>)}
                        </select>
                    </div>

                    <button type="submit" class="btn btn-primary">thêm sản phẩm</button>
                </form>
            </div>
        </div>
    )
}
export default CreatProduct