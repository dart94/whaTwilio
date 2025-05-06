import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavItem from "./NavItem";
import { FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import icon from "../img/iconAutoInsights.png";
import { getCurrentUser } from "../utils/user";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className={`h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ${
        collapsed ? "w-[70px]" : "w-60"
      }`}
    >
      {/* Toggle button */}
      <div className="flex items-center justify-end p-2">
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div>

      {/* Logo */}
      <div className="flex justify-center p-2">
        <img
          src={icon}
          alt="logo"
          className={`transition-all duration-300 ${
            collapsed ? "w-8 h-8" : "w-28 h-auto"
          }`}
        />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-2 mt-6 px-2">
        <NavItem
          label="Mensaje"
          route="/mesaje"
          icon={<FontAwesomeIcon icon={faWhatsapp} />}
          collapsed={collapsed}
        />
        {user?.is_staff === 1 && (
          <NavItem
            label="Admin"
            route="/admin/usuarios"
            icon={<MdAdminPanelSettings size={20} />}
            collapsed={collapsed}
          />
        )}
      </nav>

      {/* Spacer + logout */}
      <div className="flex-grow" />
      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition"
      >
        <FiLogOut />
        {!collapsed && <span className="ml-2">Cerrar sesión</span>}
      </button>
    </div>
  );
};

export default Sidebar;
