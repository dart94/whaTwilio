import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { crearSheet, Sheet, obtenerHeadersPorGoogleSheetId } from '../../services/sheet';
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
  const [headers, setHeaders] = useState<string[]>([]);
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const [cargandoHeaders, setCargandoHeaders] = useState(false);
  const [mostrarHeaders, setMostrarHeaders] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSheetData((prev) => ({
      ...prev,
      [name]: name === 'campaign_id' ? Number(value) : value
    }));

    // Si cambia el nombre de la hoja, intentamos buscar los encabezados nuevamente
    if (name === 'sheet_sheet' && sheetData.sheet_id && value) {
      handleBuscarHeaders(value);
    }
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
      setHeaders([]);
      setAvailableSheets([]);
      setMostrarHeaders(false);
    } catch (error: any) {
      console.error('Error al crear hoja:', error);
      toast.error(`Error al crear hoja: ${error.message}`);
    }
  };

  const handleBuscarHeaders = async (sheetName?: string) => {
    if (!sheetData.sheet_id) {
      toast.warn('Por favor ingresa un ID de hoja de Google Sheets');
      return;
    }

    setCargandoHeaders(true);
    setMostrarHeaders(false);
    
    try {
      // Usamos directamente el ID de Google Sheets
      const headersResponse = await obtenerHeadersPorGoogleSheetId(
        sheetData.sheet_id, 
        sheetName || sheetData.sheet_sheet
      );
      
      if (headersResponse.success) {
        if (headersResponse.headers) {
          setHeaders(headersResponse.headers);
          setMostrarHeaders(true);
          toast.success('Encabezados obtenidos correctamente');
          console.log('Encabezados obtenidos:', headersResponse.headers);
        }
        
        // Si recibimos los nombres de las hojas disponibles
        if (headersResponse.sheets && headersResponse.sheets.length > 0) {
          setAvailableSheets(headersResponse.sheets);
          
          // Si no hay hoja seleccionada, seleccionamos la primera
          if (!sheetData.sheet_sheet) {
            setSheetData(prev => ({
              ...prev,
              sheet_sheet: headersResponse.sheets[0]
            }));
          }
        }
      } else {
        console.warn('No se pudieron obtener los encabezados');
        toast.warn('No se pudieron obtener los encabezados de la hoja');
        setHeaders([]);
      }
    } catch (error) {
      console.error('Error al obtener encabezados:', error);
      toast.error('Error al obtener encabezados de la hoja');
      setHeaders([]);
    } finally {
      setCargandoHeaders(false);
    }
  };

  const handleSelectHeader = (header: string, field: string) => {
    setSheetData(prev => ({
      ...prev,
      [field]: header
    }));
  };

  return (
    <div className={styles.formContainer}>
      <label className={styles.label}>Crear Nueva Hoja de Cálculo</label>
      
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label className={styles.label}>ID de la hoja de Google</label>
          <div className={styles.inputGroup}>
            <input
              name="sheet_id"
              placeholder="ID de la hoja de Google Sheets"
              value={sheetData.sheet_id}
              onChange={handleChange}
              className={styles.input}
            />
            <button 
              onClick={() => handleBuscarHeaders()}
              className={styles.button}
              disabled={!sheetData.sheet_id || cargandoHeaders}
            >
              {cargandoHeaders ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {availableSheets.length > 0 && (
          <div className={styles.formField}>
            <label className={styles.label}>Nombre del sheet</label>
            <select
              name="sheet_sheet"
              value={sheetData.sheet_sheet}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">Selecciona una hoja</option>
              {availableSheets.map((sheet, index) => (
                <option key={index} value={sheet} className={styles.option}>
                  {sheet}
                </option>
              ))}
            </select>
          </div>
        )}

        {!availableSheets.length && (
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
        )}

        <div className={styles.formField}>
          <label className={styles.label}>Rango</label>
          <input
            name="sheet_range"
            placeholder="Ej: A1:Z100"
            value={sheetData.sheet_range}
            onChange={handleChange}
            className={styles.input}
            disabled={!sheetData.sheet_sheet}
          />
        </div>

        {mostrarHeaders && headers.length > 0 && (
          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label className={styles.label}>Encabezados encontrados</label>
            <div className={styles.headersContainer}>
              {headers.map((header, index) => (
                <div key={index} className={styles.headerItem}>
                  <span className={styles.headerText}>{header}</span>
                  <div className={styles.headerActions}>
                    <button 
                      onClick={() => handleSelectHeader(header, 'field_blacklist')}
                      className={`${styles.smallButton} ${styles.blacklistButton}`}
                      title="Usar como campo de lista negra"
                    >
                      Lista Negra
                    </button>
                    <button 
                      onClick={() => handleSelectHeader(header, 'field_status')}
                      className={`${styles.smallButton} ${styles.statusButton}`}
                      title="Usar como campo de estado"
                    >
                      Estado
                    </button>
                    <button 
                      onClick={() => handleSelectHeader(header, 'field_contact')}
                      className={`${styles.smallButton} ${styles.contactButton}`}
                      title="Usar como campo de contacto"
                    >
                      Contacto
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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