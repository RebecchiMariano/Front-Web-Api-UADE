import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Icon } from "@iconify/react";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

import Style from "../../Styles/components/Header.module.css";
import Search from "./Search";

const IconPath = "/img/Icon.svg";
const paths = {
  default: [
    {
      id: 1,
      path: "/productos",
      name: "Productos",
      icon: null,
      left: false,
    },
    {
      id: 2,
      path: "/about",
      name: "Nosotros",
      icon: null,
      left: false,
    },
    {
      id: 3,
      path: "/questions",
      name: "Preguntas",
      icon: null,
      left: false,
    },
    { id: 4, path: "/login", name: "Ingresar", icon: "mdi:user", left: true },
  ],
  comprador: [
    {
      id: 1,
      path: "/user",
      name: "Usuario",
      icon: "mdi:user",
      left: true,
    },
    {
      id: 2,
      path: "/logout",
      name: "Salir",
      icon: "mdi:logout",
      left: true,
    },
    {
      id: 3,
      path: "/user/cart",
      name: "Carrito",
      icon: "mdi:cart",
      left: true,
    },
    {
      id: 4,
      path: "/productos",
      name: "Productos",
      icon: null,
      left: false,
    },
    {
      id: 5,
      path: "/about",
      name: "Nosotros",
      icon: null,
      left: false,
    },
    {
      id: 6,
      path: "/questions",
      name: "Preguntas",
      icon: null,
      left: false,
    },
  ],
  administrador: [
    {
      id: 1,
      path: "/admin",
      name: "Usuario",
      icon: "mdi:user",
      left: true,
    },
    {
      id: 2,
      path: "/logout",
      name: "Salir",
      icon: "mdi:logout",
      left: true,
    },
    {
      id: 3,
      path: "/admin/orders",
      name: "Ordenes",
      icon: null,
      left: false,
    },
    {
      id: 4,
      path: "/admin/products",
      name: "Productos",
      icon: null,
      left: false,
    },
  ],
};

const Header = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState("default");
  const user = useSelector((state) => state.user.value);
  const location = useLocation();
  useEffect(() => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setProfile("default");
      return;
    }
    try {
  const decoded = jwtDecode(token);
      // Ajusta el nombre del campo según tu backend, por ejemplo decoded.role
      const role = decoded.role || decoded.rol || decoded.authorities || "";
      if (role === "ADMINISTRADOR") {
        setProfile("administrador");
      } else if (role === "COMPRADOR") {
        setProfile("comprador");
      } else {
        setProfile("default");
      }
    } catch (err) {
      setProfile("default");
    }
  }, [user]);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [location]);
  return (
    <header className={Style.header}>
      {!isMobile && (
        <nav className={Style.mainNav}>
          {paths[profile]
            .filter((path) => !path.left)
            .map((path) => (
              <Link key={path.id} to={path.path}>
                {path.name}
              </Link>
            ))}
        </nav>
      )}
      <Link to="/" className={Style.logoLink}>
        <img src={IconPath} alt="Logo de la empresa" />
      </Link>
      <section className={Style.headerActions}>
        <Search />
        <nav className={Style.userNav}>
          {paths[profile]
            .filter((path) => path.left)
            .map((path) => (
              <Link key={path.id} to={path.path}>
                <Icon icon={path.icon} />
              </Link>
            ))}
        </nav>
        {isMobile && (
          <button
            type="button"
            className={`${Style.toggle} ${open ? Style.open : ""}`}
            onClick={() => setOpen(!open)}
          >
            <Icon icon={open ? "mdi:close" : "mdi:menu"} />
          </button>
        )}
      </section>
      {isMobile && (
        <nav className={`${Style.mobileNav} ${open ? Style.open : ""}`}>
          {paths[profile]
            .filter((path) => !path.left)
            .map((path) => (
              <Link key={path.id} to={path.path}>
                {path.name}
              </Link>
            ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
