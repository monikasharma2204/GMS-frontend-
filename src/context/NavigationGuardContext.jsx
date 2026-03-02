import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UnsavedChangesDialog from "../component/Common/UnsavedChangesDialog";

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
    
    // Only intercept if we're on a transaction page and have unsaved changes
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
      // User chose to leave without saving - clear the state
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

  // Intercept all Link clicks when on a transaction page
  useEffect(() => {
    const isTransactionPage = TRANSACTION_PATHS.includes(location.pathname);
    
    if (!isTransactionPage || !isDirty) {
      return;
    }

    // Intercept all Link clicks
    const handleLinkClick = (e) => {
      // Check if the click is on a Link component
      const linkElement = e.target.closest('a[href]');
      if (linkElement && linkElement.hasAttribute('href')) {
        const href = linkElement.getAttribute('href');
        
        // Only intercept internal navigation (not external links or same page)
        if (href && href.startsWith('/') && href !== location.pathname) {
          // Check if it's not already being handled by ProtectedLink
          if (!linkElement.hasAttribute('data-protected-link')) {
            e.preventDefault();
            e.stopPropagation();
            handleNavigation(href);
          }
        }
      }
    };

    // Add event listener to document to catch all Link clicks
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
      <UnsavedChangesDialog
        open={showDialog}
        onClose={handleDialogClose}
        onConfirm={handleDialogClose}
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

