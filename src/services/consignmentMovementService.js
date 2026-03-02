import axios from "axios";
import { API_URL } from "../config/config.js";

export const getConsignmentMovements = async () => {
  try {
    const response = await axios.get(`${API_URL}/consignment-movement`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch consignment movements", error);
    if (error.response) {
      throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const getConsignmentMovementByInvoiceNo = async (invoiceNo) => {
  try {
    const response = await axios.get(`${API_URL}/consignment-movement/${invoiceNo}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch consignment movement details", error);
    if (error.response) {
      throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};
