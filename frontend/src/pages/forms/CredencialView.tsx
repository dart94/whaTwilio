import React, { useRef, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../../styles/SubcuentasView.module.css';
import { ToastContainer } from 'react-toastify';
import { crearCredencial, obtenerCredenciales } from '../../services/credentialService';

const CredencialView: React.FC = () => {
  const [nombreCredencial, setNombreCredencial] = useState('');
  const [jsonCredencial, setJsonCredencial] = useState('{\n  "key": "value"\n}');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [credentials, setCredentials] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tabActiva, setTabActiva] = useState('credenciales-tab'); 

  const handleCrearCredencial = async () => {
    try {
      // Validación de campos y JSON se realiza dentro del servicio
      await crearCredencial(nombreCredencial, jsonCredencial);
      toast.success('Credencial creada exitosamente');
      
      // Reiniciar campos tras creación exitosa
      setNombreCredencial('');
      setJsonCredencial('{\n  "key": "value"\n}');
      if (textareaRef.current) {
        textareaRef.current.value = '{\n  "key": "value"\n}';
      }
      
      // Actualizar lista de credenciales si es necesario
      if (tabActiva === 'credenciales-tab') {
        try {
          const data = await obtenerCredenciales();
          setCredentials(data);
        } catch (error) {
          console.error("Error al obtener credenciales:", error);
        }
      }
    } catch (error: any) {
      console.error('Error al crear la credencial:', error);
      toast.error(`Error al crear la credencial: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Crear credenciales</h2>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nombre de la credencial</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={nombreCredencial}
          onChange={(e) => setNombreCredencial(e.target.value)}
          className={styles.input}
        />
        <div className={styles.counter}>{nombreCredencial.length} / 50</div>
      </div>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Credencial en formato JSON</label>
        <textarea
          name="json"
          ref={textareaRef}
          value={jsonCredencial}
          onChange={(e) => setJsonCredencial(e.target.value)}
          className={styles.textarea}
        />
        <div className={styles.counter}>{jsonCredencial.length}</div>
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleCrearCredencial}>
          Crear credencial <FaPencilAlt className={styles.icon} />
        </button>
      </div>
    </div>
  );
};

export default CredencialView;
