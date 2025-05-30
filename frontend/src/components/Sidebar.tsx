// src/components/Sidebar.tsx
import React from "react";
import NavItem from "./NavItem";
import { CiMonitor } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/icon.png";

const Sidebar: React.FC = () => {
  return (
    <div className={`${styles.sidebar} w-48 p-2 flex flex-col items-center justify-center relative z-10`}>
      <div className={`${styles.logoContainer} flex justify-center items-center mb-4`}>
        <img src={icon} alt="icon" className="w-[90%] h-auto rounded-lg" />
      </div>
      <nav className="flex flex-col gap-4 mt-4 w-full z-10">
        <NavItem label="Monitor" route="/monitor" icon={<CiMonitor size={20} />} />
        <NavItem label="Mensaje" route="/mesaje" icon={<FontAwesomeIcon icon={faWhatsapp} />} />
        <NavItem label="Admin" route="/admin" icon={<MdAdminPanelSettings size={20} />} />
      </nav>
    </div>
  );
};

export default Sidebar;