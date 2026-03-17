import axios from "axios";

const instanceAxios = axios.create({
    baseURL: '/api',
    timeout: 1000,
  });
                                          
export {instanceAxios}