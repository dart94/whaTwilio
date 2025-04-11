import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { Credencial } from '../services/credentialService';
import '../styles/modalForm.css';

interface CredencialEditModalProps {
  credencial: Credencial | null;
  onClose: () => void;
  onSave: (updatedCredencial: Credencial) => void;
  isOpen: boolean;
}

const CredencialEditModal: React.FC<CredencialEditModalProps> = ({ credencial, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState<Credencial | null>(null);

  useEffect(() => {
    if (credencial) {
      setFormData({
        ...credencial,
        json: typeof credencial.json === 'object'
          ? JSON.stringify(credencial.json, null, 2)
          : credencial.json
      });
    }
  }, [credencial]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">Editar credencial: {formData?.name}</h2>
          <button onClick={onClose} className="closeButton" aria-label="Cerrar modal">
            <FaTimesCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="grid">
            <label className="label">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData?.name}
              onChange={handleInputChange}
              className="input"
            />
          </div>

          <div className="grid">
            <label className="label">JSON</label>
            <textarea
              name="json"
              value={formData?.json}
              onChange={handleInputChange}
              className="input"
              rows={4}
            />
          </div>

          <div className="modalFooter">
            <button type="submit" className="submitButton">
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CredencialEditModal;
