import React from "react";
import { Link } from "react-router-dom";
import { useNavigationGuard } from "../../context/NavigationGuardContext";

const ProtectedLink = ({ to, children, ...props }) => {
  const { handleNavigation } = useNavigationGuard();

  const handleClick = (e) => {
    e.preventDefault();
    handleNavigation(to);
  };

  return (
    <Link to={to} onClick={handleClick} data-protected-link="true" {...props}>
      {children}
    </Link>
  );
};

export default ProtectedLink;

