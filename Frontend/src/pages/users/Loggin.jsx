// LoginForm.js
import  { useState ,useCallback } from 'react';
import messageAction from '../../until/message';
const LoginForm = () => {
    const [informationAccount, setInformationAccount] = useState({})
    const [showPassword, setShowPassword] = useState(false);
    const hendalOnchangeInput = useCallback(
        (event) => {
            setInformationAccount(prevData => (
                {
                    ...prevData,
                    [event.target.name]: event.target.value
                }
            ))
        }, [informationAccount]
    )
    const handleLogin = async (event) => {
        event.preventDefault();
        fetch('http://localhost:3000/login', {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(informationAccount),
        })
            .then(responseServer => responseServer.json())
            .then(dataResponse => {
                // kiểm tra xem respont có lỗi hay không : hoặc có thể kiểm tra bằng .ok
                if (dataResponse.message) {
                   return messageAction(document.querySelector('.toasts'),{title:"Error Login",type:"error",text:dataResponse.message})
                }
                // lưu token vào trong localstoresr
                localStorage.setItem('token', dataResponse.token)
                // // hoc luu vao cooki  phía cliend trên w3scholl
               window.location.href="/"
            }).catch(function (err) {
                console.log(err)
            })

       
    };

    return (
        <div className='Loggin'>
            
            <div className='formLogin'>
                <form onSubmit={handleLogin} id="loginForm">
                    <div className='title' >
                        <h3 className="text-center">Đăng Nhập</h3>
                    </div>

                    <label htmlFor="userName">tên tài khoản</label>
                    <input
                        type="text" id="userName" name="userName" required value={informationAccount.userName}
                        onChange={hendalOnchangeInput}
                    />
                    <label htmlFor="password">mật khẩu</label>
                    <input
                        type={showPassword ? 'text' : 'password'} id="password" name="passWord" required value={informationAccount.passWord}
                        onChange={hendalOnchangeInput}
                    />
                    <input type="checkbox" id="seePassword" name="seePassword"
                        onChange={() => setShowPassword(!showPassword)}
                    />
                    <label htmlFor="seePassword">xem mật khẩu</label>
                    <input type="submit" value="Login" />
                    <a href="">Forgot Password?</a>
                    <a href="/Register">Don't have an account? Register</a>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;





 // cách viết khác
        // response ở đây chính là promise 
        // const response = await fetch('http://localhost:3000/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(informationAccount),
        // });
        // if (response.ok) {
        //     response.json().then(token => console.log(typeof token))
        // }