// src/Components/pages/Logout.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearUser } from "../../Redux/Slices/user"; // Ajusta la ruta según tu estructura
import Swal from 'sweetalert2';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const performLogout = async () => {
      // Mostrar confirmación
      const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres salir de tu cuenta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        try {
          // Opcional: Llamar al endpoint de logout del backend si existe
          if (user?.accessToken) {
            // await fetch("/api/auth/logout", {
            //   method: "POST",
            //   headers: {
            //     "Content-Type": "application/json",
            //     Authorization: `Bearer ${user.accessToken}`
            //   }
            // });
          }
        } catch (error) {
          console.error("Error en logout:", error);
        } finally {
          // Limpiar el estado de Redux usando clearUser
          dispatch(clearUser());
          
          // Limpiar localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('accessToken');
          
          // Mostrar mensaje de éxito
          Swal.fire({
            title: 'Sesión cerrada',
            text: 'Has cerrado sesión correctamente.',
            icon: 'success',
            confirmButtonColor: '#3085d6',
          }).then(() => {
            // Redirigir al home
            navigate("/");
          });
        }
      } else {
        // Si cancela, redirigir de vuelta
        navigate(-1);
      }
    };

    performLogout();
  }, [dispatch, navigate, user]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      <p>Cerrando sesión...</p>
    </div>
  );
};

export default Logout;