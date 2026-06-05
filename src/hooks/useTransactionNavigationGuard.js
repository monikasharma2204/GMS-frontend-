import { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useNavigationGuard } from "../context/NavigationGuardContext";

// Transaction page paths that should be protected
const TRANSACTION_PATHS = [
  "/quotation",
  "/reserve",
  "/purchase-order/purchase",
  "/purchase-order/purchase-order",
  "/memo/memo-out",
  "/memo/memo-return",
  "/memo/memo-out-return",
  "/memo/memo-in",
  "/sale",
  "/inventory/load",
  "/finance/outstandingreceivble",
  "/finance/outstandingpayable",
];

const useTransactionNavigationGuard = (isDirty, cleanupCallback) => {
  const { setDirty, registerCleanup } = useNavigationGuard();
  const location = useLocation();

  const isTransactionPage = TRANSACTION_PATHS.includes(location.pathname);


  useEffect(() => {
    if (isTransactionPage && cleanupCallback) {
      registerCleanup(cleanupCallback);
    }
    return () => {
      if (isTransactionPage) {
        registerCleanup(null);
      }
    };
  }, [isTransactionPage, cleanupCallback, registerCleanup]);

  useEffect(() => {
    if (isTransactionPage) {
      setDirty(isDirty);
    }

    return () => {
      if (isTransactionPage) {
        setDirty(false);
      }
    };
  }, [isDirty, isTransactionPage, setDirty]);


  useEffect(() => {
    return () => {
      if (isTransactionPage) {
        setDirty(false);
      }
    };
  }, [isTransactionPage, setDirty]);
};

export default useTransactionNavigationGuard;

