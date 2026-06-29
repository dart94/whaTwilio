import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Layout from './layouts/Layout';
import SubcuentasView from './pages/forms/SubcuentasView';
import NumeroTelefonicoView from './pages/forms/NumeroTelefonicoView';
import CredencialView from './pages/forms/CredencialView';
import AsociarNumeroView from './pages/forms/AsociarNumerosView';
import AsociarCredencialesView from './pages/forms/AsociarCredencialesView';
import CampaignView from './pages/forms/CampaignView';
import UsuariosView from './pages/admin/UsuariosAdminView';
import SheetsView from './pages/forms/SheetsView';
import AsociarCampos from './pages/forms/AsociarCampos';
import SubcuentasAdminView from './pages/admin/SubcuentasAdminView';
import NumeroTelefonicoAdminView from './pages/admin/NumeroTelefonicoAdminView';
import CredencialAdminView from './pages/admin/CredencialAdminView';
import CampaignsAdminView from './pages/admin/CampaignAdminView';
import Mesaje from './pages/mesaje';
import Monitor from './pages/monitor';
import WhatsAppTemplates from './pages/WhatsappView';
import ProtectedRoute from './components/ProtectedRoute';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route
              path="/admin"
              element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
            >
              <Route path="subcuentas" element={<SubcuentasView />} />
              <Route path="numeros" element={<NumeroTelefonicoView />} />
              <Route path="credenciales" element={<CredencialView />} />
              <Route path="AsociarNumero" element={<AsociarNumeroView />} />
              <Route path="AsociarCredencial" element={<AsociarCredencialesView />} />
              <Route path="crearCampana" element={<CampaignView />} />
              <Route path="hojas" element={<SheetsView />} />
              <Route path="AsociarCampos" element={<AsociarCampos />} />
              <Route path="usuarios" element={<UsuariosView />} />
              <Route path="subcuentasAdmin" element={<SubcuentasAdminView />} />
              <Route path="numerosAdmin" element={<NumeroTelefonicoAdminView />} />
              <Route path="credencialesAdmin" element={<CredencialAdminView credentials={[]} />} />
              <Route path="campanasAdmin" element={<CampaignsAdminView />} />
            </Route>
            <Route path="/mesaje" element={<ProtectedRoute><Mesaje /></ProtectedRoute>} />
            <Route path="/monitor" element={<ProtectedRoute><Monitor accountSid="" authToken="" /></ProtectedRoute>} />
            <Route path="/whatsapp-templates" element={<ProtectedRoute><WhatsAppTemplates /></ProtectedRoute>} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ marginTop: '3.5rem' }}
      />
    </>
  );
};

export default App;
