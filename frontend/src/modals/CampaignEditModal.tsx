// frontend/src/pages/admin/CampaignEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';
import { CampaignData } from '../services/campaignService';

interface CampaignEditModalProps {
  campana: CampaignData | null;
  onClose: () => void;
  onSave: (updatedCampana: CampaignData) => void;
  isOpen: boolean;
}

const CampaignEditModal: React.FC<CampaignEditModalProps> = ({ campana, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState<CampaignData | null>(null);

  useEffect(() => {
    if (campana) {
      setFormData({ ...campana });
    }
  }, [campana]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h2 className="modalTitle">Editar Campaña: {formData.Nombre}</h2>
          <button onClick={onClose} className="closeButton">
            <FaTimesCircle size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="grid">
            <label className="label">Nombre</label>
            <input
              type="text"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="grid">
            <label className="label">Descripción</label>
            <textarea
              name="Descripción"
              value={formData.Descripción}
              onChange={handleInputChange}
              className="input"
              rows={3}
            />
          </div>
          <div className="grid">
            <label className="label">Subcuenta</label>
            <input
              type="text"
              name="Subcuenta"
              value={formData.Subcuenta}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="grid">
            <label className="label">Credencial Twilio</label>
            <input
              type="text"
              name="CredencialTwilio"
              value={formData.CredencialTwilio}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="grid">
            <label className="label">Credencial GCP</label>
            <input
              type="text"
              name="CredencialGcp"
              value={formData.CredencialGcp}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="grid">
            <label className="label">Plantillas</label>
            <input
              type="text"
              name="Plantillas"
              value={formData.Plantillas}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="grid">
            <label className="label">Sheets</label>
            <input
              type="text"
              name="Sheets"
              value={formData.Sheets}
              onChange={handleInputChange}
              className="input"
            />
          </div>
          <div className="modalFooter">
            <button type="submit" className="submitButton">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignEditModal;
