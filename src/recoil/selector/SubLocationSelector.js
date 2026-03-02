import { selector } from "recoil";
import apiRequest from "helpers/apiHelper";

export const getSubLocationInfo = selector({
  key: "getSubLocationInfo",
  get: async () => {
    try {
      const response = await apiRequest("GET", "/sublocations");
      if (!response || response.error) {
        throw new Error(response?.error || "Invalid response");
      }

      // Create a mapping object from ID to location name
      const locationMapping = {};
      response.forEach(location => {
        locationMapping[location._id] = location.location_name;
      });

      return {
        rawData: response,
        mapping: locationMapping
      };
    } catch (error) {
      console.error("Error fetching sublocation info:", error);
      return {
        rawData: [],
        mapping: {}
      };
    }
  },
});
