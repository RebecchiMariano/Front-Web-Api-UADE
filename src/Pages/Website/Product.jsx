import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";
import Style from "../../Styles/pages/Product.module.css";
import Hero from "../../Components/shared/Hero.jsx";
import Swal from 'sweetalert2';

const Product = () => {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    
    const user = useSelector((state) => state.user.value);
    const navigate = useNavigate();

    const money = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    });

    useEffect(() => {
        const param = decodeURIComponent(id || "");

        const fetchByQuery = async (q) => {
            try {
                const res = await fetch(`http://localhost:8080/productos/buscar?q=${encodeURIComponent(q)}`);
                if (!res.ok) return null;
                const arr = await res.json();
                return Array.isArray(arr) && arr.length ? arr[0] : null;
            } catch (e) {
                return null;
            }
        };

        const fetchAllAndFind = async (q) => {
            try {
                const res = await fetch("http://localhost:8080/productos/todos");
                if (!res.ok) return null;
                const arr = await res.json();
                const found = arr.find(p => (p.nombre || "").toLowerCase() === q.toLowerCase());
                return found || null;
            } catch (e) {
                return null;
            }
        };

        const resolveProducto = async () => {
            setLoading(true);
            let result = null;
            if (!result) result = await fetchByQuery(param);
            if (!result) result = await fetchAllAndFind(param);
            setProducto(result);
            setLoading(false);
        };

        if (param) resolveProducto();
    }, [id]);

    const [related, setRelated] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(false);

    useEffect(() => {
        const fetchRelated = async () => {
            if (!producto?.categoria?.id) return setRelated([]);
            setRelatedLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/productos/categoria/${producto.categoria.id}`);
                if (!res.ok) return setRelated([]);
                const data = await res.json();
                setRelated(Array.isArray(data) ? data.filter(p => p.id !== producto.id) : []);
            } catch (e) {
                setRelated([]);
            } finally {
                setRelatedLoading(false);
            }
        };
        fetchRelated();
    }, [producto]);

    // Función para agregar al carrito
    const agregarAlCarrito = async () => {
        if (!user) {
            Swal.fire({
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para agregar productos al carrito',
                icon: 'warning',
                confirmButtonText: 'Iniciar sesión',
                cancelButtonText: 'Cancelar',
                showCancelButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        // Verificar si el usuario tiene rol de comprador
        try {
            const decoded = jwtDecode(user.accessToken);
            const roles = decoded?.roles || [];
            
            if (!roles.includes('ROLE_COMPRADOR')) {
                Swal.fire({
                    title: 'Acceso denegado',
                    text: 'Solo los compradores pueden agregar productos al carrito',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                return;
            }
        } catch (err) {
            console.error("Error al verificar roles:", err);
        }

        setAddingToCart(true);

        try {
            const carritoRequest = {
                productoId: producto.id,
                cantidad: quantity
            };

            const res = await fetch('http://localhost:8080/compras/carrito/agregar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(carritoRequest)
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Error ${res.status}: ${errorText}`);
            }

            const compraActualizada = await res.json();
            
            Swal.fire({
                title: '¡Producto agregado!',
                text: `"${producto.nombre}" se agregó al carrito correctamente`,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            console.log('Carrito actualizado:', compraActualizada);

        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            
            Swal.fire({
                title: 'Error',
                text: 'No se pudo agregar el producto al carrito. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setAddingToCart(false);
        }
    };

    // Verificar si el usuario puede comprar (es comprador)
    const puedeComprar = () => {
        if (!user) return false;
        
        try {
            const decoded = jwtDecode(user.accessToken);
            const roles = decoded?.roles || [];
            return roles.includes('ROLE_COMPRADOR');
        } catch (err) {
            console.error("Error al verificar roles:", err);
            return false;
        }
    };

    if (loading) return <p>Cargando...</p>;
    if (!producto) return <p>Producto no encontrado</p>;

    return (
        <main className={Style.mainProduct}>
            <Hero />
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    <figure className={Style.imageProduct}>
                        <img
                            src={producto.foto || "/img/default.jpg"}
                            alt={producto.nombre}
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "/img/default.jpg";
                            }}
                        />
                    </figure>
                </article>
                <article className={Style.dataProduct}>
                    <h3 className={Style.titleProduct}>{producto.nombre}</h3>
                    <p className={Style.description}>{producto.descripcion}</p>
                    <ul className={Style.info}>
                        <h2>Caracteristicas</h2>
                        <li>Categoría: {producto.categoria?.nombre}</li>
                        <li>Stock: {producto.cantidad}</li>
                        <li>Descuento: {producto.descuento}%</li>
                        <li>Estado: {producto.estado}</li>
                    </ul>
                    <h3 className={Style.price}>{money.format(producto.valor)}</h3>
                    
                    {/* Selector de cantidad y botón de agregar al carrito */}
                    {puedeComprar() && (
                        <div className={Style.cartActions}>
                            <div className={Style.quantitySelector}>
                                <label htmlFor="quantity">Cantidad:</label>
                                <select 
                                    id="quantity"
                                    value={quantity} 
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    disabled={addingToCart}
                                >
                                    {[...Array(Math.min(10, producto.cantidad || 1))].map((_, index) => (
                                        <option key={index + 1} value={index + 1}>
                                            {index + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button
                                className={Style.buttonAddCart}
                                type="button"
                                onClick={agregarAlCarrito}
                                disabled={addingToCart || producto.cantidad === 0}
                            >
                                {addingToCart ? 'Agregando...' : 'Agregar al carrito'}
                            </button>
                        </div>
                    )}

                    {/* Mensaje si no hay stock */}
                    {producto.cantidad === 0 && (
                        <p className={Style.outOfStock}>Producto sin stock</p>
                    )}

                    {/* Mensaje si no es comprador */}
                    {user && !puedeComprar() && (
                        <p className={Style.notBuyer}>Solo los compradores pueden agregar productos al carrito</p>
                    )}
                </article>
            </section>
            <section className={Style.relatedProducts}>
                <h4 className={Style.relatedProductsTitle}>Productos relacionados</h4>
                {relatedLoading ? (
                    <p>Cargando relacionados...</p>
                ) : related.length ? (
                    <ul className={Style.relatedProductsList}>
                        {related.map((r) => (
                            <li key={r.id} onClick={() => navigate(`/productos/${encodeURIComponent(r.nombre)}`)} style={{ cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <img src={r.foto || '/img/default.jpg'} alt={r.nombre} width={64} height={64} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/img/default.jpg' }} />
                                <div>
                                    <div className={Style.relatedProductName}>{r.nombre}</div>
                                    <div>{money.format(r.valor)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay productos relacionados</p>
                )}
            </section>
        </main>
    );
};

export default Product;