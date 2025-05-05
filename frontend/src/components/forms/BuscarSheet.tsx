import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css';
import { obtenerSheetPorId } from '../../services/sheet';

interface BuscarSheetProps {
  onSheetEncontrado: (sheet: any) => void;
}

const BuscarSheet: React.FC<BuscarSheetProps> = ({ onSheetEncontrado }) => {
  const [sheetId, setSheetId] = useState('');
  const [sheetInfo, setSheetInfo] = useState<any>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const handleBuscar = async () => {
    if (!sheetId) {
      toast.warn('Por favor ingresa un Sheet ID');
      return;
    }
    
    try {
      const response = await obtenerSheetPorId(sheetId);     
      if (!response.success || !response.data) {
        toast.info('No se encontró la hoja');
        setSheetInfo(null);
        setMostrarDetalles(false);
      } else {
        // Guardamos la información del sheet
        setSheetInfo(response.data);
        setMostrarDetalles(true);
        // Pasamos el objeto data al componente padre
        onSheetEncontrado(response.data);
        toast.success('Hoja encontrada');
      }
    } catch (error) {
      console.error('Error al buscar sheet:', error);
      toast.error('Error al buscar hoja');
      setMostrarDetalles(false);
      setSheetInfo(null);
    }
  };

  return (
    <div className={styles.formSection}>
      <div className={styles.formField}>
        <label className={styles.label}>Buscar por ID de la hoja</label>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
            placeholder="Ingresa el Sheet ID"
            className={styles.input}
          />
          <button className={styles.button} onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>

      {mostrarDetalles && sheetInfo && (
        <div className={styles.resultsContainer}>
          <h3 className={styles.subTitle}>Información de la hoja</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Lista Negra:</span>
              <span className={styles.infoValue}>{sheetInfo.field_blacklist}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Contacto:</span>
              <span className={styles.infoValue}>{sheetInfo.field_contact}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Estado WhatsApp:</span>
              <span className={styles.infoValue}>{sheetInfo.field_status}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rango:</span>
              <span className={styles.infoValue}>{sheetInfo.sheet_range}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Hoja:</span>
              <span className={styles.infoValue}>{sheetInfo.sheet_sheet}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarSheet;