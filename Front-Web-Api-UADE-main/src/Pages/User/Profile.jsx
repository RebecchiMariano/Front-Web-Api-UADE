import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Style from "../../Styles/pages/Profile.module.css";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [userOrders, setUserOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    
    const user = useSelector((state) => state.user.value);

    // Estado del formulario de edición
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: ""
    });

    // Obtener datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.accessToken) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Decodificar el token para obtener información básica
                const decoded = jwtDecode(user.accessToken);
                
                // Intentar obtener datos completos del usuario desde el backend
                const res = await fetch("http://localhost:8080/usuarios/me", {
                    headers: {
                        'Authorization': `Bearer ${user.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const userDataFromApi = await res.json();
                    setUserData(userDataFromApi);
                    setForm({
                        nombre: userDataFromApi.nombre || "",
                        email: userDataFromApi.email || decoded.sub || "",
                        telefono: userDataFromApi.telefono || "",
                        direccion: userDataFromApi.direccion || ""
                    });
                } else {
                    // Si no hay endpoint específico, usar datos del token
                    setUserData({
                        nombre: decoded.nombre || "Usuario",
                        email: decoded.sub || "",
                        telefono: "",
                        direccion: ""
                    });
                    setForm({
                        nombre: decoded.nombre || "Usuario",
                        email: decoded.sub || "",
                        telefono: "",
                        direccion: ""
                    });
                }

            } catch (error) {
                console.error("Error al cargar datos del usuario:", error);
                // Usar datos mínimos del token
                const decoded = jwtDecode(user.accessToken);
                setUserData({
                    nombre: decoded.nombre || "Usuario",
                    email: decoded.sub || "",
                    telefono: "",
                    direccion: ""
                });
                setForm({
                    nombre: decoded.nombre || "Usuario",
                    email: decoded.sub || "",
                    telefono: "",
                    direccion: ""
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    // Obtener órdenes del usuario
    const fetchUserOrders = async () => {
        if (!user?.accessToken) return;

        setOrdersLoading(true);
        try {
            const res = await fetch("http://localhost:8080/compras/", {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const orders = await res.json();
                // Filtrar solo órdenes confirmadas (excluir carrito pendiente)
                const confirmedOrders = orders.filter(order => order.estado === 'CONFIRMADA');
                setUserOrders(confirmedOrders);
            }
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    useEffect(() => {
        fetchUserOrders();
    }, [user]);

    // Manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Guardar cambios del perfil
    const handleSaveProfile = async () => {
        if (!user?.accessToken) return;

        setSaving(true);
        try {
            const res = await fetch("http://localhost:8080/usuarios/me", {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);

            const updatedUser = await res.json();
            setUserData(updatedUser);
            setEditing(false);

            Swal.fire({
                title: 'Perfil actualizado',
                text: 'Tus datos se han actualizado correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el perfil',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setSaving(false);
        }
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setForm({
            nombre: userData?.nombre || "",
            email: userData?.email || "",
            telefono: userData?.telefono || "",
            direccion: userData?.direccion || ""
        });
        setEditing(false);
    };

    // Formatear fecha
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Obtener rol del usuario
    const getUserRole = () => {
        if (!user?.accessToken) return "Usuario";
        
        try {
            const decoded = jwtDecode(user.accessToken);
            const roles = decoded?.roles || [];
            
            if (roles.includes('ROLE_ADMINISTRADOR')) return "Administrador";
            if (roles.includes('ROLE_COMPRADOR')) return "Comprador";
            
            return "Usuario";
        } catch (err) {
            return "Usuario";
        }
    };

    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    if (loading) {
        return (
            <main className={Style.profileMain}>
                <Hero />
                <div className={Style.loading}>Cargando perfil...</div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className={Style.profileMain}>
                <Hero />
                <div className={Style.notLoggedIn}>
                    <h2>No has iniciado sesión</h2>
                    <p>Inicia sesión para ver tu perfil</p>
                </div>
            </main>
        );
    }

    return (
        <main className={Style.profileMain}>
            <Hero />
            <section className={Style.profileContent}>
                {/* Header del perfil */}
                <div className={Style.profileHeader}>
                    <div className={Style.avatar}>
                        <span>{userData?.nombre?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                    <div className={Style.profileInfo}>
                        <h1>{userData?.nombre || 'Usuario'}</h1>
                        <p className={Style.userRole}>{getUserRole()}</p>
                        <p className={Style.userEmail}>{userData?.email}</p>
                    </div>
                    {!editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className={Style.editButton}
                        >
                            Editar Perfil
                        </button>
                    )}
                </div>

                {/* Información del perfil */}
                <div className={Style.profileSections}>
                    {/* Sección de información personal */}
                    <div className={Style.profileSection}>
                        <h2>Información Personal</h2>
                        
                        {editing ? (
                            <div className={Style.editForm}>
                                <div className={Style.formGroup}>
                                    <label>Nombre completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                                
                                <div className={Style.formGroup}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                
                                <div className={Style.formGroup}>
                                    <label>Teléfono</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={form.telefono}
                                        onChange={handleInputChange}
                                        placeholder="+54 11 1234-5678"
                                    />
                                </div>
                                
                                <div className={Style.formGroup}>
                                    <label>Dirección</label>
                                    <textarea
                                        name="direccion"
                                        value={form.direccion}
                                        onChange={handleInputChange}
                                        placeholder="Tu dirección completa"
                                        rows="3"
                                    />
                                </div>
                                
                                <div className={Style.formActions}>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className={Style.saveButton}
                                    >
                                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        disabled={saving}
                                        className={Style.cancelButton}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={Style.infoGrid}>
                                <div className={Style.infoItem}>
                                    <span className={Style.infoLabel}>Nombre:</span>
                                    <span className={Style.infoValue}>{userData?.nombre || 'No especificado'}</span>
                                </div>
                                <div className={Style.infoItem}>
                                    <span className={Style.infoLabel}>Email:</span>
                                    <span className={Style.infoValue}>{userData?.email || 'No especificado'}</span>
                                </div>
                                <div className={Style.infoItem}>
                                    <span className={Style.infoLabel}>Teléfono:</span>
                                    <span className={Style.infoValue}>{userData?.telefono || 'No especificado'}</span>
                                </div>
                                <div className={Style.infoItem}>
                                    <span className={Style.infoLabel}>Dirección:</span>
                                    <span className={Style.infoValue}>{userData?.direccion || 'No especificada'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sección de órdenes recientes */}
                    <div className={Style.profileSection}>
                        <h2>Mis Órdenes Recientes</h2>
                        
                        {ordersLoading ? (
                            <div className={Style.loadingOrders}>Cargando órdenes...</div>
                        ) : userOrders.length > 0 ? (
                            <div className={Style.ordersList}>
                                {userOrders.slice(0, 5).map((order) => (
                                    <div key={order.id} className={Style.orderItem}>
                                        <div className={Style.orderHeader}>
                                            <span className={Style.orderId}>Orden #{order.id.slice(-8).toUpperCase()}</span>
                                            <span className={Style.orderDate}>{formatDate(order.fechaHora)}</span>
                                        </div>
                                        <div className={Style.orderDetails}>
                                            <span className={Style.orderTotal}>
                                                Total: {money.format(order.valor)}
                                            </span>
                                            <span className={`${Style.orderStatus} ${
                                                order.estado === 'CONFIRMADA' ? Style.confirmed : ''
                                            }`}>
                                                {order.estado}
                                            </span>
                                        </div>
                                        <div className={Style.orderItemsPreview}>
                                            {order.items?.slice(0, 2).map((item, index) => (
                                                <span key={item.id} className={Style.orderProduct}>
                                                    {item.producto?.nombre}
                                                    {index < order.items.length - 1 && ', '}
                                                </span>
                                            ))}
                                            {order.items?.length > 2 && (
                                                <span className={Style.moreItems}>
                                                    y {order.items.length - 2} más
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={Style.noOrders}>
                                <p>No tienes órdenes recientes</p>
                                <p>¡Realiza tu primera compra!</p>
                            </div>
                        )}
                    </div>

                    {/* Sección de estadísticas (opcional) */}
                    <div className={Style.profileSection}>
                        <h2>Resumen</h2>
                        <div className={Style.statsGrid}>
                            <div className={Style.statItem}>
                                <span className={Style.statNumber}>{userOrders.length}</span>
                                <span className={Style.statLabel}>Órdenes Totales</span>
                            </div>
                            <div className={Style.statItem}>
                                <span className={Style.statNumber}>
                                    {money.format(userOrders.reduce((total, order) => total + order.valor, 0))}
                                </span>
                                <span className={Style.statLabel}>Total Gastado</span>
                            </div>
                            <div className={Style.statItem}>
                                <span className={Style.statNumber}>
                                    {userOrders.reduce((total, order) => total + order.items.length, 0)}
                                </span>
                                <span className={Style.statLabel}>Productos Comprados</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Profile;