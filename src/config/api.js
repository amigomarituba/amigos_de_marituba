import axios from 'axios'

const instanceAxios = axios.create({
  baseURL: "/api",//import.meta.env.VITE_URL_API, 
  timeout: 1000,
})

export { instanceAxios }
