import { useState } from "react";
import Hero from "../../Components/shared/Hero.jsx";
import Style from "../../Styles/pages/Login.module.css";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { setUser } from "../../Redux/Slices/user.js";
const loginSchema = z.object({
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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState, setError } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const access = async (data) => {
    try {
      const res = await fetch("/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errorMsg = errorData.message || "Error de credenciales";
        throw new Error(errorMsg);
      }

      const result = await res.json();
      const accessToken = result.access_token;

      if (accessToken) {
        dispatch(setUser({ accessToken }));
        navigate("/");
      }
    } catch (err) {
      setError("root", { message: err.message });
    }
  };


  return (
    <main className={Style.main}>
      <Hero title="Iniciar Sesión" />
      <form
        className={Style.content}
        onSubmit={handleSubmit(access)}
        noValidate
      >
        <h2 className={Style.formTitle}>Ingresar</h2>
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="email" className={Style.label}>
            <Icon icon="mdi:alternate-email" width="24" height="24" /> Correo
          </label>
          <input
            type="email"
            className={Style.input}
            name="email"
            id="email"
            autoComplete="email"
            {...register("email")}
          />
          {formState.errors?.email && (
            <output className={Style.error}>
              {formState.errors.email.message}
            </output>
          )}
        </fieldset>
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="password" className={Style.label}>
            <Icon icon="mdi:lock" width="24" height="24" /> Clave
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className={Style.input}
            name="password"
            id="password"
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={Style.eyeButton}
          >
            <Icon
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
              width="24"
              height="24"
            />
          </button>
          {formState.errors?.password && (
            <output className={Style.error}>
              {formState.errors.password.message}
            </output>
          )}
        </fieldset>
        <fieldset className={Style.fieldsetButtons}>
          <button
            type="submit"
            className={Style.buttonSubmit}
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
          {formState.errors?.root && (
            <output className={Style.error}>
              {formState.errors.root.message}
            </output>
          )}
        </fieldset>
        <Link to="/register" className={Style.link}>
          Si no tenes cuenta, hace click acá
        </Link>
      </form>
    </main>
  );
};

export default Login;
