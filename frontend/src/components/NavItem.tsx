// src/components/NavItem.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/AdminNav.module.css";

interface NavItemProps {
  label: string;
  route: string;
  icon?: React.ReactNode;
  mobile?: boolean;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  label, 
  route, 
  icon, 
  mobile = false,
  collapsed = false 
}) => {
  const location = useLocation();
  const isActive = location.pathname === route;
  
  return (
    <Link
      to={route}
      className={`
        ${styles.navItem}
        ${isActive ? styles.active : ""}
        ${mobile
          ? "flex w-full px-4 py-3 hover:bg-gray-700"
          : `flex items-center gap-2 cursor-pointer py-2 ${collapsed ? 'px-2 justify-center' : 'px-4'} whitespace-nowrap rounded`
        }
        transition-colors duration-300
        ${collapsed && !mobile ? 'w-10 mx-auto' : 'w-full'}
      `}
      title={collapsed && !mobile ? label : undefined}
    >
      {icon && <span className={collapsed && !mobile ? 'mx-auto' : ''}>{icon}</span>}
      {(!collapsed || mobile) && <span>{label}</span>}
      {collapsed && !mobile && (
        <span className="sr-only">{label}</span> // Mantener el texto para lectores de pantalla
      )}
    </Link>
  );
};

export default NavItem;