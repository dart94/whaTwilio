import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import styles from '../../styles/SubcuentasView.module.css';
import { crearNumeroTelefonico } from '../../services/numertoTelefonicoService';

const NumeroTelefonicoView: React.FC = () => {
  const [numeroTelefonicoForm, setNumeroTelefonicoForm] = useState({
    number: '',
    name: '',
    company: ''
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleNumeroTelefonicoFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    
    setNumeroTelefonicoForm({
      ...numeroTelefonicoForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCrearNumeroTelefonico = async () => {
    try {
      console.log('➡ Formulario antes de enviar:', numeroTelefonicoForm);
      await crearNumeroTelefonico(numeroTelefonicoForm);
      toast.success('Número telefónico creado exitosamente');
      // Reiniciar el formulario
      setNumeroTelefonicoForm({ number: '', name: '', company: '' });
      
    } catch (error: any) {
      console.error('Error al crear el número telefónico:', error);
      toast.error(`Error al crear el número telefónico: ${error.message || 'Error desconocido'}`);
    }
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Crear números telefónicos</h2>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Número de teléfono</label>
        <input
          type="text"
          name="number"
          placeholder="Número de teléfono"
          value={numeroTelefonicoForm.number}
          onChange={handleNumeroTelefonicoFormChange}
          className={styles.input}
        />
        <div className={styles.counter}>
          {numeroTelefonicoForm.number.length} / 10
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={numeroTelefonicoForm.name}
          onChange={handleNumeroTelefonicoFormChange}
          className={styles.input}
        />
        <div className={styles.counter}>
          {numeroTelefonicoForm.name.length} / 30
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>Compañía</label>
        <input
          type="text"
          name="company"
          placeholder="Compañía"
          value={numeroTelefonicoForm.company}
          onChange={handleNumeroTelefonicoFormChange}
          className={styles.input}
        />
        <div className={styles.counter}>
          {numeroTelefonicoForm.company.length} / 30
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          className={styles.submitButton}
          onClick={handleCrearNumeroTelefonico}
        >
          Crear número telefónico <FaPencilAlt className={styles.icon} />
        </button>
      </div>

      {mensaje.texto && (
        <div className={mensaje.tipo === 'error' ? styles.error : styles.success}>
          {mensaje.texto}
        </div>
      )}
    </div>
  );
};

export default NumeroTelefonicoView;
