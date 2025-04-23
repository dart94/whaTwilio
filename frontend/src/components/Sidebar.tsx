// src/components/Sidebar.tsx
import React from "react";
import NavigationItem from "./NavigationItem";
import { CiMonitor } from "react-icons/ci";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/icon.png";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <img src={icon} alt="icon" />
      </div>
      <nav className={styles.nav}>
        <NavigationItem label="Monitor" route="/monitor" icon={<CiMonitor size={20} />} />
        <NavigationItem label="Mensaje" route="/mesaje" icon={<FontAwesomeIcon icon={faWhatsapp} />} />
        <NavigationItem label="Admin" route="/admin" icon={<MdAdminPanelSettings size={20} />} />
      </nav>
    </div>
  );
};

export default Sidebar;
