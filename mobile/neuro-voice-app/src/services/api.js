import axios from "axios";

const API = axios.create({
  baseURL: " http://10.38.12.175:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;