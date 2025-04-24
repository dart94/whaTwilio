import React from "react";
import styles from "../../../styles/Destinatario.module.css";

interface Props {
  campañaSeleccionada: number | null;
  rangeStart: number | null;
  rangeEnd: number | null;
  setRangeStart: (value: number) => void;
  setRangeEnd: (value: number) => void;
}

const DestinatariosId: React.FC<Props> = ({
  campañaSeleccionada,
  rangeStart,
  rangeEnd,
  setRangeStart,
  setRangeEnd,
}) => {
  return (
    <div className={styles.bgDark}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>3</div>
        <h3 className={styles.title}>Destinatarios</h3>
        <span
          className={`${styles.status} ${
            campañaSeleccionada ? styles.statusGreen : styles.statusRed
          }`}
        >
          {campañaSeleccionada
            ? "Rango de destinatarios disponible"
            : "Disponible al seleccionar la campaña"}
        </span>
      </div>

      <div className={styles.gridLayout}>
        <div>
          <label className={styles.label}>Desde</label>
          <input
            type="number"
            className={styles.input}
            placeholder="1"
            value={rangeStart || ""}
            onChange={(e) => {
              const value = e.target.value.slice(0, 5);
              setRangeStart(Number(value));
              setRangeEnd(Number(value) + 499);
            }}
            disabled={!campañaSeleccionada}
          />
        </div>
        <div>
          <label className={styles.label}>Hasta</label>
          <input
            type="number"
            className={styles.input}
            placeholder="0"
            value={rangeEnd || ""}
            onChange={(e) => {
              const value = e.target.value.slice(0, 5);
              setRangeEnd(Number(value));
              if (rangeStart !== null && Number(value) - rangeStart > 499) {
                setRangeStart(Number(value) - 499);
              }
            }}
            disabled={!campañaSeleccionada}
          />
        </div>
      </div>

      <p className={styles.exampleText}>
        Ejemplo: 1000 - 1500 (500 destinatarios)
      </p>
    </div>
  );
};

export default DestinatariosId;
