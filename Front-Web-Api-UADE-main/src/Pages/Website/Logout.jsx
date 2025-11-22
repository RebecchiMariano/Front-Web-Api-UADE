import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { clearUser } from "../../Redux/Slices/user"; 

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    const handleLogout = async () => {
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
        if (user?.accessToken) {
        }
        
        dispatch(clearUser());
        
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión correctamente.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          navigate("/");
        });
      } else {
        navigate(-1);
      }
    };

    handleLogout();
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