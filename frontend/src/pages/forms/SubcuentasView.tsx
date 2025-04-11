import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import styles from '../../styles/SubcuentasView.module.css';
import { buscarSubcuentasPorUsuario, crearSubcuenta } from '../../services/subcuentaService';



const SubcuentasView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [userSubcuentas, setUserSubcuentas] = useState([]);


  const handleBuscarUsuario = async () => {
    console.log("handleBuscarUsuario ejecutado");
    try {
      const data = await buscarSubcuentasPorUsuario(email);
      setUserSubcuentas(data);
  
      if (data.length === 0) {
        toast.error('No se encontró ninguna subcuenta para este usuario');
      } else {
        toast.success(`Se encontró ${data.length} subcuenta(s) para este usuario`);
      }
    } catch (error: any) {
      console.error("Error al buscar subcuentas:", error);
      toast.error('Error al buscar subcuentas para este usuario');
    }
  };

  const handleCreateSubcuenta = async () => {
    try {
      await crearSubcuenta(email, nombreSubcuenta);
      
      toast.success(`Subcuenta creada exitosamente para el usuario: ${email}`);
      
      // Limpiar campos después de la creación
      setEmail('');
      setNombreSubcuenta('');

    } catch (error: any) {
      console.error('Error al crear la subcuenta:', error);
      toast.error(`Error al crear la subcuenta: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Crear subcuenta</h2>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Usuario</label>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handleBuscarUsuario}>
            Buscar
          </button>
          <button className={styles.button}>
            Lista de usuarios
          </button>
        </div>
      </div>
      
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nombre de la subcuenta</label>
        <input
          type="text"
          placeholder="Nombre de la subcuenta"
          value={nombreSubcuenta}
          onChange={(e) => setNombreSubcuenta(e.target.value)}
          className={styles.input}
        />
        <div className={styles.counter}>0 / 50</div>
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleCreateSubcuenta}>
          Crear subcuenta <FaPencilAlt className={styles.icon} />
        </button>
      </div>
      
    </div>
  );
};

export default SubcuentasView;
