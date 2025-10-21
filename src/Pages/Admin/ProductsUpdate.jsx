import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Style from "../../Styles/pages/Product.module.css";
import toast from "react-hot-toast";

const ProductsUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const user = useSelector((state) => state.user.value);

    // Decodificar token y verificar rol (ADMINISTRADOR)
    useEffect(() => {
        if (!user?.accessToken) return navigate("/login");
        try {
            const decoded = jwtDecode(user.accessToken);
            const roles = decoded?.roles || decoded?.authorities || [];
            const role = Array.isArray(roles) ? roles[0] : roles;
            if (role !== "ROLE_ADMINISTRADOR") {
                toast.error("No tienes permisos para editar productos");
                return navigate("/admin/products");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error de autenticación");
            navigate("/login");
        }
    }, [user, navigate]);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        valor: 0,
        cantidad: 0,
        descuento: 0,
        estado: "ACTIVO",
        categoriaId: "",
        foto: "",
    });

    // 1. Fetch producto (Ruta pública: /productos/{id})
    useEffect(() => {
        // Solo depende del ID
        if (!id) return;

        const fetchProducto = async () => {
            setLoading(true);
            setError(null);
            try {
                // ✅ Sin header Authorization, ya que es ruta 'permitAll()'
                const res = await fetch(`http://localhost:8080/productos/${id}`);

                if (!res.ok) {
                    if (res.status === 403) setError("Acceso denegado");
                    else if (res.status === 404) setError("Producto no encontrado");
                    else setError(`Error ${res.status}`);
                    setProducto(null);
                    return;
                }

                const data = await res.json();
                setProducto(data);
                setForm({
                    nombre: data.nombre || "",
                    descripcion: data.descripcion || "",
                    valor: data.valor || 0,
                    cantidad: data.cantidad || 0,
                    descuento: data.descuento || 0,
                    estado: data.estado || "ACTIVO",
                    categoriaId: data.categoria?.id || "",
                    foto: data.foto || "",
                });
            } catch (err) {
                console.error(err);
                setError("Error al cargar el producto");
            } finally {
                setLoading(false);
            }
        };
        fetchProducto();
    // ✅ DEPENDENCIA CORREGIDA: Solo 'id'
    }, [id]); 

    // 2. Fetch categorías (Usado en contexto de Admin)
    useEffect(() => {
        // Depende del token
        if (!user?.accessToken) return;

        const fetchCategorias = async () => {
            try {
                // ✅ CON header Authorization (ruta: hasRole("ADMINISTRADOR") o para contexto admin)
                const res = await fetch("http://localhost:8080/categorias/", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                    credentials: "include", 
                });

                if (!res.ok) throw new Error(`Error ${res.status}`);
                const data = await res.json();
                setCategorias(data.filter(c => c.estado === "ACTIVO"));
            } catch (err) {
                console.error("Error fetching categorias:", err);
            }
        };
        fetchCategorias();
    // ✅ DEPENDENCIA CORRECTA: 'user'
    }, [user]);

    // Handle change y submit mantienen igual
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!producto) return;

        setSaving(true);
        try {
            const payload = {
                id: producto.id,
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                valor: form.valor,
                cantidad: form.cantidad,
                descuento: form.descuento,
                estado: form.estado,
                foto: form.foto.trim(),
                categoria: form.categoriaId ? { id: form.categoriaId } : null,
            };

            // ✅ CON header Authorization (ruta: hasRole("ADMINISTRADOR"))
            const res = await fetch(`http://localhost:8080/productos/editar/${producto.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                credentials: "include", // 🔑 CORS
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(`Error ${res.status}: ${errText}`);
            }

            toast.success("Producto actualizado correctamente");
            navigate("/admin/products");
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Error al actualizar el producto");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={Style.mainProduct}>Cargando producto...</div>;
    if (error) return <div className={Style.mainProduct}>Error: {error}</div>;
    if (!producto) return <div className={Style.mainProduct}>Producto no encontrado</div>;

    return (
        <main className={Style.mainProduct}>
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    <figure className={Style.imageProduct}>
                        <img 
                            src={form.foto || "/img/default.jpg"} 
                            alt={form.nombre}
                            onError={(e) => {
                                e.target.src = "/img/default.jpg";
                            }}
                        />
                    </figure>
                </article>

                <article className={Style.dataProduct}>
                    <h3 className={Style.titleProduct}>Editar producto</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Nombre
                            <input 
                                name="nombre" 
                                value={form.nombre} 
                                onChange={handleChange}
                                required
                                minLength={2}
                            />
                        </label>
                        <label>
                            Descripción
                            <textarea 
                                name="descripcion" 
                                value={form.descripcion} 
                                onChange={handleChange}
                                rows={4}
                            />
                        </label>
                        <label>
                            Precio
                            <input 
                                name="valor" 
                                type="number" 
                                step="0.01" 
                                min="0"
                                value={form.valor} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Stock
                            <input 
                                name="cantidad" 
                                type="number" 
                                min="0"
                                value={form.cantidad} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Descuento %
                            <input 
                                name="descuento" 
                                type="number" 
                                min="0" 
                                max="100"
                                value={form.descuento} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Categoría
                            <select 
                                name="categoriaId" 
                                value={form.categoriaId} 
                                onChange={handleChange}
                            >
                                <option value="">-- Sin categoría --</option>
                                {categorias.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Estado
                            <select 
                                name="estado" 
                                value={form.estado} 
                                onChange={handleChange}
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </label>
                        <label>
                            Foto (URL)
                            <input 
                                name="foto" 
                                value={form.foto} 
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </label>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className={Style.buttonAddCart}
                            >
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/admin/products')}
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </article>
            </section>
        </main>
    );
};

export default ProductsUpdate;