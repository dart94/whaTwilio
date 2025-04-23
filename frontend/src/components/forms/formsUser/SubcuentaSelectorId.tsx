import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../../styles/AsociarCredencialesView.module.css';
import { buscarSubcuentasPorUsuario } from '../../../services/subcuentaService'; 

interface Subcuenta {
  id: number;
  Nombre: string;
}

interface SubcuentaSelectorProps {
  onSubcuentaChange: (newValue: number) => void;
}

const SubcuentaSelectorId: React.FC<SubcuentaSelectorProps> = ({
  onSubcuentaChange,
}) => {
  const [userSubcuentas, setUserSubcuentas] = useState<Subcuenta[]>([]);
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener el usuario de la sesión activa
        const userEmail = localStorage.getItem('userEmail'); 
        if (!userEmail) {
          toast.error('No se encontró usuario en sesión');
          return;
        }

        // 2. Buscar subcuentas para este usuario
        const subcuentas = await buscarSubcuentasPorUsuario(userEmail);
        setUserSubcuentas(subcuentas);

        // 3. Seleccionar la primera subcuenta por defecto si hay resultados
        if (subcuentas.length > 0) {
          const primeraSubcuenta = subcuentas[0].id;
          setSubcuentaSeleccionada(primeraSubcuenta);
          onSubcuentaChange(primeraSubcuenta);
        }

      } catch (error) {
        console.error('Error al cargar subcuentas:', error);
        toast.error('Error al cargar subcuentas');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcuentas();
  }, [onSubcuentaChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    setSubcuentaSeleccionada(value);
    onSubcuentaChange(value);
  };

  if (loading) {
    return (
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Subcuenta</label>
        <div className={styles.loadingMessage}>Cargando subcuentas...</div>
      </div>
    );
  }

  if (userSubcuentas.length === 0) {
    return (
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Subcuenta</label>
        <div className={styles.errorMessage}>No se encontraron subcuentas para este usuario</div>
      </div>
    );
  }

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Subcuenta</label>
      <select
        value={subcuentaSeleccionada}
        onChange={handleChange}
        className={styles.select}
      >
        {userSubcuentas.map((subcuenta) => (
          <option key={subcuenta.id} value={subcuenta.id} className={styles.option}>
            {subcuenta.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubcuentaSelectorId;