import React from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "../styles/NavItem.module.css";

interface NavItemProps {
    label: string;
    route: string;
  }
  
  const NavItem: React.FC<NavItemProps> = ({ label, route }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const active = pathname === route;
  
    return (
      <div
        className={`${styles.navItem} ${active ? styles.active : ""}`}
        onClick={() => navigate(route)}
      >
        
        <span>{label}</span>
      </div>
    );
  };
  
  export default NavItem;