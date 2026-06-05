import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ConfirmCancelDialog from "../component/Commons/ConfirmCancelDialog";

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

const NavigationGuardContext = createContext(null);

export const NavigationGuardProvider = ({ children }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [cleanupCallback, setCleanupCallback] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isNavigatingRef = useRef(false);

  const setDirty = useCallback((dirty) => {
    setIsDirty(dirty);
  }, []);

  const registerCleanup = useCallback((callback) => {
    setCleanupCallback(callback || null);
  }, []);

  const handleNavigation = useCallback((targetPath) => {
    const isTransactionPage = TRANSACTION_PATHS.includes(location.pathname);


    if (isTransactionPage && isDirty && targetPath !== location.pathname) {
      setPendingNavigation(targetPath);
      setShowDialog(true);
      isNavigatingRef.current = true;
    } else {
      navigate(targetPath);
    }
  }, [isDirty, location.pathname, navigate]);

  const handleDialogClose = useCallback((confirmed) => {
    setShowDialog(false);
    if (confirmed && pendingNavigation) {

      if (cleanupCallback) {
        cleanupCallback();
      }
      setIsDirty(false);
      isNavigatingRef.current = false;
      navigate(pendingNavigation);
      setPendingNavigation(null);
    } else {
      isNavigatingRef.current = false;
      setPendingNavigation(null);
    }
  }, [pendingNavigation, navigate, cleanupCallback]);

  useEffect(() => {
    const isTransactionPage = TRANSACTION_PATHS.includes(location.pathname);

    if (!isTransactionPage || !isDirty) {
      return;
    }


    const handleLinkClick = (e) => {

      const linkElement = e.target.closest('a[href]');
      if (linkElement && linkElement.hasAttribute('href')) {
        const href = linkElement.getAttribute('href');


        if (href && href.startsWith('/') && href !== location.pathname) {

          if (!linkElement.hasAttribute('data-protected-link')) {
            e.preventDefault();
            e.stopPropagation();
            handleNavigation(href);
          }
        }
      }
    };


    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [location.pathname, isDirty, handleNavigation]);

  return (
    <NavigationGuardContext.Provider
      value={{
        isDirty,
        setDirty,
        handleNavigation,
        registerCleanup,
      }}
    >
      {children}
      <ConfirmCancelDialog
        open={showDialog}
        onClose={handleDialogClose}
        title="Unsaved Changes"
        message="You have unsaved changes. If you leave this page, your data will be lost. Are you sure you want to leave?"
        noButtonText="Cancel"
        yesButtonText="Leave without saving"
      />
    </NavigationGuardContext.Provider>
  );
};

export const useNavigationGuard = () => {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    throw new Error("useNavigationGuard must be used within NavigationGuardProvider");
  }
  return context;
};

