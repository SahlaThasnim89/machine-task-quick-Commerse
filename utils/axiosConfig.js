import axios from "axios";
const axiosConfig=axios.create()

axiosConfig.interceptors.request.use(
    (config)=>{
        if(typeof window!=='undefined'){
            const token=localStorage.getItem('token');
            if(token){
                config.headers.Authorization=`Bearer ${token}`
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
)
export default axiosConfig;