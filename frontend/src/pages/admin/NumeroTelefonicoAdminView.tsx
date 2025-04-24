// frontend/src/pages/admin/NumeroTelefonicoView.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import NumeroTelefonicoEditModal from '../../modals/NumeroTelefonicoEditModal';
import { actualizarNumeroTelefonico, NumeroTelefonico, obtenerNumerosTelefonicos } from '../../services/numeroTelefonicoService';
import styles from '../../styles/subcuentasView.module.css';
import { FaPencilAlt } from 'react-icons/fa';


const NumeroTelefonicoAdminView: React.FC = () => {
  const [numberPhonesData, setNumberPhonesData] = useState<NumeroTelefonico[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 10; // o el valor que manejes
  const [selectedNumeroTelefonico, setSelectedNumeroTelefonico] = useState<NumeroTelefonico | null>(null);
  const [editNumeroTelefonicoModalOpen, setEditNumeroTelefonicoModalOpen] = useState(false);
  const [tabActiva, setTabActiva] = useState('numeros-tab');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchNumerosTelefonicos = async () => {
      try {
        const data = await obtenerNumerosTelefonicos();
        setNumberPhonesData(data);
      } catch (error: any) {
        console.error("Error al obtener números telefónicos:", error);
        toast.error('Error al obtener números telefónicos');
      }
    };
    
    void fetchNumerosTelefonicos();
  }, []);

  function handleEditNumeroTelefonicoClick(numero: NumeroTelefonico): void {
    setSelectedNumeroTelefonico(numero);
    setEditNumeroTelefonicoModalOpen(true);
  }

  const handleCloseNumeroTelefonicoModal = () => {
    setEditNumeroTelefonicoModalOpen(false);
    setSelectedNumeroTelefonico(null);
  };

      // Funciones para paginación (opcional)
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      };
    
      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(prev => prev + 1);
        }
      };

  const handleSaveNumeroTelefonico = async (updatedNumero: NumeroTelefonico) => {
    try {
      const res = await actualizarNumeroTelefonico(updatedNumero);
      toast.success('Número telefónico actualizado correctamente');
      // Actualiza el estado local de los números telefónicos
      setNumberPhonesData(prev =>
        prev.map(num => (num.id === res.id ? res : num))
      );
      handleCloseNumeroTelefonicoModal();
    } catch (error: any) {
      console.error("Error al actualizar número:", error);
      toast.error(`Error al actualizar número: ${error.message || 'Error desconocido'}`);
    }
  };

  return (
        <div className={styles.contenedor}>
        <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE</th>
                <th>COMPAÑÍA</th>
                <th>NÚMERO</th>
                <th>CREADO</th>
                <th>ACTUALIZADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {numberPhonesData.map(numero => (
                <tr key={numero.id}>
                  <td>{numero.id}</td>
                  <td>{numero.nombre}</td>
                  <td>{numero.compania}</td>
                  <td>{numero.numero ? `+52 ${numero.numero}` : '+52 0'}</td>
                  <td>{numero.creado}</td>
                  <td>{numero.actualizado}</td>
                  <td className="py-3 px-4">
                    <button
                      className={styles.btnEditar}
                      onClick={() => handleEditNumeroTelefonicoClick(numero)}
                    >
                      <FaPencilAlt /> EditarEditar
                    </button>
                  </td>
                </tr>
              ))}
              {numberPhonesData.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    No hay números telefónicos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
              <div className={styles.paginacion}>
                <button className={styles.btnPaginacion} onClick={handlePrevPage}>
                  Anterior
                </button>
                <button className={styles.btnPaginacion} onClick={handleNextPage}>
                  Siguiente
                </button>
            </div>
          </div>
        
    

      {editNumeroTelefonicoModalOpen && (
        <NumeroTelefonicoEditModal
          numeroTelefonico={selectedNumeroTelefonico ? {
            id: selectedNumeroTelefonico.id,
            nombre: selectedNumeroTelefonico.nombre,
            compania: selectedNumeroTelefonico.compania,
            numero: selectedNumeroTelefonico.numero,
            creado: selectedNumeroTelefonico.creado,
            actualizado: selectedNumeroTelefonico.actualizado
          } : null}
          onClose={handleCloseNumeroTelefonicoModal}
          onSave={(updatedNumeroTelefonico) => {
            void handleSaveNumeroTelefonico({
              id: updatedNumeroTelefonico.id,
              numero: updatedNumeroTelefonico.numero,
              nombre: updatedNumeroTelefonico.nombre,
              compania: updatedNumeroTelefonico.compania,
              creado: updatedNumeroTelefonico.creado,
              actualizado: updatedNumeroTelefonico.actualizado
            });
          }}
          isOpen={editNumeroTelefonicoModalOpen}
        />
      )}
    </div>
  );
};

export default NumeroTelefonicoAdminView;
