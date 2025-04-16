// frontend/src/components/AsociarCampos.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css';
import SubcuentaSelector from '../../components/forms/SubcuentaSelector';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import { obtenerCredenciales } from '../../services/credentialService';
import { obtenerCampanas } from '../../services/campaignService';
import CrearSheetForm from '../../components/forms/CrearSheetForm';
import CredentialSelector from '../../components/forms/CredentialPlantilla';

const AsociarCampos: React.FC = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [plantillaVariables, setPlantillaVariables] = useState<string[]>([]);
  const [plantillaBody, setPlantillaBody] = useState<string>('');
  const [mostrarCamposVariables, setMostrarCamposVariables] = useState(false);
  const [showPlantillaContent, setShowPlantillaContent] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sheetId, setSheetId] = useState('');
  const [plantillas, setPlantillas] = useState<any[]>([]);
  const [selectedCredential, setSelectedCredential] = useState('');

  // Maneja la búsqueda de credenciales y campañas
  const handleBuscarCredencial = async () => {
    try {
      const data = await obtenerCredenciales();
      setCredentials(data);

      const campaignData = await obtenerCampanas();
      setCampaigns(campaignData);

      if (data.length === 0) {
        toast.error('No se encontró ninguna credencial para este usuario');
      } else {
        toast.success(`Se encontró ${data.length} credencial(es) para este usuario`);
      }

      if (campaignData.length === 0) {
        toast.warn('El usuario no tiene campañas asignadas');
      } else {
        toast.success(`Se encontró ${campaignData.length} campaña(s) para este usuario`);
      }
    } catch (error: any) {
      console.error("Error al buscar credenciales:", error);
      toast.error('Error al buscar credenciales para este usuario');
    }
  };

  // Función para manejar el mapeo de variables (necesaria para CredentialSelector)
  const handleVariableMapping = (mapping: any) => {
    console.log('Variable mapping:', mapping);
    // Puedes actualizar el estado u otro proceso aquí según necesites
  };

  // Función para manejar la selección de plantillas que retorna el componente CredentialSelector
  const handleTemplateSelect = (templates: any[]): void => {
    if (templates && templates.length > 0) {
      setPlantillas(templates);
      toast.success(`Se encontraron ${templates.length} plantilla(s)`);
    } else {
      toast.warn('No se encontraron plantillas');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Asociar Campos</h2>
      <hr className={styles.hr} />

      {/* Sección Usuario */}
      <BuscarUsuario
        onSubcuentasEncontradas={setUserSubcuentas}
        handleBuscarCredencial={handleBuscarCredencial}
      />

      {/* Sección Subcuenta */}
      <SubcuentaSelector
        userSubcuentas={userSubcuentas}
        subcuentaSeleccionada={subcuentaSeleccionada}
        onSubcuentaChange={setSubcuentaSeleccionada}
      />

      <hr className={styles.hr} />

      {/* Sheets */}
      <CrearSheetForm
        onCrearSheet={(sheetData) => {
          console.log(sheetData);
        }}
        campaigns={campaigns}
      />
      <hr className={styles.hr} />

      {/* Selector de Credenciales y Plantillas */}
      <CredentialSelector
        credentials={credentials}
        selectedCredential={selectedCredential}
        onCredentialChange={setSelectedCredential}
        onTemplatesEncontradas={handleTemplateSelect}
        headers={sheetHeaders}
        onVariableMappingChange={handleVariableMapping}
      />
    </div>
  );
};

export default AsociarCampos;
