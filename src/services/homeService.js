
import axios from "axios";
import {API_URL} from "config/config.js";

export const saveShortcutService = async (data) => {
    try {
        const response = await axios.post(API_URL + "/dashboard-setting", data);
        return response;
    } catch (error) {
        console.error("save shortcut failed", error);
        throw error;
    }
};





