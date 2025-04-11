// NumeroTelefonicoEditModal.tsx
import React, { useState, useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa';

interface NumeroTelefonico {
    id: number;
    nombre: string;
    compania: string;
    numero: string;
    creado: string;
    actualizado: string;
}

interface NumeroTelefonicoEditModalProps {
    numeroTelefonico: NumeroTelefonico | null;
    onClose: () => void;
    onSave: (updatedNumeroTelefonico: NumeroTelefonico) => void;
    isOpen: boolean;
}

const NumeroTelefonicoEditModal: React.FC<NumeroTelefonicoEditModalProps> = ({ numeroTelefonico, onClose, onSave, isOpen }) => {
    const [formData, setFormData] = useState<NumeroTelefonico | null>(null);

    useEffect(() => {
        if (numeroTelefonico) {
            setFormData({ ...numeroTelefonico });
        }
    }, [numeroTelefonico]);

    if (!isOpen || !formData) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            if (!prev) return prev;

            return {
                ...prev,
                [name]: value
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
                            <label className="label">Compañía</label>
                            <input
                                type="text"
                                name="compania"
                                value={formData.compania}
                                onChange={handleInputChange}
                                className="input"
                            />
                            <div className="inputLength">Opcional</div>
                        </div>
                    </div>

                    <div>
                        <label className="label">Número</label>
                        <input
                            type="text"
                            name="numero"
                            value={formData.numero}
                            onChange={handleInputChange}
                            className="input"
                        />
                        <div className="inputLength">{formData.numero.length}/10</div>
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

export default NumeroTelefonicoEditModal;