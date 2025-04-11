import React, { useState, useEffect, useRef } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Credencial, actualizarCredencial, obtenerCredenciales } from '../../services/credentialService';
import CredencialEditModal from '../../modals/CredencialEditModal';
import styles from '../../styles/subcuentasView.module.css';

interface CredencialViewProps {
  credentials: Credencial[];
}

const CredencialAdminView: React.FC<CredencialViewProps> = ({ credentials: initialCredentials }) => {
  const [credentials, setCredentials] = useState<Credencial[]>(initialCredentials);
  const [selectedCredencial, setSelectedCredencial] = useState<Credencial | null>(null);
  const [editCredencialModalOpen, setEditCredencialModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tooltipId, setTooltipId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visibleJsonId, setVisibleJsonId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCredenciales = async () => {
      try {
        const data = await obtenerCredenciales();
        setCredentials(data);
      } catch (error: any) {
        console.error("Error al obtener credenciales:", error);
        toast.error('Error al obtener credenciales');
      }
    };
    fetchCredenciales();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setTooltipId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEditCredencialClick = (credencial: Credencial) => {
    setSelectedCredencial(credencial);
    setEditCredencialModalOpen(true);
  };

  const toggleJsonVisibility = (id: number) => {
    setVisibleJsonId(prevId => (prevId === id ? null : id));
  };

  const handleCloseCredencialModal = () => {
    setEditCredencialModalOpen(false);
    setSelectedCredencial(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

    const handleSaveCredencial = async (updatedCredencial: Credencial) => {
        try {
            await actualizarCredencial(updatedCredencial);
            setCredentials(prevCredentials => 
                prevCredentials.map(cred => 
                    cred.id === updatedCredencial.id ? updatedCredencial : cred
                )
            );
            toast.success('Credencial actualizada exitosamente');
            handleCloseCredencialModal();
        } catch (error) {
            console.error('Error al actualizar credencial:', error);
            toast.error('Error al actualizar credencial');
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
      <th>JSON</th>
      <th>CREADO</th>
      <th>ACTUALIZADO</th>
      <th>ACCIONES</th>
    </tr>
  </thead>
  <tbody>
    {credentials.map((credencial) => (
      <tr key={credencial.id} className="hover:bg-gray-50">
        <td>{credencial.id}</td>
        <td>{credencial.name}</td>
        <td className={styles.jsonCell}>
          <div className={styles.jsonWrapper}>
            <button
              className={styles.btnEditar}
              onClick={() =>
                setTooltipId(tooltipId === credencial.id ? null : credencial.id)
              }
            >
              Ver
            </button>

            {tooltipId === credencial.id && (
              <div className={styles.tooltip} ref={tooltipRef}>
                <div className={styles.jsonPreview}>
                  {Object.entries(credencial.json).map(([key, value]) => (
                    <div key={key}>
                      <span className={styles.key}>"{key}"</span>:{" "}
                      <span
                        className={
                          typeof value === "string"
                            ? styles.string
                            : styles.value
                        }
                      >
                        {typeof value === "string"
                          ? `"${value}"`
                          : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  className={styles.copyBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(
                      JSON.stringify(credencial.json, null, 2)
                    );
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copiado ✅" : "📋 Copiar JSON"}
                </button>
              </div>
            )}
          </div>
        </td>
        <td>{credencial.created_at}</td>
        <td>{credencial.updated_at}</td>
        <td className="py-3 px-4    ">
          <button
            className={styles.btnEditar}
            onClick={() => handleEditCredencialClick(credencial)}
          >
            <FaPencilAlt /> Editar
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


        <div className={styles.paginacion}>
          <button className={styles.btnPaginacion} onClick={handlePrevPage}>Anterior</button>
          <button className={styles.btnPaginacion} onClick={handleNextPage}>Siguiente</button>
        </div>
      </div>

      {editCredencialModalOpen && (
        <CredencialEditModal
          credencial={selectedCredencial}
          onClose={handleCloseCredencialModal}
          onSave={handleSaveCredencial}
          isOpen={editCredencialModalOpen}
        />
      )}
    </div>
  );
};

export default CredencialAdminView;
