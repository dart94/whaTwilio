import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
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
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      <main
        id="mainContent"
        className={`flex-1 bg-gray-100 overflow-y-auto p-6 transition-all duration-300 ${
          collapsed ? "ml-[70px]" : "ml-60"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
