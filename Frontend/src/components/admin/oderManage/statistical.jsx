import React from "react"
import { Link } from "react-router-dom";
const Statistical = () => {
    const [bills, setBills] = React.useState([]);
    const token = localStorage.getItem("token");
    React.useEffect(function () {
        const fetchDataBills = async () => {
            const responseBills = await fetch("http://localhost:3000/admin/statistical", {
                method: "get",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if (!responseBills.ok) {
                throw new Error("xảy ra lỗi khi fetch databill")
            }
            const dataBills = await responseBills.json();

            setBills(dataBills)
        }
        fetchDataBills().catch(function (err) {
            console.log(err)
        })
    }, [])
    console.log(bills)

    return (
        <div className="SpaceStatistical" style={{paddingTop:20}}>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col" style={{ width: '5%' }}>stt</th>
                        <th scope="col" style={{ width: '35%' }}> sản phẩm</th>
                        <th scope="col" style={{ width: '10%' }}> khách hàng</th>
                        <th scope="col" style={{ width: '14%' }}>ngày tạo </th>
                        <th scope="col" style={{ width: '10%' }}>xem chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {bills.map((bill, index) => (
                        <tr key={index}>
                            <td >{index + 1}</td>
                            <td className="name" style={{ paddingRight: 100 }}>
                                <Link to={`/confirmationProduct/${bill._id}`}>{bill?.name}</Link>

                            </td>
                            <td>{bill?.fullName}</td>
                            <td>{bill.dateCreated}</td>
                            <td className="seemore"> xem chi tiết</td>
                        </tr>
                    ))}
                   
                </tbody>
            </table>
        </div>

    )
}
export default Statistical