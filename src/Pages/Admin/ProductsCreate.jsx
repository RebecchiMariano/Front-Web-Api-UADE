import React, { useEffect } from "react";
import Style from "../../Styles/pages/AdminProductsCreate.module.css";
import { useSelector, useDispatch } from "react-redux";
import Hero from "../../Components/shared/Hero";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchCategories } from "../../Redux/Slices/product";

const productSchema = z.object({
  nombre: z.string().min(2, "Nombre demasiado corto"),
  descripcion: z.string().min(5, "Ingrese una descripción"),
  categoriaId: z.string().optional(),
  categoriaNombre: z.string().optional(),
  cantidad: z.coerce.number().min(0),
  valor: z.coerce.number().min(0),
  descuento: z.coerce.number().min(0).max(100),
  estado: z.enum(["ACTIVO", "INACTIVO"]),
});

const ProductsCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const categories = useSelector((state) => state.product.categories || []);

  const { register, handleSubmit, formState, setError, reset } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoriaId: "",
      categoriaNombre: "",
      cantidad: 0,
      valor: 0,
      descuento: 0,
      foto: "",
      estado: "ACTIVO",
    },
  });

  useEffect(() => {
    if (user?.accessToken) {
      dispatch(fetchCategories(user.accessToken));
    }
  }, [user, dispatch]);

  const onSubmit = async (data) => {
    try {
      // Normalizar categoría
      const categoria =
        data.categoriaId && data.categoriaId !== ""
          ? { id: data.categoriaId }
          : data.categoriaNombre
          ? { nombre: data.categoriaNombre }
          : null;

      if (!categoria) {
        throw new Error("Debe seleccionar o ingresar una categoría.");
      }

      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        cantidad: data.cantidad,
        valor: data.valor,
        descuento: data.descuento,
        foto: data.foto,
        estado: data.estado,
        categoria,
        datos: [],
      };

      const res = await fetch(`/api/productos/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken
            ? { Authorization: `Bearer ${user.accessToken}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let body;

      try {
        body = JSON.parse(text);
      } catch {
        body = { message: text };
      }

      if (!res.ok) throw new Error(body.message || "Error al crear el producto");

      Swal.fire({
        title: "Producto creado",
        text: `El producto "${data.nombre}" fue creado correctamente.`,
        icon: "success",
      });

      reset();
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      setError("root", { message: err.message });
      Swal.fire({
        title: "Error",
        text: err.message || "Error inesperado",
        icon: "error",
      });
    }
  };

  return (
    <main className={Style.main}>
      <Hero title="Crear Producto" />
      <section className={Style.content}>
        <h2 className={Style.title}>Crear nuevo producto</h2>

        <form className={Style.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className={Style.row}>
            <label>Nombre</label>
            <input type="text" {...register("nombre")} />
            {formState.errors?.nombre && (
              <div className={Style.error}>{formState.errors.nombre.message}</div>
            )}
          </div>

          <div className={Style.row}>
            <label>Descripción</label>
            <textarea rows={4} {...register("descripcion")} />
            {formState.errors?.descripcion && (
              <div className={Style.error}>
                {formState.errors.descripcion.message}
              </div>
            )}
          </div>

          <div className={Style.rowInline}>
            <div>
              <label>Categoría existente</label>
              <select {...register("categoriaId")}>
                <option value="">-- Seleccionar --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Nueva categoría</label>
              <input
                type="text"
                {...register("categoriaNombre")}
                placeholder="Nombre de la categoría"
              />
            </div>
          </div>

          <div className={Style.rowInline}>
            <div>
              <label>Cantidad</label>
              <input type="number" {...register("cantidad")} />
            </div>

            <div>
              <label>Precio (ARS)</label>
              <input type="number" step="0.01" {...register("valor")} />
            </div>
          </div>

          <div className={Style.rowInline}>
            <div>
              <label>Descuento %</label>
              <input type="number" {...register("descuento")} />
            </div>

            <div>
              <label>Foto (URL)</label>
              <input type="text" {...register("foto")} placeholder="https://..." />
            </div>
          </div>

          <div className={Style.row}>
            <label>Estado</label>
            <select {...register("estado")}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
            </select>
          </div>

          <div className={Style.actions}>
            <button className={Style.submit} type="submit">
              Crear Producto
            </button>
            <button
              type="button"
              className={Style.cancel}
              onClick={() => navigate("/admin/products")}
            >
              Cancelar
            </button>
          </div>

          {formState.errors?.root && (
            <div className={Style.error}>{formState.errors.root.message}</div>
          )}
        </form>
      </section>
    </main>
  );
};

export default ProductsCreate;
