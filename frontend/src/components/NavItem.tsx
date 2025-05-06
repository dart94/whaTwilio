import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  label: string;
  route: string;
  icon?: React.ReactNode;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, route, icon, collapsed }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(route);

  return (
    <Link
      to={route}
      className={`flex items-center px-4 py-2 rounded hover:bg-gray-800 transition ${
        isActive ? "bg-gray-800" : ""
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!collapsed && <span className="ml-3 text-sm">{label}</span>}
    </Link>
  );
};

export default NavItem;
