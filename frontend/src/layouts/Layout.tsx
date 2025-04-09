// src/layouts/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";

const Layout: React.FC = () => {
  const { pathname } = useLocation();

  // Si la ruta es la raíz, no se muestra el layout completo.
  if (pathname === '/') return <Outlet />;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
