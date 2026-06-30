import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CrearSheetForm from '../../components/forms/CrearSheetForm';
import styles from '../../styles/SubcuentasView.module.css';
import { crearSheet, Sheet } from '../../services/sheet';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import { obtenerCampanas } from '../../services/campaignService';

const SheetsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('');

  useEffect(() => {
    obtenerCampanas()
      .then(setCampaigns)
      .catch((err) => console.error('Error al cargar campañas:', err));
  }, []);

  const handleCrearSheet = async (
    sheetData: Omit<Sheet, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      await crearSheet(sheetData as Sheet);
      toast.success('Hoja de cálculo creada correctamente');
    } catch (error) {
      console.error('Error al crear hoja:', error);
      toast.error('Error al crear hoja');
    }
  };

  const handleBuscarCredencial = async (_email: string) => {
    try {
      const data = await obtenerCampanas();
      setCampaigns(data);
    } catch (error) {
      console.error('Error al cargar campañas:', error);
      toast.error('Error al cargar las campañas');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Hojas de cálculo</h2>
      <hr className={styles.hr} />

      <BuscarUsuario
        onSubcuentasEncontradas={() => {}}
        handleBuscarCredencial={handleBuscarCredencial}
        onEmailSelected={setSelectedEmail}
      />

      <CrearSheetForm onCrearSheet={handleCrearSheet} campaigns={campaigns} />
    </div>
  );
};

export default SheetsView;
