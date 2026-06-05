import { useState, useMemo } from 'react';
import moment from 'moment';

const useTableSort = (data, defaultSort = { key: 'createdAt', direction: 'desc' }) => {
  const [sortConfig, setSortConfig] = useState({
    key: defaultSort.key,
    direction: 'default',
  });

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const getAccountValue = (item) => {
          if (!item || !item.account) return "";
          return typeof item.account === 'object' ? item.account?.vendor_code_name || "" : item.account;
        };
        const aValue = sortConfig.key === 'account' ? getAccountValue(a) : a[sortConfig.key];
        const bValue = sortConfig.key === 'account' ? getAccountValue(b) : b[sortConfig.key];

        const compare = (v1, v2) => {
          if (!v1 && !v2) return 0;
          if (!v1) return 1;
          if (!v2) return -1;

          const m1 = moment(v1, ["YYYY-MM-DDTHH:mm:ss.SSSZ", "YYYY-MM-DD", "DD/MM/YYYY"]);
          const m2 = moment(v2, ["YYYY-MM-DDTHH:mm:ss.SSSZ", "YYYY-MM-DD", "DD/MM/YYYY"]);

          if (m1.isValid() && m2.isValid()) {
            return m1.valueOf() - m2.valueOf();
          }

          if (typeof v1 === 'string' && typeof v2 === 'string') {
            return v1.localeCompare(v2);
          }

          return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
        };

        const result = compare(aValue, bValue);

        const isAsc = sortConfig.direction === "asc" || (sortConfig.direction === "default" && defaultSort.direction === "asc");

        if (result !== 0) {
          return isAsc ? result : -result;
        }

        const secondaryResult = compare(a.createdAt, b.createdAt);
        return isAsc ? secondaryResult : -secondaryResult;
      });
    }
    return sortableItems;
  }, [data, sortConfig, defaultSort.direction]);

  const requestSort = (key) => {
    if (sortConfig.key !== key) {
      setSortConfig({ key, direction: 'asc' });
    } else {
      if (sortConfig.direction === 'default') {
        setSortConfig({ key, direction: 'asc' });
      } else if (sortConfig.direction === 'asc') {
        setSortConfig({ key, direction: 'desc' });
      } else {
        setSortConfig({ key: defaultSort.key, direction: 'default' });
      }
    }
  };

  return { sortedData, requestSort, sortConfig, setSortConfig };
};

export default useTableSort;
