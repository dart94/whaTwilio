import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { buscarSubcuentasPorUsuario } from '../../services/subcuentaService'; 
import styles from '../../styles/AsociarCredencialesView.module.css'; 

interface BuscarUsuarioProps {
  onSubcuentasEncontradas: (subcuentas: any[]) => void;
  handleBuscarCredencial: (email: string) => Promise<void>;
  onEmailSelected: (email: string) => void;
}

const BuscarUsuario: React.FC<BuscarUsuarioProps> = ({
  onSubcuentasEncontradas,
  handleBuscarCredencial,
  onEmailSelected
}) => {
  const [email, setEmail] = useState(localStorage.getItem('userEmail') || '');

  const handleBuscarUsuario = async () => {
    // Validación y limpieza del email
    let userEmail = email.trim();
    
    if (!userEmail) {
      userEmail = localStorage.getItem('userEmail') || '';
      if (!userEmail) {
        toast.error('Por favor ingresa un correo electrónico válido');
        return;
      }
      setEmail(userEmail); // Actualiza el estado si usamos el del localStorage
    }

    // Validación básica de formato email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    try {
      console.log("Buscando subcuentas para:", userEmail);
      const data = await buscarSubcuentasPorUsuario(userEmail);
      onSubcuentasEncontradas(data);
      onEmailSelected(userEmail); // Actualiza el email seleccionado

      if (data.length === 0) {
        toast.error('No se encontró ninguna subcuenta para este usuario');
      } else {
        toast.success(`Se encontró ${data.length} subcuenta(s) para este usuario`);
      }

      await handleBuscarCredencial(userEmail);
      
      // Guardar en localStorage si es un nuevo email válido
      if (userEmail !== localStorage.getItem('userEmail')) {
        localStorage.setItem('userEmail', userEmail);
      }
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
          onChange={(e) => {
            setEmail(e.target.value);
            onEmailSelected(e.target.value);
          }}
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