import axios from "axios";
import {API_URL} from "config/config.js"


const apiRequest = async (type, endpoint, data={},options={}) => {
  try {
    let response;

    switch (type) {
      case 'GET':
        response = await axios.get(`${API_URL}${endpoint}`,options);
        break;
      case 'POST':
        response = await axios.post(`${API_URL}${endpoint}`, data,options);
        break;
      case 'PUT':
        response = await axios.put(`${API_URL}${endpoint}`, data,options);
        break;
      case 'DELETE':
        response = await axios.delete(`${API_URL}${endpoint}`, {
          ...options,
          data: data
        });
        break;
      default:
        throw new Error('Invalid request type');
    }

    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

export default apiRequest;
