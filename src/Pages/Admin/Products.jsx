import React, { useEffect, useState } from "react";
import Style from "../../Styles/pages/Products.module.css";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../Redux/Slices/product";

const AdminProducts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const products = useSelector((state) => state.product.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const money = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(fetchProducts({ accessToken: user.accessToken }));
    }
  }, [user, dispatch]);

  const handleToggleStatus = async (id, currentEstado, productName) => {
    const newEstado = currentEstado === "ACTIVO" ? "INACTIVO" : "ACTIVO";
    const action = newEstado === "ACTIVO" ? "activar" : "desactivar";

    const result = await Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} producto?`,
      html: `¿Estás seguro que quieres ${action} <strong>"${productName}"</strong>?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: newEstado === "ACTIVO" ? '#28a745' : '#ffc107',
      cancelButtonColor: '#6c757d',
      confirmButtonText: `Sí, ${action}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/productos/${action}/${id}`, {
          method: "POST",
          headers: user?.accessToken ? {
            Authorization: `Bearer ${user.accessToken}`
          } : {}
        });

        if (!res.ok) throw new Error(`Status ${res.status}`);
        // Refrescar la lista de productos
        
        dispatch(fetchProducts({ accessToken: user.accessToken }));

        Swal.fire({
          title: `¡${action.charAt(0).toUpperCase() + action.slice(1)}do!`,
          text: `El producto ha sido ${action}do correctamente.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });

      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: `No se pudo ${action} el producto.`,
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  if (loading) return <div className={Style.productsMain}>Cargando productos...</div>;
  if (error) return <div className={Style.productsMain}>{error}</div>;

  return (
    <main className={Style.productsMain}>
      <Hero />
      <section className={Style.content}>
        <article className={Style.products}>
          <header>
            <h2>Administración de Productos</h2>
            <p>Lista completa de productos registrados</p>
            <Link
              to="/admin/products/create"
              className={Style.createButton}
            >
              Crear Nuevo Producto
            </Link>
            <Link
              to="/admin/categories/create"
              className={Style.createButton}
              style={{ marginLeft: '0.75rem' }}
            >
              Crear Nueva Categoría
            </Link>
          </header>

          <ul>
            {products.map((producto) => (
              <li
                key={producto.id}
                className={`${producto.estado === "INACTIVO" ? Style.inactiveProduct : ""}`}
              >
                {/* Indicador de estado */}
                <div className={`${Style.statusIndicator} ${producto.estado === "ACTIVO" ? Style.active : Style.inactive
                  }`}>
                  {producto.estado === "ACTIVO" ? "ACTIVO" : "INACTIVO"}
                </div>

                <figure>
                  <img
                    src={producto.img}
                    alt={producto.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/default.jpg";
                    }}
                  />
                </figure>
                <article>
                  <h3>{producto.name}</h3>
                  <p>{producto.categoriaNombre}</p>
                  <p className={Style.stockInfo}>Stock: {producto.cantidad}</p>
                </article>

                <form className={Style.formCart} onSubmit={(e) => e.preventDefault()}>
                  <output>{money.format(producto.price)}</output>
                  <button
                    type="button"
                    title="Editar"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/admin/products/edit/${producto.id}`);
                    }}
                  >
                    <Icon icon="mdi:pencil" />
                  </button>
                  <button
                    type="button"
                    title={producto.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleStatus(producto.id, producto.estado, producto.name);
                    }}
                    className={producto.estado === "ACTIVO" ? Style.deactivateBtn : Style.activateBtn}
                  >
                    <Icon icon={producto.estado === "ACTIVO" ? "mdi:eye-off" : "mdi:eye"} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
};

export default AdminProducts;