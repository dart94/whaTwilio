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
  { label: "Hojas de cálculo", route: "/admin/hojas" },
  { label: "Asociar campos", route: "/admin/AsociarCampos" },
];


const secondaryNavItems = [
  { label: "Usuarios", route: "/admin/usuarios" },
  { label: "Subcuentas Admin", route: "/admin/subcuentasAdmin" },
  { label: "Números Tel Admin", route: "/admin/numerosAdmin" },
  { label: "Credenciales Admin", route: "/admin/credencialesAdmin" },
  { label: "Campañas Admin", route: "/admin/campanasAdmin" },
  
  
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
