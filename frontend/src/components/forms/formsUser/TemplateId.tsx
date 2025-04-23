import React from 'react';
import styles from '../../../styles/AsociarCredencialesView.module.css';

interface Template {
  ID: number;
  Nombre: string;
}

interface TemplateSelectorProps {
  Templates: Template[];
  value: number | null;
  onTemplatesEncontradas?: (templates: Template[]) => void; // opcional por si no lo usas
  onTemplateChange: (newValue: number) => void;
}

const TemplateSelectorId: React.FC<TemplateSelectorProps> = ({
  Templates,
  value,
  onTemplateChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    onTemplateChange(newValue);
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>Seleccionar Plantilla:</label>
      <select
        className={styles.select}
        value={value ?? 0}
        onChange={handleChange}
        disabled={Templates.length === 0}
      >
        <option value={0}>Seleccione una plantilla</option>
        {Templates.map((template) => (
          <option key={template.ID} value={template.ID}>
            {template.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelectorId;
