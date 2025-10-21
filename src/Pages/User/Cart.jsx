import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import Style from "../../Styles/pages/Cart.module.css";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [checkingOut, setCheckingOut] = useState(false);
    const user = useSelector((state) => state.user.value);
    const navigate = useNavigate();

    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    // Obtener el carrito del usuario
    const fetchCart = async () => {
        if (!user?.accessToken) return;

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/compras/", {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) throw new Error(`Error ${res.status}`);

            const compras = await res.json();
            
            // Buscar la compra con estado PENDIENTE (carrito activo)
            const carritoActivo = compras.find(compra => compra.estado === 'PENDIENTE');
            setCart(carritoActivo || null);

        } catch (error) {
            console.error("Error al cargar el carrito:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar el carrito',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.accessToken) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    // Actualizar cantidad de un item
    const updateQuantity = async (itemId, nuevaCantidad) => {
        if (!user?.accessToken || nuevaCantidad < 1) return;

        setUpdating(true);
        try {
            // Para actualizar la cantidad, necesitaríamos un endpoint específico
            // Por ahora, como workaround, podemos eliminar y agregar de nuevo
            // Esto es temporal - idealmente deberías tener un endpoint PATCH para actualizar cantidad
            await removeFromCart(itemId);
            
            // Si la nueva cantidad es mayor a 0, agregamos el producto de nuevo
            if (nuevaCantidad > 0) {
                // Necesitamos saber el productoId del item
                const item = cart.items.find(item => item.id === itemId);
                if (item) {
                    const carritoRequest = {
                        productoId: item.producto.id,
                        cantidad: nuevaCantidad
                    };

                    await fetch('http://localhost:8080/compras/carrito/agregar', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user.accessToken}`
                        },
                        body: JSON.stringify(carritoRequest)
                    });
                }
            }

            // Recargar el carrito
            await fetchCart();

            Swal.fire({
                title: 'Carrito actualizado',
                text: 'La cantidad se actualizó correctamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la cantidad',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setUpdating(false);
        }
    };

    // Eliminar item del carrito
    const removeFromCart = async (itemId) => {
        if (!user?.accessToken) return;

        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: '¿Estás seguro de que quieres eliminar este producto del carrito?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        setUpdating(true);
        try {
            // Necesitaríamos un endpoint DELETE para eliminar items
            // Por ahora, como workaround, podemos usar cantidad 0
            // Esto es temporal - idealmente deberías tener un endpoint DELETE
            const item = cart.items.find(item => item.id === itemId);
            if (item) {
                const carritoRequest = {
                    productoId: item.producto.id,
                    cantidad: -item.cantidad // Enviar cantidad negativa para "eliminar"
                };

                const res = await fetch('http://localhost:8080/compras/carrito/agregar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.accessToken}`
                    },
                    body: JSON.stringify(carritoRequest)
                });

                if (!res.ok) throw new Error(`Error ${res.status}`);
            }

            // Recargar el carrito
            await fetchCart();

            Swal.fire({
                title: 'Producto eliminado',
                text: 'El producto se eliminó del carrito',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (error) {
            console.error("Error al eliminar producto:", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el producto',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setUpdating(false);
        }
    };

    // Proceder al checkout
    const handleCheckout = async () => {
        if (!user?.accessToken || !cart || !cart.items.length) return;

        setCheckingOut(true);
        try {
            const res = await fetch('http://localhost:8080/compras/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error ${res.status}: ${errorText}`);
            }

            const compraConfirmada = await res.json();

            Swal.fire({
                title: '¡Compra realizada!',
                text: 'Tu pedido se ha procesado correctamente',
                icon: 'success',
                confirmButtonText: 'Ver mis pedidos'
            }).then(() => {
                navigate('/user');
            });

        } catch (error) {
            console.error("Error en checkout:", error);
            
            let errorMessage = 'No se pudo procesar la compra';
            if (error.message.includes('stock')) {
                errorMessage = 'No hay suficiente stock para algunos productos';
            }

            Swal.fire({
                title: 'Error en el checkout',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setCheckingOut(false);
        }
    };

    // Verificar si el usuario es comprador
    const esComprador = () => {
        if (!user) return false;
        try {
            const decoded = jwtDecode(user.accessToken);
            const roles = decoded?.roles || [];
            return roles.includes('ROLE_COMPRADOR');
        } catch (err) {
            return false;
        }
    };

    if (loading) {
        return (
            <main className={Style.cartMain}>
                <Hero />
                <div className={Style.loading}>Cargando carrito...</div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className={Style.cartMain}>
                <Hero />
                <div className={Style.emptyCart}>
                    <h2>Inicia sesión</h2>
                    <p>Debes iniciar sesión para ver tu carrito</p>
                    <button 
                        onClick={() => navigate('/login')}
                        className={Style.loginButton}
                    >
                        Iniciar sesión
                    </button>
                </div>
            </main>
        );
    }

    if (!esComprador()) {
        return (
            <main className={Style.cartMain}>
                <Hero />
                <div className={Style.emptyCart}>
                    <h2>Acceso denegado</h2>
                    <p>Solo los compradores pueden acceder al carrito</p>
                    <button 
                        onClick={() => navigate('/')}
                        className={Style.continueShopping}
                    >
                        Continuar comprando
                    </button>
                </div>
            </main>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <main className={Style.cartMain}>
                <Hero />
                <div className={Style.emptyCart}>
                    <h2>Tu carrito está vacío</h2>
                    <p>Agrega algunos productos para continuar</p>
                    <button 
                        onClick={() => navigate('/productos')}
                        className={Style.continueShopping}
                    >
                        Continuar comprando
                    </button>
                </div>
            </main>
        );
    }

    const subtotal = cart.items.reduce((total, item) => total + (item.valor || 0), 0);

    return (
        <main className={Style.cartMain}>
            <Hero />
            <section className={Style.cartContent}>
                <div className={Style.cartHeader}>
                    <h1>Tu Carrito de Compras</h1>
                    <p>{cart.items.length} producto{cart.items.length !== 1 ? 's' : ''} en el carrito</p>
                </div>

                <div className={Style.cartContainer}>
                    <div className={Style.cartItems}>
                        {cart.items.map((item) => (
                            <div key={item.id} className={Style.cartItem}>
                                <div className={Style.itemImage}>
                                    <img
                                        src={item.producto?.foto || "/img/default.jpg"}
                                        alt={item.producto?.nombre}
                                        onError={(e) => {
                                            e.target.src = "/img/default.jpg";
                                        }}
                                    />
                                </div>
                                
                                <div className={Style.itemDetails}>
                                    <h3>{item.producto?.nombre}</h3>
                                    <p className={Style.itemCategory}>
                                        {item.producto?.categoria?.nombre}
                                    </p>
                                    <p className={Style.itemPrice}>
                                        {money.format(item.producto?.valor)} c/u
                                    </p>
                                </div>

                                <div className={Style.itemQuantity}>
                                    <label>Cantidad:</label>
                                    <select
                                        value={item.cantidad}
                                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        disabled={updating}
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={Style.itemSubtotal}>
                                    <span>{money.format(item.valor)}</span>
                                </div>

                                <div className={Style.itemActions}>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        disabled={updating}
                                        className={Style.removeButton}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={Style.cartSummary}>
                        <h3>Resumen de compra</h3>
                        
                        <div className={Style.summaryRow}>
                            <span>Subtotal:</span>
                            <span>{money.format(subtotal)}</span>
                        </div>
                        
                        <div className={Style.summaryRow}>
                            <span>Envío:</span>
                            <span>Gratis</span>
                        </div>
                        
                        <div className={Style.summaryTotal}>
                            <span>Total:</span>
                            <span>{money.format(subtotal)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={checkingOut || updating}
                            className={Style.checkoutButton}
                        >
                            {checkingOut ? 'Procesando...' : 'Finalizar compra'}
                        </button>

                        <button
                            onClick={() => navigate('/productos')}
                            className={Style.continueShopping}
                        >
                            Continuar comprando
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Cart;