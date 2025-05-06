import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Sincronizar con localStorage
  useEffect(() => {
    const state = localStorage.getItem("sidebarCollapsed");
    if (state !== null) setCollapsed(state === "true");
  }, []);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebarCollapsed", String(next));
  };

  if (pathname === "/") return <Outlet />;

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <div
        id="mainContent"
        className={`${styles.content} ${collapsed ? "collapsed" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
