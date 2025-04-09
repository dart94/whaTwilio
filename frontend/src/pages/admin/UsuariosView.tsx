// frontend/src/pages/admin/UsuariosView.tsx
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaPencilAlt } from 'react-icons/fa';
import { obtenerUsuario } from '../../services/userService';
import styles from '../../styles/subcuentasView.module.css'; 

interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  is_active: boolean;
  date_joined: string;
  last_login: string;
}

const UsuariosView: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Si tu API retorna paginación

  useEffect(() => {
    // Función para obtener la lista de usuarios
    const fetchUsuarios = async () => {
      try {
        const data = await obtenerUsuario();
        setUsuarios(data);
        // Si tu API incluye datos de paginación, podrás actualizar currentPage y totalPages aquí.
      } catch (error: any) {
        console.error('Error al obtener usuarios:', error);
        toast.error('Error al obtener usuarios');
      }
    };

    fetchUsuarios();
  }, [currentPage]);

  const handleEditClick = (usuario: Usuario) => {

    console.log("Editar usuario", usuario);
    toast.info(`Editar usuario ID: ${usuario.id}`);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);

    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);

    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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
                    Editar
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
    </div>
  );
};

export default UsuariosView;
