import axios from "axios";

const instanceAxios = axios.create({
    baseURL: '/api/proxy',
    timeout: 1000,
  });
                                           
export {instanceAxios}