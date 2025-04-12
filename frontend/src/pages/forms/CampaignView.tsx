import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css';
import { crearCampana, obtenerCampanas } from '../../services/campaignService';
import { obtenerCredenciales } from '../../services/credentialService';
import BuscarUsuario from '../../components/forms/BuscarUsuario';

const CampaignView: React.FC = () => {
  const [nombreCampana, setNombreCampana] = useState('');
  const [descripcionCampana, setDescripcionCampana] = useState('');
  const [subcuenta, setSubcuenta] = useState(0);
  const [credentialSheetId, setCredentialSheetId] = useState(0);
  const [credentialTemplateId, setCredentialTemplateId] = useState(0);
  const [email, setEmail] = useState('');
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const handleBuscarCredencial = async () => {
    try {
      const data = await obtenerCredenciales();
      setCredentials(data);

      if (data.length === 0) {
        toast.error('No se encontró ninguna credencial para este usuario');
      } else {
        toast.success(`Se encontró ${data.length} credencial(es) para este usuario`);
      }
    } catch (error: any) {
      console.error("Error al buscar credenciales:", error);
      toast.error('Error al buscar credenciales para este usuario');
    }
  };



  const handleCrearCampana = async () => {
    try {
      await crearCampana(
        nombreCampana,
        descripcionCampana,
        subcuenta,
        credentialSheetId,
        credentialTemplateId
      );
      toast.success('Campaña creada exitosamente');

      setNombreCampana('');
      setDescripcionCampana('');
      setSubcuenta(0);
      setCredentialSheetId(0);
      setCredentialTemplateId(0);

      const data = await obtenerCampanas();
      setCampaigns(data);
    } catch (error: any) {
      console.error('Error al crear campaña:', error);
      toast.error(`Error al crear campaña: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Crear Campaña</h2>

      {/* Nombre y descripción */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nombre de la campaña</label>
        <input
          type="text"
          placeholder="Nombre de la campaña"
          value={nombreCampana}
          onChange={(e) => setNombreCampana(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Descripción</label>
        <textarea
          placeholder="Descripción de la campaña"
          value={descripcionCampana}
          onChange={(e) => setDescripcionCampana(e.target.value)}
          className={styles.textarea}
        />
      </div>

      {/* Usuario */}
      <BuscarUsuario
      onSubcuentasEncontradas={setUserSubcuentas}
      handleBuscarCredencial={handleBuscarCredencial}
      />

      {/* Subcuenta */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Subcuenta</label>
        <select
          value={subcuenta || ''}
          onChange={(e) => setSubcuenta(Number(e.target.value))}
          className={styles.select}
          disabled={userSubcuentas.length === 0}
        >
          <option value="">Seleccionar subcuenta</option>
          {userSubcuentas.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.Nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Credenciales */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Credencial para Google Sheets</label>
        <select
          value={credentialSheetId || ''}
          onChange={(e) => setCredentialSheetId(Number(e.target.value))}
          className={styles.select}
          disabled={!subcuenta}
        >
          <option value="">Seleccionar credencial para Google Sheets</option>
          {credentials.map((cred) => (
            <option key={cred.id} value={cred.id}>
              {cred.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Credencial para mensajes y plantillas</label>
        <select
          value={credentialTemplateId || ''}
          onChange={(e) => setCredentialTemplateId(Number(e.target.value))}
          className={styles.select}
          disabled={!subcuenta}
        >
          <option value="">Seleccionar credencial para mensajes</option>
          {credentials
            .filter((cred) => cred.name.toLowerCase() !== 'no')
            .map((cred) => (
              <option key={cred.id} value={cred.id}>
                {cred.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleCrearCampana}>
          Crear campaña <FaPencilAlt className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default CampaignView;
