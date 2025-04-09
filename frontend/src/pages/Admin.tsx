import React from "react";
import AdminNav from "../components/AdminNav";
import { Outlet } from "react-router-dom";

const Admin: React.FC = () => {
  return (
    <div>
      <AdminNav />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;