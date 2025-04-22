// frontend/src/components/AsociarCampos.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css'; // Cambiar nombre de la hoja
import SubcuentaSelector from '../../components/forms/SubcuentaSelector';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import { obtenerCredenciales } from '../../services/credentialService';
import { obtenerCampanas } from '../../services/campaignService';
import Headers from '../../components/forms/Headers';
import CredentialSelector from '../../components/forms/CredentialSelector';
import { insertTemplate } from '../../services/templatesService';


const AsociarCampos: React.FC = () => {
  // Estados
  const [email, setEmail] = useState('');
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);
  const [plantillaVariables, setPlantillaVariables] = useState<string[]>([]);
  const [plantillaBody, setPlantillaBody] = useState<string>('');
  const [mostrarCamposVariables, setMostrarCamposVariables] = useState(false);
  const [showPlantillaContent, setShowPlantillaContent] = useState(false);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [sheetId, setSheetId] = useState('');
  const [plantillas, setPlantillas] = useState<any[]>([]);
  const [selectedCredential, setSelectedCredential] = useState('');
  const [sheetHeaders, setSheetHeaders] = useState<string[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [variableMapping, setVariableMapping] = useState<any>({});
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

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
    setVariableMapping(mapping);

    
  };

  const handleSheetCreated = (sheetData: { headers: string[], campaign_id: number }) => {
    setSheetHeaders(sheetData.headers);
    setSelectedCampaign(sheetData.campaign_id);
    toast.success('Encabezados listos para mapear');
    console.log('Encabezados obtenidos:', sheetData.headers);
  };

  // 3) Cuando CredentialSelector trae las plantillas encontradas
  const handleTemplatesEncontradas = (tpls: any[]) => {
    if (!tpls || tpls.length === 0) {
      toast.warn('No se encontraron plantillas');
      return;
    }
  
    setTemplates(tpls);
    setPlantillas(tpls);
    setSelectedTemplate(tpls[0]);
    toast.success(`Se encontraron ${tpls.length} plantilla(s)`);
    console.log('🔍 Plantillas encontradas:', tpls);
    console.log('🔍 Plantilla seleccionada  :', selectedTemplate);
  };

  const handlePlantillaSeleccionada = (plantilla: any) => {
    setSelectedTemplate(plantilla);
    console.log('Plantilla seleccionada:', plantilla);
};



  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampaign(parseInt(e.target.value));
  };

    // 5) Aquí podrías hacer un "Guardar asociación" final
    const handleGuardarPlantilla = async () => {
      try {
        console.log('Plantilla seleccionada:', selectedTemplate);
        if (!selectedTemplate || !selectedTemplate.friendly_name) {
          throw new Error('No hay plantilla válida seleccionada');
        }
        
        const nuevaPlantilla = {
          name: selectedTemplate.friendly_name,  
          sid: selectedTemplate.sid,
          campaign_id: selectedCampaign,
          associated_fields: variableMapping
        };
    
        console.log('Datos a enviar:', nuevaPlantilla);
        const response = await insertTemplate(nuevaPlantilla);
        toast.success(`Plantilla guardada correctamente`);
      } catch (error: any) {
        console.error('Error al guardar:', error);
        toast.error(error.message);
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
      <Headers
        campaigns={campaigns}
        onCrearSheet={handleSheetCreated}
      />

      <hr className={styles.hr} />

      {/* 3. Seleccionar credencial y plantilla, y mapear variables */}
      <CredentialSelector
        credentials={credentials}
        selectedCredential={selectedCredential}
        onCredentialChange={setSelectedCredential}
        onTemplatesEncontradas={handleTemplatesEncontradas}
        headers={sheetHeaders}
        onVariableMappingChange={handleVariableMapping}
        onTemplateSelect={handlePlantillaSeleccionada}
      />

      <hr className={styles.hr} />

      {/* 4. Botón final para guardar todo */}
      <button className={styles.submitButton} onClick={handleGuardarPlantilla}>
        Guardar asociación
      </button>
      </div>
  );
};

export default AsociarCampos;
