import React, { useEffect, useState } from "react";
import { isUserAdmin, getCurrentUser } from "../utils/user";
import NavItem from "./NavItem";
import { FiLogOut } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/iconAutoInsights.png";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser()); // State to track the user

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''} w-48 p-2 flex flex-col items-center justify-center relative z-10`}>
       <div className={styles.logoContainer}>
        <img 
          src={icon} 
          alt="icon" 
          className={`${collapsed ? styles.collapsedLogo : ''}`} 
        />
      </div>
      <nav className={styles.nav}>
        <NavItem 
          collapsed={collapsed}
          label="Mensaje" 
          route="/mesaje" 
          icon={<FontAwesomeIcon icon={faWhatsapp} />} 
        />
        {user.is_staff === 1 && (
          <NavItem 
            collapsed={collapsed}
            label="Admin" 
            route="/admin/usuarios" 
            icon={<MdAdminPanelSettings size={20} />} 
          />
        )}
      </nav>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut size={18} style={{ marginRight: collapsed ? "0" : "8px" }} />
        {!collapsed && "Cerrar sesión"}
      </button>
    </div>
  );
};

export default Sidebar;