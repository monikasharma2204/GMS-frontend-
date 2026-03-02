import { useState, useEffect, useMemo } from "react";
import { useRecoilState } from "recoil";
import { QuotationtableRowsDropdownData } from "recoil/Load/LoadState";
import apiRequest from "../../../helpers/apiHelper.js";

/**
 * Custom hook for managing dropdown options
 * Dropdown options and related state
 */
export const useDropdownOptions = () => {
  const [dropdownOptions, setDropdownOptions] = useState({});
  const [allDropdownOptions, setAllDropdownOptions] = useRecoilState(
    QuotationtableRowsDropdownData
  );
  const [sublocations, setSublocations] = useState([]);

  // Fetch master data
  const fetchData = async () => {
    try {
      const data = await apiRequest("GET", "/master/all", {}, {});
      return data;
    } catch (e) {
      return [];
    }
  };

  // Fetch sublocations
  const fetchSublocations = async () => {
    try {
      const response = await fetch("http://localhost:3001/sublocations");
      if (!response.ok) {
        throw new Error("Failed to fetch sublocations");
      }
      const data = await response.json();
      return data;
    } catch (e) {
      return [];
    }
  };

  // Initialize data
  useEffect(() => {
    fetchData().then((data) => {
      setAllDropdownOptions(data);
    });
    fetchSublocations().then((data) => {
      setSublocations(data);
    });
  }, []);

  // Process dropdown options
  const dropdownOpts = useMemo(() => {
    const options = {
      stone: [],
      shape: [],
      size: [],
      color: [],
      cutting: [],
      quality: [],
      clarity: [],
      cerType: [],
      location: [],
      unit: [
        { label: "Cts", value: "cts" },
        { label: "Pcs", value: "pcs" },
      ],
      labour: [],
    };

    allDropdownOptions.forEach((item) => {
      switch (item.master_type) {
        case "master_stone_name":
          options.stone.push({ label: item.name, value: item.code });
          break;
        case "master_stone_color":
          options.color.push({ label: item.name, value: item.code });
          break;
        case "master_labour_type":
          options.labour.push({
            label: item.name,
            value: item.code,
          });
          break;
        case "master_stone_shape":
          options.shape.push({ label: item.name, value: item.code });
          break;
        case "master_stone_size":
          options.size.push({ label: item.name, value: item.code });
          break;
        case "master_stone_cutting":
          options.cutting.push({ label: item.name, value: item.code });
          break;
        case "master_stone_quality":
          options.quality.push({ label: item.name, value: item.code });
          break;
        case "master_stone_clarity":
          options.clarity.push({ label: item.name, value: item.code });
          break;
        case "master_certificate_type":
          options.cerType.push({ label: item.name, value: item.code });
          break;
        default:
          break;
      }
    });

    // Map sublocations to dropdown format
    options.location = sublocations.map((loc) => ({
      label: loc.location_name,
      value: loc._id,
    }));

    return options;
  }, [allDropdownOptions, sublocations]);

  useEffect(() => {
    setDropdownOptions(dropdownOpts);
  }, [dropdownOpts]);

  return {
    dropdownOptions,
    allDropdownOptions,
    sublocations,
  };
};
