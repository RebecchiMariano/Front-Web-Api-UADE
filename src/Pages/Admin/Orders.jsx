import React, { useEffect, useState } from "react";
import Style from "../../Styles/pages/AdminOrders.module.css";
import { useSelector } from "react-redux";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const user = useSelector((state) => state.user.value);
  const navigate = useNavigate();

  const money = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  // Verificación de permisos - DECODIFICANDO EL TOKEN
  useEffect(() => {
    if (user?.accessToken) {
      try {
        const decoded = jwtDecode(user.accessToken);
        const roles = decoded?.roles || [];
        
        console.log("Roles del usuario desde JWT:", roles); // Para debug
        
        // Verificar si tiene ROLE_ADMINISTRADOR
        if (!roles.includes("ROLE_ADMINISTRADOR")) {
          Swal.fire({
            title: 'Acceso denegado',
            text: 'No tienes permisos para acceder a esta página.',
            icon: 'error',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate("/admin");
          });
          return;
        }
        
        // Si tiene acceso, marcamos como true
        setUserHasAccess(true);
        
      } catch (err) {
        console.error("Error al decodificar el token:", err);
        Swal.fire({
          title: 'Error de autenticación',
          text: 'Por favor, inicia sesión nuevamente.',
          icon: 'error',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate("/login");
        });
      }
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMADA':
        return Style.statusConfirmed;
      case 'PENDIENTE':
        return Style.statusPending;
      case 'CANCELADA':
        return Style.statusCancelled;
      default:
        return Style.statusPending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'PENDIENTE':
        return 'Pendiente';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Fetch orders - solo si el usuario tiene acceso
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userHasAccess) return;

      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/compras/todas", {
          headers: user?.accessToken ? { 
            Authorization: `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          } : {}
        });
        
        if (res.status === 403) {
          throw new Error('No tienes permisos para acceder a las órdenes');
        }
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log("Orders data:", data);
        
        const mappedOrders = data.map(order => ({
          id: order.id,
          usuario: order.usuario ? {
            nombre: order.usuario.nombre || 'Cliente',
            email: order.usuario.email || 'Sin email'
          } : { nombre: 'Cliente', email: 'Sin email' },
          valor: order.valor || 0,
          fechaHora: order.fechaHora || new Date().toISOString(),
          estado: order.estado || 'PENDIENTE',
          items: order.items ? order.items.map(item => ({
            id: item.id,
            producto: item.producto ? {
              nombre: item.producto.nombre || 'Producto sin nombre',
              valor: item.producto.valor || 0
            } : { nombre: 'Producto no disponible', valor: 0 },
            cantidad: item.cantidad || 0,
            valor: item.valor || 0
          })) : []
        }));
        
        setOrders(mappedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        
        if (err.message.includes('403')) {
          setError("No tienes permisos para ver las órdenes de compra. Contacta al administrador.");
        } else {
          setError("No se pudieron cargar las órdenes de compra.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (userHasAccess && user?.accessToken) {
      fetchOrders();
    }
  }, [user, userHasAccess]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: `¿Cambiar estado a ${getStatusText(newStatus).toLowerCase()}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, estado: newStatus } : order
        ));

        Swal.fire({
          title: '¡Actualizado!',
          text: `El estado de la orden ha sido cambiado a ${getStatusText(newStatus).toLowerCase()}.`,
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el estado de la orden.',
        icon: 'error',
        confirmButtonColor: '#d33',
      });
    }
  };

  // Mostrar loading mientras verificamos permisos
  if (!userHasAccess && user?.accessToken) {
    return <div className={Style.ordersMain}>Verificando permisos...</div>;
  }

  if (loading) return <div className={Style.ordersMain}>Cargando órdenes...</div>;
  if (error) return <div className={Style.ordersMain}>{error}</div>;

  return (
    <main className={Style.ordersMain}>
      <Hero />
      <section className={Style.content}>
        <article className={Style.orders}>
          <header>
            <h2>Administración de Órdenes de Compra</h2>
            <p>Gestión de todas las órdenes del sistema</p>
          </header>

          {orders.length === 0 ? (
            <div className={Style.noOrders}>
              <p>No hay órdenes de compra registradas.</p>
            </div>
          ) : (
            <div className={Style.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={Style.orderCard}>
                  <div className={Style.orderHeader}>
                    <div className={Style.orderInfo}>
                      <h3>Orden #{order.id.slice(-8).toUpperCase()}</h3>
                      <p className={Style.customerInfo}>
                        Cliente: {order.usuario.nombre} ({order.usuario.email})
                      </p>
                      <p className={Style.orderDate}>
                        Fecha: {formatDate(order.fechaHora)}
                      </p>
                    </div>
                    <div className={Style.orderMeta}>
                      <div className={`${Style.orderStatus} ${getStatusClass(order.estado)}`}>
                        {getStatusText(order.estado)}
                      </div>
                      <div className={Style.orderTotal}>
                        Total: {money.format(order.valor)}
                      </div>
                    </div>
                  </div>

                  <div className={Style.orderItems}>
                    <h4>Productos:</h4>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id} className={Style.orderItem}>
                          <span className={Style.itemName}>
                            {item.producto.nombre}
                          </span>
                          <span className={Style.itemQuantity}>
                            x{item.cantidad}
                          </span>
                          <span className={Style.itemPrice}>
                            {money.format(item.producto.valor)} c/u
                          </span>
                          <span className={Style.itemSubtotal}>
                            Subtotal: {money.format(item.valor)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={Style.orderActions}>
                    <select
                      value={order.estado}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={Style.statusSelect}
                    >
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="CANCELADA">Cancelada</option>
                    </select>
                    
                    <button
                      className={Style.detailsBtn}
                      onClick={() => {
                        Swal.fire({
                          title: `Orden #${order.id.slice(-8).toUpperCase()}`,
                          html: `
                            <div style="text-align: left;">
                              <p><strong>Cliente:</strong> ${order.usuario.nombre} (${order.usuario.email})</p>
                              <p><strong>Fecha:</strong> ${formatDate(order.fechaHora)}</p>
                              <p><strong>Estado:</strong> ${getStatusText(order.estado)}</p>
                              <p><strong>Total:</strong> ${money.format(order.valor)}</p>
                              <hr>
                              <h4>Productos:</h4>
                              ${order.items.map(item => `
                                <p>• ${item.producto.nombre} - ${item.cantidad} x ${money.format(item.producto.valor)} = ${money.format(item.valor)}</p>
                              `).join('')}
                            </div>
                          `,
                          confirmButtonText: 'Cerrar'
                        });
                      }}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>
    </main>
  );
};

export default AdminOrders;