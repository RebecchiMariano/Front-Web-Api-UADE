import { useEffect } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

const User = () => {
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <>
      <Outlet />
    </>
  );
};

export default User;
