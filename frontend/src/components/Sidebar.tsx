import React, { useEffect, useState } from "react";
import { isUserAdmin, getCurrentUser } from "../utils/user";
import NavItem from "./NavItem";
import { FiLogOut } from "react-icons/fi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { MdAdminPanelSettings } from "react-icons/md";
import styles from "../styles/Layout.module.css";
import icon from "../img/icon.png";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser()); // State to track the user

  useEffect(() => {
    const storedUser = getCurrentUser();
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`${styles.sidebar} w-48 p-2 flex flex-col items-center justify-center relative z-10`}>
      <div className={`${styles.logoContainer} flex justify-center items-center mb-4`}>
        <img src={icon} alt="icon" className="w-[90%] h-auto rounded-lg" />
      </div>
      <nav className={`${styles.nav} mt-4 relative z-10`}>
        <NavItem label="Mensaje" route="/mesaje" icon={<FontAwesomeIcon icon={faWhatsapp} />} />
        {user.is_staff === 1 && (
          <NavItem label="Admin" route="/admin" icon={<MdAdminPanelSettings size={20} />} />
        )}
      </nav>

      {/* Botón de logout */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        <FiLogOut size={18} style={{ marginRight: "8px" }} />
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;
