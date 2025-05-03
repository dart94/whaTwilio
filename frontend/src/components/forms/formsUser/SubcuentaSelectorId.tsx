import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '../../../styles/AsociarCredencialesView.module.css';
import { buscarSubcuentasPorUsuario } from '../../../services/subcuentaService';

interface Subcuenta {
  id: number;
  Nombre: string;
}

interface SubcuentaSelectorProps {
  onSubcuentaChange: (newValue: number | null) => void;
}

const SubcuentaSelectorId: React.FC<SubcuentaSelectorProps> = ({
  onSubcuentaChange,
}) => {
  const [userSubcuentas, setUserSubcuentas] = useState<Subcuenta[]>([]);
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        setLoading(true);
        
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          toast.error('No se encontró usuario en sesión');
          return;
        }
  
        const parsedData = JSON.parse(storedUser);
  
        // Verificar que el objeto parsedData tenga la propiedad 'user' y el 'email'
        if (!parsedData || !parsedData.user || !parsedData.user.email) {
          toast.error('Usuario no válido');
          return;
        }
        
        const userEmail = parsedData.user.email;
  
        // Llamar a la API para obtener las subcuentas
        const subcuentas = await buscarSubcuentasPorUsuario(userEmail);
  
        // Verificar si se obtuvieron las subcuentas correctamente
        if (subcuentas) {
          setUserSubcuentas(subcuentas);
        } else {
          toast.error('No se encontraron subcuentas para este usuario');
        }
  
        setSubcuentaSeleccionada(null);
        onSubcuentaChange(null);
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
    const selectedValue = e.target.value;
    
    if (selectedValue === "") {
      // Si selecciona la opción por defecto
      setSubcuentaSeleccionada(null);
      onSubcuentaChange(null);
    } else {
      // Si selecciona una subcuenta válida
      const value = Number(selectedValue);
      setSubcuentaSeleccionada(value);
      onSubcuentaChange(value);
    }
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Subcuenta</label>
     
      <select
        value={subcuentaSeleccionada === null ? "" : subcuentaSeleccionada}
        onChange={handleChange}
        disabled={loading}
        className={styles.select}
      >
        {loading ? (
          <option value="">Cargando subcuentas...</option>
        ) : (
          <>
            <option value="">Seleccionar subcuenta</option>
            {userSubcuentas.length === 0 ? (
              <option value="" disabled>No hay subcuentas disponibles</option>
            ) : (
              userSubcuentas.map((subcuenta) => (
                <option key={subcuenta.id} value={subcuenta.id} className={styles.option}>
                  {subcuenta.Nombre}
                </option>
              ))
            )}
          </>
        )}
      </select>
    </div>
  );
};

export default SubcuentaSelectorId;