import axios from 'axios'


const instanceAxios = axios.create({
  baseURL: '/api', //import.meta.env.VITE_URL_API,
})

export { instanceAxios }
