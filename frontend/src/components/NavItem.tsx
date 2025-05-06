// src/components/NavItem.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/Layout.module.css"; // Cambiado a Layout.module.css para coherencia

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
  const isActive = location.pathname.startsWith(route);
  
  return (
    <Link
      to={route}
      className={`
        ${styles.navItem}
        ${isActive ? styles.active : ''}
        ${mobile
          ? styles.mobileNavItem
          : `${styles.desktopNavItem} ${collapsed ? styles.collapsedNavItem : ''}`
        }
        ${collapsed && !mobile ? styles.collapsed : ''}
      `}
      title={collapsed && !mobile ? label : undefined}
      aria-label={label}
    >
      {icon && (
        <span className={`
          ${styles.navIcon} 
          ${collapsed && !mobile ? styles.collapsedIcon : ''}
        `}>
          {icon}
        </span>
      )}
      {(!collapsed || mobile) && (
        <span className={styles.navLabel}>{label}</span>
      )}
    </Link>
  );
};

export default NavItem;