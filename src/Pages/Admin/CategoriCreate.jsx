import React from 'react';
import FormStyle from '../../Styles/pages/AdminProductsForm.module.css';
import Style from '../../Styles/pages/AdminProductsCreate.module.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { createCategory } from '../../Redux/Slices/category';
import Hero from '../../Components/shared/Hero';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const categorySchema = z.object({
  nombre: z.string().min(2, 'Nombre demasiado corto'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO']),
});

const CategoriCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.user.value);
  const categoryStatus = useSelector((s) => s.category.status);

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { nombre: '', descripcion: '', categoria: '', estado: 'ACTIVO' },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoria: data.categoria || null,
        estado: data.estado,
      };

      const result = await dispatch(createCategory({ payload, accessToken: user?.accessToken }));
      if (createCategory.fulfilled.match(result)) {
        Swal.fire({ title: 'Categoría creada', text: `La categoría "${data.nombre}" fue creada.`, icon: 'success' });
        reset();
        navigate('/admin');
      } else {
        throw new Error(result.payload || 'Error al crear categoría');
      }
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.message || 'Error al crear categoría', icon: 'error' });
    }
  };

  return (
    <main className={Style.main}>
      <Hero title="Crear Categoría" />
      <section className={Style.content}>
        <h2 className={Style.title}>Crear nueva categoría</h2>
        <div className={FormStyle.formGrid}>
          <div className={FormStyle.formCard}>
            <form onSubmit={handleSubmit(onSubmit)} className={FormStyle.form}>
              <div className={FormStyle.inputsGrid}>
                <div className={`${FormStyle.field} ${FormStyle.full}`}>
                  <label className={FormStyle.label}>Nombre</label>
                  <input className={FormStyle.input} type='text' placeholder='Ej: ELECTRONICA' {...register('nombre')} />
                  {formState.errors?.nombre && <div className={FormStyle.error}>{formState.errors.nombre.message}</div>}
                </div>

                <div className={`${FormStyle.field} ${FormStyle.full}`}>
                  <label className={FormStyle.label}>Descripción</label>
                  <textarea className={FormStyle.input} {...register('descripcion')} rows={3} placeholder='Una breve descripción' />
                </div>

                <div className={FormStyle.field}>
                  <label className={FormStyle.label}>Categoria (enum)</label>
                  <input className={FormStyle.input} {...register('categoria')} placeholder='EJ: COMPUTACION' />
                </div>

                <div className={`${FormStyle.field} ${FormStyle.full}`}>
                  <label className={FormStyle.label}>Estado</label>
                  <select className={FormStyle.input} {...register('estado')}>
                    <option value='ACTIVO'>ACTIVO</option>
                    <option value='INACTIVO'>INACTIVO</option>
                  </select>
                </div>
              </div>

              <div className={FormStyle.actions}>
                <button type='submit' className={FormStyle.submit} disabled={categoryStatus === 'loading'}>Crear Categoría</button>
                <button type='button' className={FormStyle.cancel} onClick={() => navigate('/admin')}>Cancelar</button>
              </div>
            </form>
          </div>

          <aside className={FormStyle.previewCard}>
            <div className={FormStyle.previewMeta}>
              <strong>Vista previa</strong>
              <span className={FormStyle.hint}>Nombre y descripción de tu categoría aparecerán aquí luego de crearla</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default CategoriCreate;
