import React from "react";
import getToken from "../../until/gettoken";
import messageAction from "../../until/message";

const MyAccount = () => {
    const token = getToken();
    const [dataAccount, setDataAccount] = React.useState({})


    // fetch data 
    const hendalUpAvatar = function (event) {
        const inputUpImage = document.querySelector("input[type=file]");
        inputUpImage.click();
    }

    const handalSelectFile = (event) => {
        const fileSelected = event.target.files[0];

        if (fileSelected) {
            const reader = new FileReader();
            reader.onload = function () {
                const img = new Image();
                img.src = reader.result;
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    // Xác định kích thước mới (ví dụ: 300x300)
                    const newWidth = 300;
                    const newHeight = 300;

                   
                    const ratio = Math.min(newWidth / img.width, newHeight / img.height);

                   
                    const targetWidth = img.width * ratio;
                    const targetHeight = img.height * ratio;

                   
                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Vẽ lại ảnh trên canvas với kích thước mới
                    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

                    // Convert canvas thành dữ liệu URL và lưu vào state
                    const newDataURL = canvas.toDataURL('image/jpeg', 0.8);

                    setDataAccount((prevDataAccount) => ({
                        ...prevDataAccount,
                        avatar: newDataURL,
                    }));
                };
            };

            reader.readAsDataURL(fileSelected);
        }
    };

    React.useEffect(() => {
        const fetchDataAccount = async () => {
            const responsefetchDataAccount = await fetch(`http://localhost:3000/myAccount`, {
                method:'get',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (responsefetchDataAccount.ok) {
                setDataAccount(await responsefetchDataAccount.json())
            }
            throw new Error({ message: "có lỗi xảy ra khi lấy thông tin tài khoản" })
        }

        fetchDataAccount().catch(err => { console.log(err) })
    }, [token])
    const henDalSaveDataAccount = () => {
        fetch("http://localhost:3000/saveDataAboutAccount", {
            method: "PATCH",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dataAccount)
        }).then(response => {
            if (response.ok) {
                messageAction(document.querySelector(".toasts"),{text:"bạn đã cập nhật thành công",title:"Cập nhật",type:"succes"})

            } else {

            }
        }).catch(err => console.log(err))
    }

    return (
        <div className="spaceMyaccount">
            <div className="toasts"></div>
            <div className="container">
                <div className="accountinformation">
                    <div className="navbar">
                        <div className="Account">
                            <div className="logoAccount">
                                {dataAccount.avatar ? (
                                    <img src={dataAccount.avatar} alt="" />
                                ) : <svg className="logo" enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" class="shopee-svg-icon icon-headshot"><g><circle cx="7.5" cy="4.5" fill="none" r="3.8" stroke-miterlimit="10"></circle><path d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke-linecap="round" stroke-miterlimit="10"></path></g></svg>}
                            </div>
                            <div className="nameAccount">
                                <p>
                                    {dataAccount.userName}
                                </p>
                                <span>sửa hồ sơ</span>
                            </div>
                        </div>

                    </div>
                    <div className="informationAccountMain">
                        <div className="title">
                            <span>Hồ sơ của tôi</span>
                            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <div className="mainContent">
                            <div className="informationAccount">
                                <div className="item">
                                    <div>tên đăng nhập</div>
                                    <input value={dataAccount.userName} type="text" name="nameAccount" id="" />
                                </div>
                                <div className="item">
                                    <div>tên </div>
                                    <p>{dataAccount.name}</p>
                                </div>
                                <div className="item">
                                    <div>Email</div>
                                    <input type="text" value={dataAccount.Email} />
                                </div>
                                <div className="item">
                                    <div>Số điện thoại</div>
                                    <input type="text" name="" id="" value={dataAccount.phoneNumber} />
                                </div>
                                <div className="item ">
                                    <div>giới tính</div>
                                    <div className="gender">
                                        <label for="boy">Nam</label>
                                        <input type="radio" id="boy" name="gender" value="Nam" />

                                        <label for="girl">Nữ</label>
                                        <input type="radio" id="girl" name="gender" value="Nữ" />

                                        <label for="diffrien">Khác</label>
                                        <input type="radio" id="diffrien" name="gender" value="Khác" />

                                    </div>
                                </div>
                                <div className="item">
                                    <div>Ngày sinh</div>
                                    <input type="text" name="date of birth" />
                                </div>
                                <div className="item">
                                    <div></div>
                                    <button onClick={henDalSaveDataAccount} className="save">lưu</button>
                                </div>
                            </div>
                            <div className="loadImage">
                                <div className="body">
                                    <div className="blockSvg">
                                        {dataAccount.avatar ? <img src={dataAccount.avatar} alt="" /> : <svg enable-background="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" class="shopee-svg-icon tHTenE icon-headshot"><g><circle cx="7.5" cy="4.5" fill="none" r="3.8" stroke-miterlimit="10"></circle><path d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke-linecap="round" stroke-miterlimit="10"></path></g></svg>}
                                    </div>
                                    <input onChange={handalSelectFile} type="file" style={{ display: 'none' }} />
                                    <button className="btn_upImage" onClick={hendalUpAvatar}>chọn ảnh</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default MyAccount