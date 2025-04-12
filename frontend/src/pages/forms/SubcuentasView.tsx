import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styles from '../../styles/SubcuentasView.module.css';
import {  crearSubcuenta } from '../../services/subcuentaService';
import BuscarUsuario from '../../components/forms/BuscarUsuario'; 

const SubcuentasView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [nombreSubcuenta, setNombreSubcuenta] = useState('');
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);

  const handleBuscarCredencial = async () => {
    // Si deseas que también haga algo al buscar credenciales, puedes dejarlo
    console.log("Buscar credencial ejecutado");
  };

  const handleCreateSubcuenta = async () => {
    try {
      await crearSubcuenta(email, nombreSubcuenta);
      toast.success(`Subcuenta creada exitosamente para el usuario: ${email}`);
      
      // Limpiar campos
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

      {/* Buscar usuario */}
      <BuscarUsuario
        onSubcuentasEncontradas={setUserSubcuentas}
        handleBuscarCredencial={handleBuscarCredencial}
      />

      {/* Nombre de la subcuenta */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nombre de la subcuenta</label>
        <input
          type="text"
          placeholder="Nombre de la subcuenta"
          value={nombreSubcuenta}
          onChange={(e) => setNombreSubcuenta(e.target.value)}
          className={styles.input}
        />
        <div className={styles.counter}>{nombreSubcuenta.length} / 50</div>
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
