import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css';
import SubcuentaSelector from '../../components/forms/SubcuentaSelector';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import { obtenerCredenciales } from '../../services/credentialService';
import { obtenerCampanas } from '../../services/campaignService';
import BuscarCampaign from '../../components/forms/BuscarCampaing';
import BuscarSheet from '../../components/forms/BuscarSheet';
import CrearSheetForm from '../../components/forms/CrearSheetForm';



const AsociarCampos: React.FC = () => {
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
  const [Campaigns, setCampains] = useState<any[]>([]);
  const [sheetId, setSheetId] = useState('');

    
    const handleBuscarCredencial = async () => {
      try {
        const data = await obtenerCredenciales();
        setCredentials(data);

        const campaingData = await obtenerCampanas();
        setCampains(campaingData);

        if (data.length === 0) {
          toast.error('No se encontró ninguna credencial para este usuario');
        }else{
            toast.success(`Se encontró ${data.length} credencial(es) para este usuario`);
        }

        if (campaingData.length === 0) {
          toast.warn('El usuario no tiene campañas asignadas');
            }else{
                toast.success(`Se encontró ${campaingData.length} campaña(s) para este usuario`);
            }
  

      } catch (error: any) {
        console.error("Error al buscar credenciales:", error);
        toast.error('Error al buscar credenciales para este usuario');
      }
    };

  return(
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
            // Handle sheet creation here
            console.log(sheetData);
          }}
          campaigns={Campaigns}
        />
      </div>
      
  );
};

export default AsociarCampos;