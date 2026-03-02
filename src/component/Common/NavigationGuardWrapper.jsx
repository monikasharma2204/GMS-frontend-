import React from "react";
import { NavigationGuardProvider } from "../../context/NavigationGuardContext";
import { Outlet } from "react-router-dom";

const NavigationGuardWrapper = () => {
  return (
    <NavigationGuardProvider>
      <Outlet />
    </NavigationGuardProvider>
  );
};

export default NavigationGuardWrapper;

