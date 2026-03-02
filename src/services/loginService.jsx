// import { BedSharp } from "@mui/icons-material";
import axios from "axios";
import {API_URL} from "config/config.js";
const loginService = async (credentials) => {
    try {
        const response = await axios.post(API_URL + "/login", credentials);
        return response;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

export default loginService;




