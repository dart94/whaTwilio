import React, { useEffect, useState } from "react";
import { isUserAdmin, getCurrentUser } from "../utils/user";
import NavItem from "./NavItem";
import { FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/iconAutoInsights.png";
import collapsedIcon from  "../img/AI4.avif";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Botón de colapso */}


      <div className={styles.logoContainer}>
        <img
      src={collapsed ? collapsedIcon : icon} 
          alt="icon" 
          className={`${collapsed ? styles.collapsedLogo : ''}`} 
          />
      </div>
      
      <nav className={styles.nav}>
        <NavItem 
          label="Mensaje" 
          route="/mesaje" 
          icon={<FontAwesomeIcon icon={faWhatsapp} />}
          collapsed={collapsed}
        />
        {user.is_staff === 1 && (
          <NavItem 
            label="Admin" 
            route="/admin/usuarios" 
            icon={<MdAdminPanelSettings size={20} />}
            collapsed={collapsed}
          />
        )}
      </nav>

      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut size={18} />
        {!collapsed && <span className={styles.logoutText}>Cerrar sesión</span>}
      </button>
      <button 
        onClick={toggleSidebar} 
        className={styles.collapseButton}
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>
    </div>
  );
};

export default Sidebar;