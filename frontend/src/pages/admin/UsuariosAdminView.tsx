// frontend/src/pages/admin/UsuariosView.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt } from 'react-icons/fa';
import { obtenerUsuarios } from '../../services/userService';
import styles from '../../styles/subcuentasView.module.css';
import UserEditModal from '../../modals/UserEditModal'; 

// Interfaz de Usuario 
export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

const UsuariosView: React.FC = () => {
  // Estados para la lista y paginación (si aplica)
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Si tu API soporta paginación

  // Estados para el modal de edición
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Carga de usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await obtenerUsuarios();
        setUsuarios(data);
        // Si la respuesta incluye datos de paginación, actualiza currentPage y totalPages
      } catch (error: any) {
        console.error('Error al obtener usuarios:', error);
        toast.error('Error al obtener usuarios');
      }
    };

    fetchUsuarios();
  }, [currentPage]);

  // Función para abrir el modal y seleccionar el usuario a editar
  function handleEditClick(usuario: Usuario): void {
    setSelectedUser(usuario);
    setEditModalOpen(true);
  }

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  // Función para guardar los cambios del usuario editado
  const handleSaveUser = (updatedUser: Usuario) => {
    const updatedUsuarios = usuarios.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsuarios(updatedUsuarios);
    handleCloseModal();
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

  return (
    <div className={styles.contenedor}>
      <div className={styles.tablaWrapper}>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>ID</th>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>NOMBRE</th>
              <th>ADMIN</th>
              <th>ACTIVO</th>
              <th>CREACIÓN</th>
              <th>ÚLTIMO LOGIN</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.username}</td>
              <td>{usuario.email}</td>
              <td>{usuario.first_name} {usuario.last_name}</td>
              <td>{usuario.is_superuser ? 'SI' : 'NO'}</td>
              <td>{usuario.is_active ? 'SI' : 'NO'}</td>
              <td>{usuario.date_joined}</td>
              <td>{usuario.last_login}</td>
              <td>
                <button
                  className={styles.btnEditar}
                  onClick={() => handleEditClick(usuario)}
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
      {editModalOpen && (
        <UserEditModal
          usuario={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          isOpen={editModalOpen}
        />
      )}
    </div>
  );
};

export default UsuariosView;
