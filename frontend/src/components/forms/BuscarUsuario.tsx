import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { buscarSubcuentasPorUsuario } from '../../services/subcuentaService'; 
import styles from '../../styles/AsociarCredencialesView.module.css'; 

interface BuscarUsuarioProps {
  onSubcuentasEncontradas: (subcuentas: any[]) => void;
  handleBuscarCredencial: (email: string) => Promise<void>;
}

const BuscarUsuario: React.FC<BuscarUsuarioProps> = ({
  onSubcuentasEncontradas,
  handleBuscarCredencial
}) => {
  const [email, setEmail] = useState('');

  const handleBuscarUsuario = async () => {
    console.log("handleBuscarUsuario ejecutado");
    try {
      const data = await buscarSubcuentasPorUsuario(email);
      onSubcuentasEncontradas(data);

      if (data.length === 0) {
        toast.error('No se encontró ninguna subcuenta para este usuario');
      } else {
        toast.success(`Se encontró ${data.length} subcuenta(s) para este usuario`);
      }

      await handleBuscarCredencial(email);
    } catch (error) {
      console.error("Error al buscar subcuentas:", error);
      toast.error('Error al buscar subcuentas para este usuario');
    }
  };




  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Usuario</label>
      <div className={styles.inputGroup}>
        <input
          type="email"
          placeholder="Correo del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <button className={styles.button} onClick={handleBuscarUsuario}>
          Buscar
        </button>
        <button className={styles.button}>
          Lista de usuarios
        </button>
      </div>
    </div>
  );
};

export default BuscarUsuario;
