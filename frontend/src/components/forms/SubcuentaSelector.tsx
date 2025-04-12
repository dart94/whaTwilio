// frontend/src/components/SubcuentaSelector.tsx
import React from 'react';
import styles from '../../styles/AsociarCredencialesView.module.css';

interface Subcuenta {
  id: number;
  Nombre: string;
}

interface SubcuentaSelectorProps {
  userSubcuentas: Subcuenta[];
  subcuentaSeleccionada: number;
  onSubcuentaChange: (newValue: number) => void;
}

const SubcuentaSelector: React.FC<SubcuentaSelectorProps> = ({
  userSubcuentas,
  subcuentaSeleccionada,
  onSubcuentaChange,
}) => {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Subcuenta</label>
      <select
        value={subcuentaSeleccionada}
        onChange={(e) => onSubcuentaChange(Number(e.target.value))}
        className={styles.select}
        disabled={userSubcuentas.length === 0}
      >
        <option value={0} className={styles.option}>
          Seleccionar compañía
        </option>
        {userSubcuentas.map((subcuenta) => (
          <option key={subcuenta.id} value={subcuenta.id} className={styles.option}>
            {subcuenta.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SubcuentaSelector;
