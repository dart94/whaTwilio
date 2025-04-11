
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { actualizarSubcuenta, obtenerSubcuentas, Subcuenta } from '../../services/subcuentaService';
import SubcuentaEditModal from '../../modals/SubcuentaEditModal';
import styles from '../../styles/subcuentasView.module.css';
import { FaPencilAlt } from 'react-icons/fa';

const SubcuentasAdminView: React.FC = () => {
  const [subcuentasData, setSubcuentasData] = useState<Subcuenta[]>([]);
  const [editSubcuentaModalOpen, setEditSubcuentaModalOpen] = useState(false);
  const [selectedSubcuenta, setSelectedSubcuenta] = useState<Subcuenta | null>(null);
  const [tabActiva, setTabActiva] = useState('subcuentas-tab');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 

  useEffect(() => {
    const fetchSubcuentas = async () => {
      try {
        const data = await obtenerSubcuentas();
        setSubcuentasData(data);
      }
      catch (error: any) {
        console.error("Error al obtener subcuentas:", error);
        toast.error('Error al obtener subcuentas');
      }
    };
    fetchSubcuentas();
  }, [setTabActiva]);

  function handleEditSubcuentaClick(subcuenta: Subcuenta): void {
    setSelectedSubcuenta(subcuenta);
    setEditSubcuentaModalOpen(true);

  }

  const handleCloseSubcuentaModal = () => {
    setEditSubcuentaModalOpen(false);
    setSelectedSubcuenta(null);
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

  const handleSaveSubcuenta = async (updatedSubcuenta: Subcuenta) => {
    try {
      const response = await actualizarSubcuenta(updatedSubcuenta);
      toast.success('Subcuenta actualizada correctamente');

      // Actualiza el estado local de subcuentas
      setSubcuentasData(prev =>
        prev.map(subc => subc.id === response.id ? response : subc)
      );
      setEditSubcuentaModalOpen(false);
      setSelectedSubcuenta(null);
    } catch (error: any) {
      console.error("Error al actualizar subcuenta:", error);
      toast.error(`Error al actualizar subcuenta: ${error.message || 'Error desconocido'}`);
    }
  };

  return (

        <div className={styles.contenedor}>
        <div className={styles.tablaWrapper}>
            <table className={styles.tabla}>
            <thead>
              <tr>
                <th>ID</th>
                <th>USUARIO</th>
                <th>NOMBRE</th>
                <th>CREACIÓN</th>
                <th>ACTUALIZADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {subcuentasData.map(subcuenta => (
                <tr key={subcuenta.id}>
                  <td>{subcuenta.id}</td>
                  <td>{subcuenta.usuario}</td>
                  <td>{subcuenta.nombre}</td>
                  <td>{subcuenta.creado}</td>
                  <td>{subcuenta.actualizado}</td>
                  <td>
                    <button
                      className={styles.btnEditar}
                      onClick={() => handleEditSubcuentaClick(subcuenta)}
                    >
                      <FaPencilAlt /> Editar
                    </button>
                  </td>
                </tr>
              ))}
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



    {/* Render del modal para editar usuario */}
      {editSubcuentaModalOpen && (
        <SubcuentaEditModal
          subcuenta={selectedSubcuenta}
          onClose={handleCloseSubcuentaModal}
          onSave={handleSaveSubcuenta}
          isOpen={editSubcuentaModalOpen}
        />
      )}
    </div>
  );
};
    

export default SubcuentasAdminView;
