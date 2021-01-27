import api from "../utils/api";
import {ls} from "../utils/api";
import {ILogin, IRegister}  from "../components/auth/types";


export async function login(loginUser: ILogin){
    const {data} = await api.post(`auth/login`,loginUser);
    ls.set('token', data.token);
    return data.user;
}

export async function register(registerUser: IRegister){
    const {data} = await api.post(`auth/register`, registerUser);
    return data
}