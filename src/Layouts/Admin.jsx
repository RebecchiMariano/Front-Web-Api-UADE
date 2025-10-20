import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const Admin = () => {
  const user = useSelector((state) => state.user.value);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await fetch(`/api/usuario`);
        // const data = await response.json();
        setProfile("administrador");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (!user || user === null) {
      navigate("/login");
    } else {
      fetchProfile();
    }
  }, [user, navigate]);
  useEffect(() => {
    if (profile !== "administrador") {
      navigate("/");
    }
  }, [profile, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
};

export default Admin;
