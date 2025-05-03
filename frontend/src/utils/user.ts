export const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedData = JSON.parse(storedUser);
        return parsedData.user || {}; // Devuelve el usuario o un objeto vacío si no existe
      }
      return {}; // Devuelve un objeto vacío si no se encuentra el usuario en el localStorage
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return {}; // Devuelve un objeto vacío en caso de error
    }
  };
  
  export const isUserAdmin = () => {
    const user = getCurrentUser();
    return user?.is_staff === 1; // Verifica si el usuario es un administrador
  };