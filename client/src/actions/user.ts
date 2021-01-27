import api from "../utils/api";

export async function getUser(){
    const {data} = await api.get('user')
    return data;
}
export async function getUsersList(){
    const {data} = await api.get('user/list')
    return data;
}