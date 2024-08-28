import { jwtDecode } from "jwt-decode"
const checkToken = (token) => {
    const decodedToken = jwtDecode(token)
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime >= decodedToken.exp) {
        return false;
    }
    return true
}
export default checkToken