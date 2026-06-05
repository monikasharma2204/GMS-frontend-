import { useState, useMemo, useEffect } from 'react';

export const useColumnFilters = (data, open) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColumnKey, setActiveColumnKey] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  // Reset states when the modal is closed/opened
  useEffect(() => {
    if (open) {
      setFilters({});
      setActiveColumnKey(null);
      setAnchorEl(null);
      setSearchQuery("");
    }
  }, [open]);

  const handleFilterClick = (event, columnKey) => {
    setActiveColumnKey(columnKey);
    setAnchorEl(event.currentTarget);
    setSearchQuery("");
  };

  const handleFilterClose = () => {
    setActiveColumnKey(null);
    setAnchorEl(null);
    setSearchQuery("");
  };

  const sourceData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data;
  }, [data]);

  // Dynamically compute unique values for the active column key from the whole dataset
  const uniqueValues = useMemo(() => {
    if (!activeColumnKey) return [];
    const values = [...new Set(sourceData.map(item => {
      if (!item) return "";
      const val = item[activeColumnKey];
      return val === undefined || val === null ? "" : String(val);
    }))];

    return values.sort((a, b) => {
      if (a === b) return 0;
      if (a === "") return 1;
      if (b === "") return -1;
      const numA = parseFloat(a);
      const numB = parseFloat(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
  }, [sourceData, activeColumnKey]);

  // Get selected values for the active column
  const activeSelectedValues = useMemo(() => {
    if (!activeColumnKey) return [];
    const currentFilter = filters[activeColumnKey];
    return currentFilter === undefined || currentFilter === null ? uniqueValues : currentFilter;
  }, [filters, activeColumnKey, uniqueValues]);

  const isAllSelected = uniqueValues.length > 0 && activeSelectedValues.length === uniqueValues.length;
  const isSomeSelected = activeSelectedValues.length > 0 && activeSelectedValues.length < uniqueValues.length;

  const handleSelectAllDropdown = () => {
    if (isAllSelected) {
      setFilters(prev => ({
        ...prev,
        [activeColumnKey]: []
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [activeColumnKey]: uniqueValues
      }));
    }
  };

  const getStatus = (val) => {
    const valStr = String(val);
    return activeSelectedValues.includes(valStr) ? "all" : "none";
  };

  const handleToggleValue = (val) => {
    const valStr = String(val);
    setFilters(prev => {
      const current = prev[activeColumnKey] === undefined || prev[activeColumnKey] === null ? uniqueValues : prev[activeColumnKey];
      let next;
      if (current.includes(valStr)) {
        next = current.filter(v => v !== valStr);
      } else {
        next = [...current, valStr];
      }
      return {
        ...prev,
        [activeColumnKey]: next
      };
    });
  };

  const clearFilter = () => {
    if (!activeColumnKey) return;
    setFilters(prev => ({
      ...prev,
      [activeColumnKey]: null
    }));
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      if (!item) return false;
      for (const [colKey, selectedList] of Object.entries(filters)) {
        if (selectedList === null || selectedList === undefined) continue;
        const itemVal = item[colKey];
        const itemValStr = itemVal === undefined || itemVal === null ? "" : String(itemVal);
        if (!selectedList.includes(itemValStr)) {
          return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  // Check if a column has an active filter applied
  const isFilterActive = (colKey) => {
    const selectedList = filters[colKey];
    if (selectedList === undefined || selectedList === null) return false;

    const allVals = [...new Set(sourceData.map(item => {
      if (!item) return "";
      const val = item[colKey];
      return val === undefined || val === null ? "" : String(val);
    }))];

    return selectedList.length < allVals.length;
  };

  const popoverProps = {
    open: Boolean(anchorEl),
    anchorEl,
    onClose: handleFilterClose,
    activeColumnKey,
    searchQuery,
    setSearchQuery,
    isAllSelected,
    isSomeSelected,
    handleSelectAllDropdown,
    uniqueValues,
    getStatus,
    handleToggleValue,
    clearFilter,
  };

  return {
    filteredData,
    handleFilterClick,
    popoverProps,
    isFilterActive,
    filters,
    setFilters,
  };
};
