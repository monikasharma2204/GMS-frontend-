import { useState, useMemo, useEffect } from 'react';

export const useAccountFilter = (data, selectedItemIds, open) => {
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [accountSearch, setAccountSearch] = useState("");
  const [accountSortOrder, setAccountSortOrder] = useState("asc");
  const [selectedAccounts, setSelectedAccounts] = useState(null);

  const handleAccountClick = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAccountAnchorEl(null);
    setAccountSearch("");
  };


  const sourceData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data;
  }, [data]);

  const uniqueAccounts = useMemo(() => {
    const accounts = [...new Set(sourceData.map(item => {
      if (!item) return "";
      const acc = typeof item.account === 'object' ? item.account?.vendor_code_name : item.account;
      return acc || "";
    }))];

    return accounts.sort((a, b) => {
      if (a === b) return 0;
      if (a === "") return 1;
      if (b === "") return -1;
      return a.localeCompare(b);
    });
  }, [sourceData]);


  const activeSelectedAccounts = useMemo(() => {
    return selectedAccounts === null ? uniqueAccounts : selectedAccounts;
  }, [selectedAccounts, uniqueAccounts]);

  const isAllSelected = uniqueAccounts.length > 0 && activeSelectedAccounts.length === uniqueAccounts.length;
  const isSomeSelected = activeSelectedAccounts.length > 0 && activeSelectedAccounts.length < uniqueAccounts.length;

  const handleSelectAllDropdown = () => {
    if (isAllSelected) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(uniqueAccounts);
    }
  };

  const getAccountStatus = (acc) => {
    return activeSelectedAccounts.includes(acc) ? "all" : "none";
  };

  const handleToggleAccount = (acc) => {
    setSelectedAccounts(prev => {
      const current = prev === null ? uniqueAccounts : prev;
      if (current.includes(acc)) {
        return current.filter(a => a !== acc);
      } else {
        return [...current, acc];
      }
    });
  };

  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(item => {
      if (!item) return false;
      const acc = typeof item.account === 'object' ? item.account?.vendor_code_name : item.account;
      const accVal = acc || "";
      return activeSelectedAccounts.includes(accVal);
    });
  }, [data, activeSelectedAccounts]);

  // Reset selectedAccounts when open prop becomes true (modal opens)
  useEffect(() => {
    if (open) {
      setSelectedAccounts(null);
      setAccountSearch("");
    }
  }, [open]);

  const isFilterActive = uniqueAccounts.length > 0 && activeSelectedAccounts.length < uniqueAccounts.length;

  const popoverProps = {
    open: Boolean(accountAnchorEl),
    anchorEl: accountAnchorEl,
    onClose: handleAccountClose,
    accountSortOrder,
    setAccountSortOrder,
    accountSearch,
    setAccountSearch,
    isAllSelected,
    isSomeSelected,
    handleSelectAllDropdown,
    setSelectedItemIds: setSelectedAccounts,
    uniqueAccounts,
    getAccountStatus,
    handleToggleAccount,
  };

  return {
    filteredData,
    handleAccountClick,
    popoverProps,
    isFilterActive,
  };
};
