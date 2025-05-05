// src/pages/admin/AsociarCredencialesView.tsx
import React, { useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import styles from '../../styles/AsociarNumerosView.module.css';
import { associateCredentials } from '../../services/credentialAssociationService';
import { buscarSubcuentasPorUsuario } from '../../services/subcuentaService';
import { getUserCredentials } from '../../services/credentialService';
import { toast, ToastContainer } from 'react-toastify';
import BuscarUsuario from '../../components/forms/BuscarUsuario';
import SubcuentaSelector from '../../components/forms/SubcuentaSelector';



interface CredentialAssociation {
  credential_id: number;
}

interface CredentialAssociationRowProps {
  index: number;
  association: CredentialAssociation;
  onChange: (index: number, credentialId: number) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  disabled: boolean;
  options: Array<{ id: number; name: string }>;
  isRemoveDisabled: boolean;
}

const CredentialAssociationRow: React.FC<CredentialAssociationRowProps> = ({
  index,
  association,
  onChange,
  onAdd,
  onRemove,
  disabled,
  options,
  isRemoveDisabled,
}) => (
  <div className={styles.credentialAssociation}>
    <div className={styles.inputWrapper}>
      <label className={styles.label}>Credencial</label>
      <select
        value={association.credential_id}
        onChange={(e) => onChange(index, Number(e.target.value))}
        className={styles.select}
        disabled={disabled}
      >
        <option value={0} className={styles.option}>Seleccionar credencial</option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className={styles.option}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
    <div className={styles.buttonGroupSmall}>
      <button
      className={styles.smallButton}
      onClick={onAdd}
      disabled={disabled}
      >
        <span className={styles.plus}>+</span>
      </button>
      <button
        className={styles.smallButton}
        onClick={() => onRemove(index)}
        disabled={disabled || isRemoveDisabled}
      >
        <span className={styles.minus}>-</span>
      </button>
    </div>
  </div>
);

const AsociarCredencialesView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<number>(0);
  const [userSubcuentas, setUserSubcuentas] = useState<any[]>([]);
  const [userCredentials, setUserCredentials] = useState<any[]>([]);
  const [credentialAssociations, setCredentialAssociations] = useState<CredentialAssociation[]>([{ credential_id: 0 }]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleBuscarUsuario = async () => {
    try {
      const subcuentasData = await buscarSubcuentasPorUsuario(email);
      setUserSubcuentas(subcuentasData);

      const credencialesData = await getUserCredentials(email);
      setUserCredentials(credencialesData);

      if (subcuentasData.length === 0) {
        toast.error('No se encontró ninguna subcuenta para este usuario');
      } else {
        toast.success(`Se encontró ${subcuentasData.length} subcuenta(s) para este usuario`);
      }

      if (credencialesData.length === 0) {
        toast.warn('El usuario no tiene credenciales asignadas');
      }
    } catch (error: any) {
      console.error("Error al buscar datos:", error);
      toast.error('Error al buscar datos para este usuario');
    }
  };

  const handleSubcuentasEncontradas = (subcuentas: any[]) => {
    setUserSubcuentas(subcuentas);
    if (subcuentas.length === 0) {
      toast.error('No se encontró ninguna subcuenta para este usuario');
    } else {
      toast.success(`Se encontró ${subcuentas.length} subcuenta(s) para este usuario`);
    }
  };

  const handleBuscarCredencial = async (email: string) => {
    try {
      const credencialesData = await getUserCredentials(email);
      setUserCredentials(credencialesData);
      
      if (credencialesData.length === 0) {
        toast.warn('El usuario no tiene credenciales asignadas');
      }
    } catch (error) {
      console.error("Error al buscar credenciales:", error);
      toast.error('Error al buscar credenciales del usuario');
    }
  };

  const handleAssociateCredentials = async () => {
    if (!subcuentaSeleccionada) {
      toast.error('Debe seleccionar una subcuenta');
      return;
    }
    try {
      await associateCredentials(subcuentaSeleccionada, credentialAssociations);
      toast.success('Credenciales asociadas correctamente');
      setCredentialAssociations([{ credential_id: 0 }]);
    } catch (error: any) {
      console.error('Error al asociar credenciales:', error);
      toast.error('Error al asociar credenciales: ' + error.message);
    }
  };

  const handleAddCredentialAssociation = () => {
    setCredentialAssociations([...credentialAssociations, { credential_id: 0 }]);
  };

  const handleRemoveCredentialAssociation = (index: number) => {
    if (credentialAssociations.length > 1) {
      const newAssociations = [...credentialAssociations];
      newAssociations.splice(index, 1);
      setCredentialAssociations(newAssociations);
    }
  };

  const handleCredentialChange = (index: number, credentialId: number) => {
    const newAssociations = [...credentialAssociations];
    newAssociations[index].credential_id = credentialId;
    setCredentialAssociations(newAssociations);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Asociar Credenciales</h2>
      <hr className={styles.hr} />

      {/* Sección de Usuario */}
      <BuscarUsuario
        onSubcuentasEncontradas={handleSubcuentasEncontradas}
        handleBuscarCredencial={handleBuscarCredencial}
        
      />

      {/* Sección de Subcuenta */}
      <SubcuentaSelector
        userSubcuentas={userSubcuentas}
        subcuentaSeleccionada={subcuentaSeleccionada}
        onSubcuentaChange={setSubcuentaSeleccionada}
      />

      <hr className={styles.hr} />
      <h3 className={styles.subHeading}>Credenciales</h3>

      {/* Sección dinámica para asociaciones de credenciales */}
      {credentialAssociations.map((association, index) => (
        <CredentialAssociationRow
          key={index}
          index={index}
          association={association}
          onChange={handleCredentialChange}
          onAdd={handleAddCredentialAssociation}
          onRemove={handleRemoveCredentialAssociation}
          disabled={subcuentaSeleccionada === 0}
          options={userCredentials}
          isRemoveDisabled={credentialAssociations.length <= 1}
        />
      ))}

      <hr className={styles.hr} />
      <div className={styles.buttonContainer}>
        <button className={styles.submitButton} onClick={handleAssociateCredentials}>
          Asociar credenciales <FaPencilAlt className={styles.icon} />
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

export default AsociarCredencialesView;
