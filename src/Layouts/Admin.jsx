import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

const Admin = () => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!user?.accessToken) return navigate("/login");

      try {
        const decoded = jwtDecode(user.accessToken);

        const roles =
          decoded.roles ||
          decoded.authorities?.map(a => a.authority) ||
          [];

        // Permitir ADMIN en cualquiera de estas variantes
        const hasAdminRole =
          roles.includes("ROLE_ADMINISTRADOR") ||
          roles.includes("ADMINISTRADOR") ||
          roles.includes("ADMIN") ||
          roles.includes("ROLE_ADMIN");

        if (!hasAdminRole) {
          navigate("/");
          return;
        }

        setIsChecking(false);

      } catch (error) {
        console.error("Error decoding token:", error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [user, navigate]);

  if (isChecking) return <div>Cargando...</div>;

  return <Outlet />;
};

export default Admin;
