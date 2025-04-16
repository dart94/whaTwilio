import React, { useState, useEffect, useRef } from 'react';
import { MdSms } from 'react-icons/md';
import styles from '../../styles/AsociarCredencialesView.module.css';

interface TooltipSMSProps {
  body: string;
}

const TooltipSMS: React.FC<TooltipSMSProps> = ({ body }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleTooltip = () => {
    setShowTooltip(prev => !prev);
  };

  // Cierra el tooltip si haces clic fuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowTooltip(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.tooltipWrapper} ref={wrapperRef}>
      <button className={styles.button} onClick={toggleTooltip}>
        <MdSms />
      </button>
      {showTooltip && (
        <div className={styles.tooltip}>
          {body || 'No hay contenido'}
        </div>
      )}
    </div>
  );
};

export default TooltipSMS;
