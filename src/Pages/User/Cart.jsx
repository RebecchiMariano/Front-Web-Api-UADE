import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Style from "../../Styles/pages/Cart.module.css";
import Hero from "../../Components/shared/Hero";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { fetchCartAsync, updateCartItemAsync, checkoutAsync } from "../../Redux/Slices/cart";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.user.value);
    const cartItems = useSelector((state) => state.cart.value);
    const cartStatus = useSelector((state) => state.cart.status);

    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    useEffect(() => {
        if (user?.accessToken) {
            dispatch(fetchCartAsync(user.accessToken));
        }
    }, [user, dispatch]);

    const updateQuantity = async (item, nuevaCantidad) => {
        if (!user?.accessToken || nuevaCantidad < 1) return;

        const cantidadCambio = nuevaCantidad - item.cantidad;
        const successMessage = `La cantidad de ${item.productoNombre || 'el producto'} se actualizó a ${nuevaCantidad}`;

        const resultAction = await dispatch(updateCartItemAsync({
            productoId: item.productoId || item.id,
            cantidad: cantidadCambio,
            accessToken: user.accessToken,
            successMessage: successMessage
        }));

        if (updateCartItemAsync.fulfilled.match(resultAction)) {
            Swal.fire({ title: 'Carrito actualizado', text: resultAction.payload, icon: 'success', confirmButtonText: 'OK' });
        } else {
            Swal.fire({ title: 'Error', text: 'No se pudo actualizar la cantidad', icon: 'error', confirmButtonText: 'OK' });
        }
    };

    const removeFromCart = async (item) => {
        if (!user?.accessToken) return;

        const result = await Swal.fire({
            title: '¿Eliminar producto?',
            text: `¿Estás seguro de que quieres eliminar ${item.productoNombre || 'el producto'} del carrito?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const successMessage = `El producto ${item.productoNombre || 'el producto'} se eliminó del carrito`;

        const resultAction = await dispatch(updateCartItemAsync({
            productoId: item.productoId || item.id,
            cantidad: -item.cantidad,
            accessToken: user.accessToken,
            successMessage: successMessage
        }));

        if (updateCartItemAsync.fulfilled.match(resultAction)) {
            Swal.fire({ title: 'Producto eliminado', text: resultAction.payload, icon: 'success', confirmButtonText: 'OK' });
        } else {
            Swal.fire({ title: 'Error', text: 'No se pudo eliminar el producto', icon: 'error', confirmButtonText: 'OK' });
        }
    };

    const handleCheckout = async () => {
        if (!user?.accessToken || !cartItems.length) return;
        const resultAction = await dispatch(checkoutAsync(user.accessToken));
        if (checkoutAsync.fulfilled.match(resultAction)) {
            Swal.fire({
                title: '¡Compra realizada!',
                text: 'Tu pedido se ha procesado correctamente',
                icon: 'success',
                confirmButtonText: 'Ver mis pedidos'
            }).then(() => {
                navigate('/user');
            });
        } else {
            const errorMsg = resultAction.payload || resultAction.error.message || 'No se pudo procesar la compra';
            let errorMessage = errorMsg;
            if (errorMsg.includes('stock') || errorMsg.includes('cantidad')) {
                errorMessage = 'No hay suficiente stock para algunos productos. Por favor, revisa tu carrito.';
            }
            Swal.fire({ title: 'Error en el checkout', text: errorMessage, icon: 'error', confirmButtonText: 'OK' });
        }
    };

    const esComprador = () => { /* ... (Lógica de rol, se mantiene) ... */ };

    const isLoading = cartStatus === 'loading';
    const isUpdating = cartStatus === 'loading';
    const isCheckingOut = cartStatus === 'checkingOut';



    const subtotal = cartItems.reduce((total, item) => {
        const precioUnitario = item.precioUnitario || 0;
        const cantidad = item.cantidad || 0;
        return total + (precioUnitario * cantidad);
    }, 0);


    return (
        <main className={Style.cartMain}>
            <Hero />
            <section className={Style.cartContent}>
                <div className={Style.cartHeader}>
                    <h1>Tu Carrito de Compras</h1>
                    <p>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en el carrito</p>
                </div>

                <div className={Style.cartContainer}>
                    <div className={Style.cartItems}>
                        {cartItems.map((item) => (

                            <div key={item.id} className={Style.cartItem}>
                                {console.log(item)}
                                <div className={Style.itemImage}>
                                    <img
                                        src={item.foto || "/img/default.jpg"}
                                        alt={item.productoNombre}
                                        onError={(e) => { e.target.src = "/img/default.jpg"; }}
                                    />
                                </div>

                                <div className={Style.itemDetails}>
                                    <h3>{item.productoNombre}</h3>
                                    <p className={Style.itemPrice}>
                                        {money.format(item.precioUnitario || 0)} c/u
                                    </p>
                                </div>

                                <div className={Style.itemQuantity}>
                                    <label>Cantidad:</label>
                                    <select
                                        value={item.cantidad}
                                        onChange={(e) => updateQuantity(item, parseInt(e.target.value))}
                                        disabled={isUpdating}
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className={Style.itemSubtotal}>
                                    <span>{money.format((item.precioUnitario || 0) * (item.cantidad || 0))}</span>
                                </div>

                                <div className={Style.itemActions}>
                                    <button
                                        onClick={() => removeFromCart({ id: item.id, productoId: item.productoId, cantidad: item.cantidad })}
                                        disabled={isUpdating}
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
                            disabled={isCheckingOut || isUpdating || cartItems.length === 0}
                            className={Style.checkoutButton}
                        >
                            {isCheckingOut ? 'Procesando...' : 'Finalizar compra'}
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