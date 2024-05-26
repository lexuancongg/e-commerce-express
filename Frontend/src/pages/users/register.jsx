
import React from "react"
import messageAction from "../../until/message";
const Register = () => {
    const [checkked, setChecked] = React.useState(false);

    React.useEffect(function () {
        // checked 
        const checkbox = document.querySelector('.form-check-input');
        checkbox.onchange = function () {
            setChecked(ischecked => !ischecked);
        }
    }, [checkked])

    const henDalRegist = (event) => {
        event.preventDefault();
        const passsWordAgain = document.getElementsByName('againPassword');
        const passWord = document.getElementsByName('passWord');
        // check đã nhập đủ dữ liệu chưa 
        const inputs = document.querySelectorAll('.formRegister input:not([type="checkbox"])');
        const check = Array.from(inputs).every(function (inputElement) {
            return inputElement.value.trim();
        })
        if (!check) {
            alert("Vui lòng nhập đầy đủ thông tin ")
            return

        }
        if (passsWordAgain[0].value.trim() && passWord[0].value.trim()) {
            if (passWord[0].value !== passsWordAgain[0].value) {
                alert('mật khẩu không trùng khớp');
                return
            }
        }
        const formData = new FormData(event.target);
        var data = {}
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        if (!/((09|03|07|08|05)+([0-9]{8})\b)/g.test(data.phoneNumber)) {
            return messageAction(document.querySelector('.toasts'), { type: 'error', title: 'Error Regites', text: 'số điện thoại không hợp lệ' });
        }
        fetch("http://localhost:3000/register", {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(respose => {
            if (!respose.ok) {
                return respose.json();
            }
            messageAction(document.querySelector('.toasts'), { type: 'succes', title: 'Succes Regites', text: 'chúc mừng bạn đã đăng kí thành công' })

        }).then(data => {
            if (data) {
                messageAction(document.querySelector('.toasts'), { type: 'succes', title: 'Succes Regites', text: data.message })
            }
        }).catch(err => messageAction(document.querySelector('.toasts'), { type: 'error', title: 'Error regites', text: 'Đã xảy ra lỗi khi đăng kí' }))

    }
    return (

        <div className="spaceRegister">
           
            <div class="formRegister">
                <div className='title'>
                    <h4>ĐĂNG KÝ</h4>
                </div>
                <form onSubmit={henDalRegist} method="post">
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '10px' }}>
                            <label htmlh="username">Tên đăng nhập:</label>
                            <input name="userName" type="text" class="form-control" id="username" required />
                        </div>
                        <div>
                            <label htmlh="password">Mật khẩu:</label>
                            <input name="passWord" type={checkked ? 'text' : 'password'} class="form-control" id="password" required />
                        </div>
                    </div>
                    <label htmlh="Email">Email:</label>
                    <input name="Email" type="email" class="form-control" id="Email" required />
                    <label htmlh="phoneNumber">số điện thoại:</label>
                    <input name="phoneNumber" type="text" class="form-control" id="phoneNumber" required />
                    <label htmlh="againPassword">Nhập lại mật khẩu:</label>
                    <input name="againPassword" type={checkked ? 'text' : 'password'} class="form-control" id="againPassword" required />
                    <input className="form-check-input" type="checkbox" id="showPassword" />
                    <label className="form-check-label" htmlFor="showPassword">Hiển thị mật khẩu</label>
                    <button type="submit" class="btn btn-primary btn-block btn-register">Đăng Ký</button>
                </form>

            </div>
        </div>

    )
}
export default Register

