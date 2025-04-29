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
        
        const userEmail = localStorage.getItem('userEmail'); 
        if (!userEmail) {
          toast.error('No se encontró usuario en sesión');
          return;
        }

        const subcuentas = await buscarSubcuentasPorUsuario(userEmail);
        setUserSubcuentas(subcuentas);

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

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Subcuenta</label>
      
      <select
        value={subcuentaSeleccionada}
        onChange={handleChange}
        disabled={loading || userSubcuentas.length === 0}
        className={styles.select}
      >
        {loading && (
          <option value="">Cargando subcuentas...</option>
        )}

        {!loading && userSubcuentas.length === 0 && (
          <option value="">No hay subcuentas disponibles</option>
        )}

        {!loading && userSubcuentas.length > 0 && (
          <>
            {userSubcuentas.map((subcuenta) => (
              <option key={subcuenta.id} value={subcuenta.id} className={styles.option}>
                {subcuenta.Nombre}
              </option>
            ))}
          </>
        )}
      </select>
    </div>
  );
};

export default SubcuentaSelectorId;
