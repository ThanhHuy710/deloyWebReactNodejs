import axios from "axios";

const api =axios.create({
    baseURL:"https://deloywebreactnodejs.onrender.com/api",
})

export default api;