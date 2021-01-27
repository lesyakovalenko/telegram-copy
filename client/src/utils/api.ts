import axios from 'axios'
import SecureLS from "secure-ls";

export let ls = new SecureLS();

export const token = ls.get('token');

console.log(token)
if(token){
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
export default axios.create({
    baseURL: `http://localhost:5000/`
})

