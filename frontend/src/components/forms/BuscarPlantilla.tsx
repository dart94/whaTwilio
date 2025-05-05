import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getContentTemplates } from '../../services/Twilio';
import styles from '../../styles/AsociarCredencialesView.module.css';

interface BuscarPlantillaProps {
  onTemplatesEncontradas: (templates: any[]) => void;
}

const BuscarPlantilla: React.FC<BuscarPlantillaProps> = ({
  onTemplatesEncontradas
}) => {
  const [nombrePlantilla, setNombrePlantilla] = useState('');

  const handleBuscarPlantilla = async () => {
    try {
      const templates = await getContentTemplates(nombrePlantilla);
      
      if (!templates) {
        toast.error('Error al buscar plantillas');
        return;
      }
      
      onTemplatesEncontradas(templates);
      
      if (templates.length === 0) {
        toast.error('No se encontró ninguna plantilla con ese nombre');
      } else {
        toast.success(`Se encontraron ${templates.length} plantilla(s)`);
      }
    } catch (error) {
      console.error("Error al buscar plantillas:", error);
      toast.error('Error al buscar plantillas');
    }
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Plantilla</label>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="Nombre de la credencial"
          value={nombrePlantilla}
          onChange={(e) => setNombrePlantilla(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button} onClick={handleBuscarPlantilla}>
          Buscar
        </button>
        <button className={styles.button}>
          Lista de plantillas
        </button>
      </div>
    </div>
  );
};

export default BuscarPlantilla;