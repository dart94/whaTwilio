// SubcuentaEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface Subcuenta {
  id: number;
  usuario: number;
  nombre: string;
  creado: string;
  actualizado: string;
}

interface SubcuentaEditModalProps {
  subcuenta: Subcuenta | null;
  onClose: () => void;
  onSave: (updatedSubcuenta: Subcuenta) => void;
  isOpen: boolean;
}

const SubcuentaEditModal: React.FC<SubcuentaEditModalProps> = ({ subcuenta, onClose, onSave, isOpen }) => {
  const [formData, setFormData] = useState<Subcuenta | null>(null);

  useEffect(() => {
    if (subcuenta) {
      setFormData({ ...subcuenta });
    }
  }, [subcuenta]);

  if (!isOpen || !formData) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: name === 'usuario' ? Number(value) : value
      };
    });
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
          <h2 className="modalTitle">Editar datos de subcuenta</h2>
          <button onClick={onClose} className="closeButton" aria-label="Cerrar modal">
            <FaTimesCircle size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="grid">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="input"
              />
              <div className="inputLength">{formData.nombre.length}/50</div>
            </div>

            <div>
              <label className="label">Usuario</label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                disabled
                className="input"
              />
              <div className="inputLength">Opcional</div>
            </div>
          </div>

          <div className="modalFooter">
            <button
              type="submit"
              className="submitButton"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubcuentaEditModal;
