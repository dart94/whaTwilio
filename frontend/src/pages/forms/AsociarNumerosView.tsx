import React, { useState } from 'react';
import styles from '../../styles/AsociarNumerosView.module.css';
import { ToastContainer, toast } from 'react-toastify';
import { buscarSubcuentasPorUsuario } from '../../services/subcuentaService';
import { obtenerNumerosTelefonicos } from '../../services/numertoTelefonicoService';
import { associateNumbersToSubAccount } from '../../services/credentialAssociationService';

const AsociarNumerosView: React.FC = () => {
  // Estados locales
  const [email, setEmail] = useState('');
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);
  const [phoneAssociations, setPhoneAssociations] = useState<{ number_phone: number }[]>([{ number_phone: 0 }]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [numerosTelefonicos, setNumerosTelefonicos] = useState<any[]>([]);

  // Funciones para agregar y quitar asociaciones
  const addPhoneAssociation = () => {
    setPhoneAssociations([...phoneAssociations, { number_phone: 0 }]);
  };

  const removePhoneAssociation = (index: number) => {
    if (phoneAssociations.length > 1) {
      const newAssociations = [...phoneAssociations];
      newAssociations.splice(index, 1);
      setPhoneAssociations(newAssociations);
    }
  };

  // Función para buscar usuario 
    const handleBuscarUsuario = async () => {
      try {
        const data = await buscarSubcuentasPorUsuario(email);
        setUserSubcuentas(data);

        const numerosData = await obtenerNumerosTelefonicos();
        setNumerosTelefonicos(numerosData);
    
        if (data.length === 0) {
          toast.error('No se encontró ninguna subcuenta para este usuario');
        } else {
          toast.success(`Se encontró ${data.length} subcuenta(s) para este usuario`);
        }

        if (numerosData.length === 0) {
          toast.warn('El usuario no tiene números telefónicos asociados');
        }
      } catch (error: any) {
        console.error("Error al buscar subcuentas:", error);
        toast.error('Error al buscar subcuentas para este usuario');
      }
    };

  // Función para asociar números telefónicos
  const handleAssociateNumbers = async () => {
    if(!email){
      toast.error('Debe ingresar un correo electrónico');
      return;
    }
    if (!subcuentaSeleccionada || subcuentaSeleccionada === 0) {
      toast.error('Debe seleccionar una subcuenta');
      return;
    }
    
    try {
      await associateNumbersToSubAccount(subcuentaSeleccionada, phoneAssociations);
      toast.success('Números telefónicos asociados correctamente');
    } catch (error: any) {
      toast.error('Error al asociar números telefónicos: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Asociar números telefónicos</h2>
      <hr className={styles.hr} />

      {/* Sección Usuario */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Usuario</label>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
          <button className={styles.button} onClick={handleBuscarUsuario}>
            Buscar
          </button>
          <button className={styles.button}>
            Lista de usuarios
          </button>
        </div>
      </div>

      {/* Sección Subcuenta */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Subcuenta</label>
        <select
          value={subcuentaSeleccionada}
          onChange={(e) => setSubcuentaSeleccionada(Number(e.target.value))}
          className={styles.select}
          disabled={userSubcuentas.length === 0}
        >
          <option value={0} className={styles.option}>Seleccionar compañía</option>
          {userSubcuentas.map(subcuenta => (
            <option key={subcuenta.id} value={subcuenta.id} className={styles.option}>
              {subcuenta.Nombre}
            </option>
          ))}
        </select>
      </div>

      <hr className={styles.hr} />
      <h3 className={styles.subHeading}>Números telefónicos</h3>

      {/* Asociaciones de números */}
      {phoneAssociations.map((association, index) => (
        <div key={index} className={styles.phoneAssociation}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>Número telefónico</label>
            <select
              value={association.number_phone}
              onChange={(e) => {
                const newAssociations = [...phoneAssociations];
                newAssociations[index].number_phone = Number(e.target.value);
                setPhoneAssociations(newAssociations);
              }}
              className={styles.select}
              disabled={subcuentaSeleccionada === 0}
            >
              <option value={0} className={styles.option}>Seleccionar número telefónico</option>
              {numerosTelefonicos.map(numero => (
                <option key={numero.id} value={numero.id} className={styles.option}>
                  {numero.nombre} - {numero.numero}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.buttonGroupSmall}>
            <button
              className={styles.smallButton}
              onClick={addPhoneAssociation}
              disabled={subcuentaSeleccionada === 0}
            >
              <span className={styles.plus}>+</span>
            </button>
            <button
              className={styles.smallButton}
              onClick={() => removePhoneAssociation(index)}
              disabled={subcuentaSeleccionada === 0 || phoneAssociations.length <= 1}
            >
              <span className={styles.minus}>-</span>
            </button>
          </div>
        </div>
      ))}

      {/* Botón para asociar números */}
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleAssociateNumbers}>
          Asociar números telefónicos <span className={styles.icon}>✚</span>
        </button>
      </div>

      <ToastContainer 
        position="top-right"  
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={styles.customToast}
      />
    </div>
  );
};

export default AsociarNumerosView;
