// src/layouts/Layout.tsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout: React.FC = () => {
  const { pathname } = useLocation();

  if (pathname === '/') return <Outlet />;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
      <ToastContainer
        position="top-right"  
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 10000, borderRadius: '5px', marginTop: '3.5rem' }}
        
      />
    </div>
  );
};

export default Layout;