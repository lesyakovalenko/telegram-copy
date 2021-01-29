import api from "../utils/api";

export async function findChatWithUser(userId: string){
    const {data} = await api.get('chat', {
        params: {
            userId: userId
        }
    })
    return data;
}

export async function getChatListByUser(){
    const {data} = await api.get('chat/list');
    return data.joinedChatRooms;
}

export async function createNewChat(userId: string){
    const {data}= await  api.post('chat/create',{userId});
    return data;
}

export async function getMessagesList(chatRoomId: string){
    console.log('getMessagesList',chatRoomId)
    const {data}= await  api.get('chat/messagesList',{
        params: {
            chatRoomId: chatRoomId
        }
    });
    console.log(data)
    return data;
}