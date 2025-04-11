// frontend/src/pages/UserEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { actualizarUsuario, Usuario } from '../services/userService';
import { toast } from 'react-toastify';
import '../styles/modalForm.css';

interface UserEditModalProps {
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (updatedUser: Usuario) => void;
  isOpen: boolean;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ usuario, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState<Usuario | null>(null);

  useEffect(() => {
    if (usuario) {
      setFormData({ ...usuario });
    }
  }, [usuario]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: (e.target as HTMLInputElement).checked,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleRadioChange = (name: string, value: boolean) => {
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
  
    try {
      const updatedUser = await actualizarUsuario(formData);
      onSave(updatedUser);  
      onClose();  
      
    
      setTimeout(() => {
        toast.success('Usuario actualizado exitosamente');
      }, 100);
      
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">Editar datos de {formData.email}</h2>
          <button onClick={onClose} className="closeButton" aria-label="Cerrar modal">
            <FaTimesCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="grid">
            <div className="formGroup">
              <label className="label">Nombre de usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input"
                maxLength={50}
              />
              <div className="inputLength">{formData.username.length}/50</div>
            </div>
            
            <div className="formGroup">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                maxLength={100}
              />
              <div className="inputLength">{formData.email.length}/100</div>
            </div>
            
            <div className="formGroup">
              <label className="label">Nombres</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                className="input"
                maxLength={50}
              />
              <div className="inputLength">{formData.first_name.length}/50</div>
            </div>
            
            <div className="formGroup">
              <label className="label">Apellidos</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                className="input"
                maxLength={50}
              />
              <div className="inputLength">{formData.last_name.length}/50</div>
            </div>
            
            <div className="formGroup">
              <label className="label">Contraseña</label>
              <input
                type="password"
                name="password"
                placeholder="Ingrese nueva contraseña"
                className="input"
              />
              <div className="inputLength">Opcional</div>
            </div>
            
            <div className="formGroup">
              <label className="label">Admin</label>
              <div className="radioGroup">
                <div 
                  className={`radioOption ${formData.is_superuser ? 'radioActive' : ''}`}
                  onClick={() => handleRadioChange('is_superuser', true)}
                >
                  Sí
                </div>
                <div 
                  className={`radioOption ${!formData.is_superuser ? 'radioActive' : ''}`}
                  onClick={() => handleRadioChange('is_superuser', false)}
                >
                  No
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid">
            <div className="formGroup">
              <label className="label">Activo</label>
              <div className="radioGroup">
                <div 
                  className={`radioOption ${formData.is_active ? 'radioActive' : ''}`}
                  onClick={() => handleRadioChange('is_active', true)}
                >
                  Sí
                </div>
                <div 
                  className={`radioOption ${!formData.is_active ? 'radioActive' : ''}`}
                  onClick={() => handleRadioChange('is_active', false)}
                >
                  No
                </div>
              </div>
            </div>
          </div>
  
          <div className="modalFooter">
            <button
              type="button"
              onClick={onClose}
              className="submitButton"
              style={{ backgroundColor: '#e53e3e', marginRight: '0.5rem' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submitButton"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;