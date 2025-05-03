// frontend/src/pages/admin/CampaignsView.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CampaignEditModal from './../../modals/CampaignEditModal';
import { CampaignData, obtenerCampanas, actualizarCampana } from '../../services/campaignService';
import styles from '../../styles/SubcuentasView.module.css';

const CampaignsAdminView: React.FC = () => {
  const [campaignsData, setCampaignsData] = useState<CampaignData[]>([]);
  const [selectedCampana, setSelectedCampana] = useState<CampaignData | null>(null);
  const [editCampanaModalOpen, setEditCampanaModalOpen] = useState(false);
  const [tabActiva, setTabActiva] = useState('campanas');

  useEffect(() => {
    const fetchCampanas = async () => {
      try {
        const data = await obtenerCampanas();
        setCampaignsData(data);
      } catch (error) {
        console.error("Error al obtener campañas:", error);
      }
    };

    if (tabActiva === 'campanas') {
      fetchCampanas();
    }
  }, [tabActiva]);

  function handleEditCampanaClick(campana: CampaignData): void {
    setSelectedCampana(campana);
    setEditCampanaModalOpen(true);
  }

  const handleCloseCampanaModal = () => {
    setEditCampanaModalOpen(false);
    setSelectedCampana(null);
  };

  const handleSaveCampana = async (updatedCampana: CampaignData) => {
    try {
      const res = await actualizarCampana(updatedCampana);
      toast.success('Campaña actualizada correctamente');
      setCampaignsData(prev =>
        prev.map(c => (c.id === res.id ? res : c))
      );
      handleCloseCampanaModal();
    } catch (error: any) {
      console.error("Error al actualizar campaña:", error);
      toast.error(`Error al actualizar campaña: ${error.message || 'Error desconocido'}`);
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
                <th>DESCRIPCIÓN</th>
                <th>SUBCUENTA</th>
                <th>CREDENCIAL TWILIO</th>
                <th>CREDENCIAL GCP</th>
                <th>PLANTILLAS</th>
                <th>SHEETS</th>
                <th>CREADO</th>
                <th>ACTUALIZADO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {campaignsData.map(campana => (
                <tr key={campana.id} className="hover:bg-gray-50">
                  <td>{campana.id}</td>
                  <td>{campana.Nombre}</td>
                  <td>{campana.Descripción}</td>
                  <td>{campana.Subcuenta}</td>
                  <td>{campana.CredencialTwilio}</td>
                  <td>{campana.CredencialGcp}</td>
                  <td>{campana.Plantillas}</td>
                  <td>{campana.Sheets}</td>
                  <td>{campana.Creado}</td>
                  <td>{campana.Actualizado}</td>
                  <td className="py-3 px-4">
                    <button
                      className={styles.btnEditar}
                      onClick={() => handleEditCampanaClick(campana)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.paginacion}>
            <button className={styles.btnPaginacion}>Anterior</button>
            <button className={styles.btnPaginacion}>Siguiente</button>
          </div>
        </div>
      

      {editCampanaModalOpen && (
        <CampaignEditModal
          campana={selectedCampana}
          onClose={handleCloseCampanaModal}
          onSave={handleSaveCampana}
          isOpen={editCampanaModalOpen}
        />
      )}
    </div>
  );
} 

export default CampaignsAdminView;
