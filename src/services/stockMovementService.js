import axios from "axios";
import { API_URL } from "../config/config.js";

export const getStockMovements = async () => {
  try {
    const response = await axios.get(`${API_URL}/stock-movement`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stock movements", error);
    
    // Provide more specific error information
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your authentication or permissions.');
      } else if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response.status === 404) {
        throw new Error('API endpoint not found. Please check the URL.');
      } else {
        throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your internet connection and API server.');
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};

export const getStockMovementByStoneCode = async (stoneCode) => {
  try {
    const response = await axios.get(`${API_URL}/stock-movement/${stoneCode}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch stock movement details", error);
    
    // Provide more specific error information
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your authentication or permissions.');
      } else if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
      } else if (error.response.status === 404) {
        throw new Error('Stock movement details not found for this stone code.');
      } else {
        throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your internet connection and API server.');
    } else {
      // Something else happened
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};
