import React from "react";
import styles from "../../../styles/AsociarCredencialesView.module.css";
import TemplateSelectorId from "./TemplateId";

interface Numero {
  id: number;
  nombre: string;
  number: number;
}

interface NumeroSelectorProps {
  campañaSeleccionada: number | null;
  numeros: Numero[];
  selectedNumeroId: number;
  onNumeroChange: (newValue: number) => void;
  templates: any[];
}

const NumeroSelectorId: React.FC<NumeroSelectorProps> = ({
  numeros,
  selectedNumeroId,
  onNumeroChange,
  campañaSeleccionada,
  templates,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    onNumeroChange(newValue);
  };

  return (
    <div className={styles.formGroup}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>4</div>
        <h3 className={styles.title}>Número</h3>
        <span
          className={`${styles.status} ${
            campañaSeleccionada ? styles.statusGreen : styles.statusRed
          }`}
        >
          {campañaSeleccionada
            ? "Números disponibles"
            : "Disponible al seleccionar la campaña"}
        </span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Seleccionar Número:</label>
        <select
          className={styles.select}
          value={selectedNumeroId}
          onChange={handleChange}
          disabled={templates.length === 0}
        >
          <option value={0}>Seleccione un número</option>
          {numeros.map(
            (numero) => (
              (
                <option key={numero.id} value={numero.id}>
                  {numero.nombre}
                </option>
              )
            )
          )}
        </select>
      </div>
    </div>
  );
};

export default NumeroSelectorId;
