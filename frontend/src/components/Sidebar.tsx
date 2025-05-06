import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/user";
import NavItem from "./NavItem";
import { FiLogOut, FiMenu, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/iconAutoInsights.png";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
    
    // Recuperar el estado del sidebar del localStorage
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    if (sidebarState) {
      setCollapsed(sidebarState === 'true');
    }
  }, []);
  
  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    // Guardar el estado en localStorage para persistencia
    localStorage.setItem('sidebarCollapsed', String(newCollapsedState));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`${styles.sidebar} transition-all duration-300 ${collapsed ? 'w-16' : 'w-48'} p-2 flex flex-col items-center justify-center relative z-10`}>
      {/* Botón para colapsar/expandir el sidebar */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1 text-gray-700"
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
      </button>
      
      <div className={`${styles.logoContainer} flex justify-center items-center mb-4 ${collapsed ? 'w-12' : 'w-full'}`}>
        <img src={icon} alt="icon" className="w-[90%] h-auto rounded-lg" />
      </div>
      
      <nav className={`${styles.nav} mt-4 relative z-10 w-full flex flex-col items-center`}>
        <NavItem 
          label={collapsed ? "" : "Mensaje"} 
          route="/mesaje" 
          icon={<FontAwesomeIcon icon={faWhatsapp} />} 
          collapsed={collapsed}
        />
        
        {user.is_staff === 1 && (
          <NavItem 
            label={collapsed ? "" : "Admin"} 
            route="/admin/usuarios" 
            icon={<MdAdminPanelSettings size={20} />} 
            collapsed={collapsed}
          />
        )}
      </nav>
      
      {/* Botón de logout */}
      <button 
        onClick={handleLogout} 
        className={`${styles.logoutButton} mt-auto ${collapsed ? 'p-2' : ''} flex items-center justify-center`}
        title="Cerrar sesión"
      >
        <FiLogOut size={18} className={collapsed ? "" : "mr-2"} />
        {!collapsed && "Cerrar sesión"}
      </button>
    </div>
  );
};

export default Sidebar;