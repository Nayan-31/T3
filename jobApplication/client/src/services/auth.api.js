import api from '../api/axios';

export async function registeredUser(userData){
    const response = await api.post('/auth/register' , userData)

    return response.data
}

export async function loginUser(credentials){
    const response = await api.post('/auth/login' , credentials)

    return response.data
}

export async function logout(){
    const response = await api.post('/api/logout')

    return response.data
}