import React from "react";
import styles from "../../../styles/AsociarCredencialesView.module.css";

interface Template {
  sid: string;
  friendly_name: string;
  body: string;
}

interface TemplateSelectorProps {
  Templates: Template[];
  value: string | null; 
  onTemplateChange: (newValue: string) => void; 
  campañaSeleccionada: number | null;
}

const TemplateSelectorId: React.FC<TemplateSelectorProps> = ({
  Templates,
  value,
  onTemplateChange,
  campañaSeleccionada,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value; 
    onTemplateChange(newValue);
  };

  return (
    <div className={styles.formGroup}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>2</div>
        <h3 className={styles.title}>Plantilla</h3>
        <span
          className={`${styles.status} ${
            campañaSeleccionada ? styles.statusGreen : styles.statusRed
          }`}
        >
          {campañaSeleccionada
            ? "Plantillas disponibles"
            : "Disponible al seleccionar la campaña"}
        </span>
      </div>

      <label className={styles.label} htmlFor="template-select">
        Seleccionar Plantilla:
      </label>
      <select
        id="template-select"
        className={styles.select}
        value={value || ""} 
        onChange={handleChange}
        disabled={Templates.length === 0}
      >
        <option value="">Seleccione una plantilla</option>
        {Templates.map((template) => (
          <option key={template.sid} value={template.sid}>
            {template.friendly_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelectorId;
