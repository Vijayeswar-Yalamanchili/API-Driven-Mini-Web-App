import axios from 'axios'

let serverBaseURL = import.meta.env.VITE_SERVER_URL

const AxiosService = axios.create({
    baseURL : `${serverBaseURL}`,
    // baseURL : `http://localhost:3000`,
    headers : {
        "Content-Type" :"application/json",
    }
})

AxiosService.interceptors.request.use((config) => {
    const token = localStorage.getItem('loginToken')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},(error) => {
    return Promise.reject(error)
})

export default AxiosService