import axios from 'axios';

const API_URL = process.env.VUE_APP_BACKEND_URL;

const checkToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return false;
        }
        const valid = await axios.get(API_URL + '/token/isvalid', {
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
