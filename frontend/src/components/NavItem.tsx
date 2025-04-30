import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../styles/AdminNav.module.css";

interface NavItemProps {
  label: string;
  route: string;
  mobile?: boolean;
  icon?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, route, mobile = false, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === route;
  
  return (
<Link 
  to={route} 
  className={`
    ${styles.navItem}
    ${isActive ? styles.active : ''}
    ${mobile 
      ? 'flex w-full px-4 py-3 hover:bg-gray-700' 
      : 'items-center cursor-pointer py-2 px-4 whitespace-nowrap flex-shrink-0 rounded'
    }
    transition-colors duration-300 flex gap-2 items-center
  `}
>
  {icon && <span className="text-lg">{icon}</span>}
  <span>{label}</span>
</Link>

  );
};

export default NavItem;