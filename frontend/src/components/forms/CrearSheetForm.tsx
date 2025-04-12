import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { crearSheet, Sheet } from '../../services/sheet';
import styles from '../../styles/AsociarCredencialesView.module.css';
import BuscarCampaign from '../forms/BuscarCampaing';

interface CrearSheetFormProps {
    onCrearSheet: (sheetData: Omit<Sheet, 'id' | 'created_at' | 'updated_at'>) => void;
    campaigns: any[];
}

const CrearSheetForm: React.FC<CrearSheetFormProps> = ({ onCrearSheet, campaigns }) => {
  const [sheetData, setSheetData] = useState<Omit<Sheet, 'id' | 'created_at' | 'updated_at'>>({
    sheet_id: '',
    sheet_sheet: '',
    sheet_range: '',
    field_blacklist: '',
    field_status: '',
    field_contact: '',
    campaign_id: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSheetData((prev) => ({
      ...prev,
      [name]: name === 'campaign_id' ? Number(value) : value
    }));
  };

  const handleCrearSheet = async () => {
    try {
        onCrearSheet(sheetData); 
      toast.success('Hoja de cálculo creada exitosamente');
      setSheetData({
        sheet_id: '',
        sheet_sheet: '',
        sheet_range: '',
        field_blacklist: '',
        field_status: '',
        field_contact: '',
        campaign_id: 0
      });
    } catch (error: any) {
      console.error('Error al crear hoja:', error);
      toast.error(`Error al crear hoja: ${error.message}`);
    }
  };

  return (
    <div className={styles.formContainer}>
      <label className={styles.label}>Crear Nueva Hoja de Cálculo</label>
      
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.label}>ID de la hoja</label>
          <input
            name="sheet_id"
            placeholder="ID de la hoja de Google Sheets"
            value={sheetData.sheet_id}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Nombre del sheet</label>
          <input
            name="sheet_sheet"
            placeholder="Ej: Hoja1"
            value={sheetData.sheet_sheet}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Rango</label>
          <input
            name="sheet_range"
            placeholder="Ej: A1:Z100"
            value={sheetData.sheet_range}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Campo de lista negra</label>
          <input
            name="field_blacklist"
            placeholder="Nombre del campo"
            value={sheetData.field_blacklist}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Campo de estado</label>
          <input
            name="field_status"
            placeholder="Nombre del campo"
            value={sheetData.field_status}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.formField}>
          <label className={styles.label}>Campo de contacto</label>
          <input
            name="field_contact"
            placeholder="Nombre del campo"
            value={sheetData.field_contact}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <BuscarCampaign
          Campaigns={campaigns}
          onCampaignChange={(newCampaignId) =>
            setSheetData((prev) => ({ ...prev, campaign_id: newCampaignId }))
          }
          onCampaignsEncontradas={() => {}}
        />
      </div>
      
      <div className={styles.buttonContainer}>
        <button onClick={handleCrearSheet} className={styles.submitButton}>
          Crear hoja
        </button>
      </div>
    </div>
  );
};

export default CrearSheetForm;
