import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../styles/AsociarCredencialesView.module.css';
import { obtenerSheetPorId } from '../../services/sheet';

interface BuscarSheetProps {
  onSheetEncontrado: (sheet: any) => void;
}

const BuscarSheet: React.FC<BuscarSheetProps> = ({ onSheetEncontrado }) => {
  const [sheetId, setSheetId] = useState('');

  const handleBuscar = async () => {
    if (!sheetId) {
      toast.warn('Por favor ingresa un Sheet ID');
      return;
    }
    try {
      const response = await obtenerSheetPorId(sheetId);
      console.log('Respuesta completa:', response); // Para depuración
      
      if (!response.success || !response.data) {
        toast.info('No se encontró la hoja');
      } else {
        // toast.success('Hoja encontrada');
        // Pasamos el objeto data, no la respuesta completa
        onSheetEncontrado(response.data);
      }
    } catch (error) {
      console.error('Error al buscar sheet:', error);
      toast.error('Error al buscar hoja');
    }
  };
  return (
    <div className={styles.formField}>
      <label className={styles.label}>Buscar por ID de la hoja</label>
      <input
        type="text"
        value={sheetId}
        onChange={(e) => setSheetId(e.target.value)}
        placeholder="Ingresa el Sheet ID"
        className={styles.input}
      />
      <button onClick={handleBuscar} className={styles.submitButton}>
        Buscar
      </button>
    </div>
  );
};

export default BuscarSheet;
