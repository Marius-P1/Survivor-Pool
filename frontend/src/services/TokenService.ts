import axios from 'axios';

const checkToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        const valid = await axios.get('http://localhost:3000/token/isvalid', {
            headers : {
            Authorization: `Bearer ${token}`
            }
        });
        if (!valid.data) {
            localStorage.removeItem('token');
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default checkToken;
