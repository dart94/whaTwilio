import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    // Leer del localStorage al inicializar
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  if (pathname === "/") return <Outlet />;

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div
        id="mainContent"
        className={`${styles.content} ${collapsed ? styles.collapsed : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;