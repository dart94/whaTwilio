import React, { useEffect, useState } from "react";
import { isUserAdmin, getCurrentUser } from "../utils/user";
import NavItem from "./NavItem";
import { FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { AiOutlineMenu } from "react-icons/ai";
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
    setShowLogoutConfirm(true);
    
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/login");
    setShowLogoutConfirm(false); // Ocultar el modal
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false); // Ocultar el modal
  };

  const iconSize = 24; 
  const collapseIconSize = 24; 
  const logoutIconSize = 22; 
  
  return (
    <div className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Botón de colapso */}
      <div className={styles.logoContainer}>
        <img
          src={collapsed ? collapsedIcon : icon}
          alt="icon"
          className={`${collapsed ? styles.collapsedLogo : ''}`}
          style={{ width: collapsed ? '32px' : '140px' }} // Ajustamos tamaño de los logos
        />
      </div>
     
      <nav className={styles.nav}>
        <NavItem
          label="Mensaje"
          route="/mesaje"
          icon={<FontAwesomeIcon icon={faWhatsapp} size="lg" />} 
          collapsed={collapsed}
        />
        {user.is_staff === 1 && (
          <NavItem
            label="Admin"
            route="/admin/usuarios"
            icon={<MdAdminPanelSettings size={iconSize} />} 
            collapsed={collapsed}
          />
        )}
      </nav>
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut size={logoutIconSize} /> {/* Aumentamos tamaño */}
        {!collapsed && <span className={styles.logoutText}>Cerrar sesión</span>}
      </button>
      <button
        onClick={toggleSidebar}
        className={styles.collapseButton}
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed ? 
          <AiOutlineMenu size={collapseIconSize} /> : 
          <FiChevronLeft size={collapseIconSize} />
        } {/* Aumentamos tamaño */}
      </button>
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Confirmar Cierre de Sesión</h4>
            <p>¿Estás seguro de que quieres cerrar sesión?</p>
            <div className={styles.modalActions}>
              <button onClick={cancelLogout} className={`${styles.modalButton} ${styles.cancelButton}`}>
                Cancelar
              </button>
              <button onClick={confirmLogout} className={`${styles.modalButton} ${styles.confirmButton}`}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;