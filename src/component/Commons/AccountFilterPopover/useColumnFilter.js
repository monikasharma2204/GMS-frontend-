import { useEffect, useMemo, useState } from "react";

export const useColumnFilter = (data, open, getValue) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState(null);

  const sourceData = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const uniqueValues = useMemo(() => {
    const values = [...new Set(sourceData.map((item) => getValue(item) || ""))];
    return values.sort((a, b) => {
      if (a === b) return 0;
      if (a === "") return 1;
      if (b === "") return -1;
      return a.localeCompare(b);
    });
  }, [sourceData, getValue]);

  const activeSelectedValues = useMemo(
    () => (selectedValues === null ? uniqueValues : selectedValues),
    [selectedValues, uniqueValues]
  );

  const filteredData = useMemo(
    () => sourceData.filter((item) => activeSelectedValues.includes(getValue(item) || "")),
    [sourceData, activeSelectedValues, getValue]
  );

  useEffect(() => {
    if (open) {
      setAnchorEl(null);
      setSearch("");
      setSelectedValues(null);
    }
  }, [open]);

  const isAllSelected = uniqueValues.length > 0 && activeSelectedValues.length === uniqueValues.length;
  const isSomeSelected = activeSelectedValues.length > 0 && activeSelectedValues.length < uniqueValues.length;

  const handleSelectAllDropdown = () => {
    setSelectedValues(isAllSelected ? [] : uniqueValues);
  };

  const handleToggleValue = (value) => {
    setSelectedValues((prev) => {
      const current = prev === null ? uniqueValues : prev;
      return current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    });
  };

  const popoverProps = {
    open: Boolean(anchorEl),
    anchorEl,
    onClose: () => {
      setAnchorEl(null);
      setSearch("");
    },
    accountSortOrder: "asc",
    setAccountSortOrder: () => {},
    accountSearch: search,
    setAccountSearch: setSearch,
    isAllSelected,
    isSomeSelected,
    handleSelectAllDropdown,
    handleClearFilter: () => setSelectedValues(null),
    setSelectedItemIds: setSelectedValues,
    uniqueAccounts: uniqueValues,
    getAccountStatus: (value) => (activeSelectedValues.includes(value) ? "all" : "none"),
    handleToggleAccount: handleToggleValue,
  };

  return {
    filteredData,
    handleFilterClick: (event) => setAnchorEl(event.currentTarget),
    popoverProps,
    isFilterActive: uniqueValues.length > 0 && activeSelectedValues.length < uniqueValues.length,
  };
};
