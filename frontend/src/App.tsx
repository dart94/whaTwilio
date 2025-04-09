import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Layout from './layouts/Layout';
import SubcuentasView from './pages/admin/SubcuentasView';
import NumeroTelefonicoView from './pages/admin/NumeroTelefonicoView';
import CredencialView from './pages/admin/CredencialView';
import AsociarNumeroView from './pages/admin/AsociarNumerosView';
import AsociarCredencialesView from './pages/admin/AsociarCredencialesView';
import CampaignView from './pages/admin/CampaignView';
import UsuariosView from './pages/admin/UsuariosView';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/admin" element={<Admin />}>
            <Route path="subcuentas" element={<SubcuentasView />} />
            <Route path="numeros" element={<NumeroTelefonicoView />} />
            <Route path="credenciales" element={<CredencialView />} />
            <Route path="AsociarNumero" element={<AsociarNumeroView />} />
            <Route path="AsociarCredencial" element={<AsociarCredencialesView />} />
            <Route path="crearCampana" element={<CampaignView />} />
            <Route path="usuarios" element={<UsuariosView />} />

            
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<div>Página no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;