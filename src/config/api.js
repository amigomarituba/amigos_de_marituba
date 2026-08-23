import axios from 'axios'


const instanceAxios = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
})

export { instanceAxios }
