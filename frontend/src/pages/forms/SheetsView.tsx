import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CrearSheetForm from '../../components/forms/CrearSheetForm';
import styles from '../../styles/SubcuentasView.module.css';
import { crearSheet, Sheet } from '../../services/sheet';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import { obtenerUsuarios } from '../../services/userService';
import { obtenerCampanas } from '../../services/campaignService';


const SheetsView: React.FC = () => {
  const [sheets, setSheets] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
 

  const [selectedUserId, setSelectedUserId] = useState<number>(0);

  const handleCrearSheet = async (
    sheetData: Omit<Sheet, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const data = await crearSheet(sheetData as Sheet);
      setSheets(prevSheets => [...prevSheets, data]);
      toast.success('Hoja de cálculo creada correctamente');
    } catch (error) {
      console.error("Error al crear hoja:", error);
      toast.error("Error al crear hoja");
    }
  };

  const handleBuscarUsuario = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsers(data);

      const campaignData = await obtenerCampanas();
      setCampaigns(campaignData);
      toast.success('Usuarios encontrados correctamente');
    } catch (error) {
      console.error("Error al buscar usuarios:", error);
      toast.error("Error al buscar usuarios");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Hojas de cálculo</h2>
      <hr className={styles.hr} />

      {/* Aquí va el campo de buscar usuario, solo como visual */}
      <BuscarUsuario
        onSubcuentasEncontradas={setUsers}
        handleBuscarCredencial={handleBuscarUsuario}
        onEmailSelected={setSelectedUserId}
      />

      <CrearSheetForm onCrearSheet={handleCrearSheet} campaigns={campaigns} />
    </div>
  );
};

export default SheetsView;
