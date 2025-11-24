import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Hero from "../../Components/shared/Hero";
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
    const status = useSelector((state) => state.product.detailStatus);
    const updateStatus = useSelector((state) => state.product.updateStatus);
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
        
        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            valor: form.valor,
            cantidad: form.cantidad,
            descuento: form.descuento,
            categoria: { id: form.categoriaId }
        };


        const resultAction = await dispatch(updateProduct({
            id,
            payload,
            accessToken: user.accessToken,
        }));

        if (updateProduct.fulfilled.match(resultAction)) {
            toast.success("Producto actualizado correctamente");
            navigate("/admin/products");
        } else {
            toast.error(resultAction.payload || "Error al actualizar");
        }
    };


    const isLoading = status === 'loading';
    const isSaving = updateStatus === 'loading';

    // Renderizado basado en estado de Redux
    if (isLoading) return <div className={Style.mainProduct}>Cargando producto...</div>;
    if (status === 'failed') return <div className={Style.mainProduct}>Error: {error}</div>;
    if (!selectedProduct) return <div className={Style.mainProduct}>Producto no encontrado</div>;
    return (
        <main className={Style.mainProduct}>
            <Hero title={"Editar producto"} />
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
                    <form onSubmit={handleSubmit} className={Style.updateForm}>

                        <label>
                            Nombre
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            Descripción
                            <textarea
                                name="descripcion"
                                rows="4"
                                value={form.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>Categoría existente</label>
                        <select
                            name="categoriaId"
                            value={form.categoriaId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Seleccionar --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                        <label>
                            Precio (ARS)
                            <input
                                type="number"
                                name="valor"
                                step="0.01"
                                value={form.valor}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {/* STOCK */}
                        <label>
                            Cantidad / Stock
                            <input
                                type="number"
                                name="cantidad"
                                value={form.cantidad}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {/* DESCUENTO */}
                        <label>
                            Descuento (%)
                            <input
                                type="number"
                                name="descuento"
                                min="0"
                                max="100"
                                value={form.descuento}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        {/* BOTONES */}
                        <div className={Style.buttons}>
                            <button
                                type="submit"
                                className={Style.buttonAddCart}
                                disabled={isSaving}
                            >
                                {isSaving ? "Guardando..." : "Guardar cambios"}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/products")}
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