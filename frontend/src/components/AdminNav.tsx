import React from "react";
import NavItem from "./NavItem";
import styles from "../styles/AdminNav.module.css";


const mainNavItems = [
  { label: "Subcuentas", route: "/admin/subcuentas" },
  { label: "Números Telefónicos", route: "/admin/numeros" },
  { label: "Credenciales", route: "/admin/credenciales" },
  { label: "Asociar número", route: "/admin/AsociarNumero" },
  { label: "Asociar credenciales", route: "/admin/AsociarCredencial" },
  { label: "Crear campaña", route: "/admin/crearCampana" },
];


const secondaryNavItems = [
  { label: "Usuarios", route: "/admin/usuarios" },
  { label: "Usuarios", route: "/admin/usuarios" },
  { label: "Usuarios", route: "/admin/usuarios" },
  { label: "Usuarios", route: "/admin/usuarios" },
];

const AdminNav: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navGroup}>
        {mainNavItems.map((item) => (
          <NavItem key={item.route} label={item.label} route={item.route} />
        ))}
      </div>
      <div className={styles.navGroup}>
        {secondaryNavItems.map((item) => (
          <NavItem key={item.route} label={item.label} route={item.route} />
        ))}
      </div>
    </nav>
  );
};

export default AdminNav;
