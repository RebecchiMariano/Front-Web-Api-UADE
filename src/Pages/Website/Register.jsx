import { useState } from "react";
import Hero from "../../Components/shared/Hero.jsx";
import Style from "../../Styles/pages/Register.module.css";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Slices/user.js";
const registerSchema = z.object({
  nombre: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "Debes ingresar un correo válido",
    })
    .min(3, { message: "Este campo debe tener al menos 3 caracteres" }),
  apellido: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "Debes ingresar un correo válido",
    })
    .min(3, { message: "Este campo debe tener al menos 3 caracteres" }),
  dni: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "Debes ingresar un dni válido",
    })
    .min(7, { message: "Este campo debe tener al menos 7 digitos" })
    .max(11, { message: "Este campo debe tener máximo 11 digitos" })
    .regex(/^\d+$/, { message: "Unicamente numeros por favor." }),
  email: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "Debes ingresar un correo válido",
    })
    .min(1, { message: "Este campo es obligatorio" })
    .regex(/\S+@\S+\.\S+/, {
      message: "Debes ingresar un correo válido",
    }),
  password: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "Este campo es obligatorio",
    })
    .min(1, { message: "Este campo es obligatorio" })
    .min(6, { message: "La clave debe tener al menos 6 caracteres" }),
});
const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      email: "",
      password: "",
    },
  });

  const save = async (data) => {
    try {
      const registrationData = {
        ...data,
        dni: parseInt(data.dni, 10),
        role: "COMPRADOR",
        estado: "ACTIVO"
      };
      const res = await fetch("/api/v1/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
      let resultData;
      try {
        resultData = await res.json();
      } catch (e) {
        resultData = {};
      }
      if (!res.ok) {
        let errorMsg = resultData.message || "Error desconocido al registrar.";
        if (resultData.errors && resultData.errors.length > 0) {
          errorMsg = resultData.errors.map(err => err.defaultMessage).join(', ');
        }
        throw new Error(errorMsg);
      }devTools: true
      const loginRes = await fetch("/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!loginRes.ok) {
        throw new Error("Registro exitoso, pero el inicio de sesión automático falló.");
      }
      const loginData = await loginRes.json();
      const accessToken = loginData.access_token || loginData.accessToken;

      if (accessToken) {
        dispatch(setUser({ accessToken }));
        navigate("/");
      } else {
        throw new Error("Registro exitoso, pero no se recibió el token de acceso.");
      }

    } catch (err) {
      setError("root", { message: err.message });
    }
  };
  return (
    <main className={Style.main}>
      <Hero title="Registro" />
      <section className={Style.content}>
        <h2 className={Style.title}>Registrarse</h2>
        <form className={Style.form} onSubmit={handleSubmit(save)} noValidate>
          <fieldset className={`${Style.fieldset} ${Style.column}`}>
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" type="text" {...register("nombre")} />
            {formState.errors?.nombre && (
              <output className={Style.error}>
                {formState.errors.nombre.message}
              </output>
            )}
          </fieldset>
          <fieldset className={`${Style.fieldset} ${Style.column}`}>
            <label htmlFor="apellido">Apellido</label>
            <input id="apellido" type="text" {...register("apellido")} />
            {formState.errors?.apellido && (
              <output className={Style.error}>
                {formState.errors.apellido.message}
              </output>
            )}
          </fieldset>
          <fieldset className={`${Style.fieldset} ${Style.column}`}>
            <label htmlFor="dni">DNI</label>
            <input id="DNI" type="text" {...register("dni")} />
            {formState.errors?.dni && (
              <output className={Style.error}>
                {formState.errors.dni.message}
              </output>
            )}
          </fieldset>
          <fieldset className={`${Style.fieldset} ${Style.full}`}>
            <label htmlFor="email">
              <Icon icon="mdi:email" />
              Email
            </label>
            <input id="email" type="text" {...register("email")} />
            {formState.errors?.email && (
              <output className={Style.error}>
                {formState.errors.email.message}
              </output>
            )}
          </fieldset>
          <fieldset className={`${Style.fieldset} ${Style.full}`}>
            <label htmlFor="password">
              <Icon icon="mdi:lock" />
              Clave
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
            />
            <button
              type="button"
              className={`${Style.button} ${Style.password}`}
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon icon={!showPassword ? "mdi:eye" : "mdi:eye-off"} />
            </button>
            {formState.errors?.password && (
              <output className={Style.error}>
                {formState.errors.password.message}
              </output>
            )}
          </fieldset>
          <fieldset className={`${Style.fieldset} ${Style.buttons}`}>
            <button
              type="submit"
              className={`${Style.button} ${Style.submit}`}
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Procesando..." : "Registrar"}
            </button>
            {formState.errors?.root && (
              <output className={Style.error}>
                {formState.errors.root.message}
              </output>
            )}
          </fieldset>
        </form>
      </section>
    </main>
  );
};

export default Register;
