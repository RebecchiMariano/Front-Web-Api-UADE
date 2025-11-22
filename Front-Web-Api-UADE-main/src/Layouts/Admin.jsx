import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const Admin = () => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      setIsChecking(true);
      
      if (!user?.accessToken) {
        navigate("/login");
        return;
      }

      try {
        const decoded = jwtDecode(user.accessToken);
        const roles = decoded?.roles || decoded?.authorities || [];
        
        if (!roles.includes("ROLE_ADMINISTRADOR")) {
          navigate("/");
          return;
        }
        
        // Si es admin, permitir acceso
        setIsChecking(false);
      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [user, navigate]);

  // Mientras verifica, muestra loading
  if (isChecking) {
    return <div>Cargando...</div>;
  }

  return <Outlet />;
};

export default Admin;