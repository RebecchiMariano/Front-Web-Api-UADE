import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Style from "../../Styles/pages/Product.module.css";
import toast from "react-hot-toast";
import {
    fetchProductById,
    fetchCategories,
    updateProduct
} from "../../Redux/Slices/product";

const ProductsUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.value);

    // Leer del estado de Redux
    const selectedProduct = useSelector((state) => state.product.selectedProduct);
    const categories = useSelector((state) => state.product.categories);
    const status = useSelector((state) => state.product.detailStatus); // Carga del producto
    const updateStatus = useSelector((state) => state.product.updateStatus); // Estado del guardado
    const error = useSelector((state) => state.product.detailError);

    // Estado local para el formulario, inicializado después de cargar el producto
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

    useEffect(() => {
        if (!user?.accessToken) {
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(user.accessToken);

            if (decoded.exp * 1000 < Date.now()) {
                // Token expirado
                navigate("/login");
                return;
            }
        } catch (err) {
            navigate("/login");
            return;
        }
    }, [user, navigate]);


    // 2. Efecto para cargar el Producto y las Categorías
    useEffect(() => {
        if (id && user?.accessToken) {
            dispatch(fetchProductById({ id, accessToken: user.accessToken }));
            // Disparar la carga de categorías (si aún no están)
            dispatch(fetchCategories(user.accessToken));
        }
    }, [id, user?.accessToken, dispatch]);


    // 3. Efecto para inicializar el formulario cuando el producto se carga de Redux
    useEffect(() => {
        if (selectedProduct) {
            setForm({
                nombre: selectedProduct.nombre || "",
                descripcion: selectedProduct.descripcion || "",
                valor: selectedProduct.valor || 0,
                cantidad: selectedProduct.cantidad || 0,
                descuento: selectedProduct.descuento || 0,
                estado: selectedProduct.estado || "ACTIVO",
                categoriaId: selectedProduct.categoria?.id || "",
                foto: selectedProduct.foto || "",
            });
        }
    }, [selectedProduct]);


    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setForm(prev => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;

        const payload = {
            id: selectedProduct.id,
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            valor: form.valor,
            cantidad: form.cantidad,
            descuento: form.descuento,
            estado: form.estado,
            foto: form.foto.trim(),
            // El backend espera un objeto Categoria, no solo el ID
            categoria: form.categoriaId ? { id: form.categoriaId } : null,
        };

        const resultAction = await dispatch(updateProduct({
            id: selectedProduct.id,
            payload,
            accessToken: user.accessToken
        }));

        if (updateProduct.fulfilled.match(resultAction)) {
            toast.success("Producto actualizado correctamente");
            navigate("/admin/products");
        } else {
            const errorMsg = resultAction.payload || "Error desconocido al actualizar";
            console.error('Error al actualizar:', errorMsg);
            toast.error(errorMsg);
        }
    };

    const isLoading = status === 'loading';
    const isSaving = updateStatus === 'loading';

    // Renderizado basado en estado de Redux
    if (isLoading) return <div className={Style.mainProduct}>Cargando producto...</div>;
    if (status === 'failed') return <div className={Style.mainProduct}>Error: {error}</div>;
    if (!selectedProduct) return <div className={Style.mainProduct}>Producto no encontrado</div>;

    // ... (El resto del return del formulario usa 'form' y 'categories') ...
    return (
        <main className={Style.mainProduct}>
            {/* ... Resto de la estructura del formulario (usando form, categories, isSaving) ... */}
            <section className={Style.sectionProduct}>
                <article className={Style.detailProduct}>
                    {/* ... Imagen ... */}
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
                        {/* ... Todos tus labels e inputs usan 'form' y 'handleChange' ... */}
                        {/* Ejemplo del select de Categoría: */}
                        <label>
                            Categoría
                            <select
                                name="categoriaId"
                                value={form.categoriaId}
                                onChange={handleChange}
                                disabled={isSaving} // Deshabilitar durante el guardado
                            >
                                <option value="">-- Sin categoría --</option>
                                {categories.map(c => ( // <-- Usar el estado de Redux
                                    <option key={c.id} value={c.id}>
                                        {c.nombre}
                                    </option>
                                ))}
                            </select>
                        </label>
                        {/* ... Resto de los campos (Nombre, Descripción, Valor, Stock, Descuento, Estado, Foto) ... */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={Style.buttonAddCart}
                            >
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                disabled={isSaving}
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
