import React, { useState } from "react";
import Hero from "../../Components/shared/Hero.jsx";
import Style from "../../Styles/pages/Login.module.css";
import { Icon } from "@iconify/react";
import { Link } from "react-router";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string({
    required_error: "Este campo es obligatorio",
    invalid_type_error: "Debes ingresar un correo válido"
  })
    .min(1, { message: "Este campo es obligatorio" })
    .email({ message: "Debes ingresar un correo válido" }),
  password: z.string({
    required_error: "Este campo es obligatorio",
    invalid_type_error: "Este campo es obligatorio"
  })
    .min(1, { message: "Este campo es obligatorio" })
    .min(6, { message: "La clave debe tener al menos 6 caracteres" }),
});


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setSuccess(false);
    try {
      loginSchema.parse(form);
      setErrors({ email: "", password: "" });
      setLoading(true);
      const res = await fetch("/api/v1/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      if (!res.ok) {
        let errorMsg = "Credenciales incorrectas";
        try {
          const data = await res.json();
          errorMsg = data.message || errorMsg;
        } catch {}
        setGlobalError(errorMsg);
        setLoading(false);
        return;
      }
      const data = await res.json();
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            setSuccess(true);
            setLoading(false);
            window.location.href = "/";
          }
    } catch (err) {
      setLoading(false);
      if (err.errors) {
        const fieldErrors = { email: "", password: "" };
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
      } else {
        setGlobalError("Error inesperado. Intenta de nuevo.");
      }
    }
  };

  return (
    <main className={Style.main}>
      <Hero title="Iniciar Sesión" />
      <form className={Style.content} onSubmit={handleSubmit} noValidate>
        <h2 className={Style.formTitle}>Ingresar</h2>
        {globalError && <div className={Style.error}>{globalError}</div>}
        {success && <div className={Style.success}>¡Login exitoso!</div>}
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="email" className={Style.label}><Icon icon="mdi:alternate-email" width="24" height="24" /> Correo</label>
          <input
            type="email"
            className={Style.input}
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            disabled={loading}
          />
          {errors.email && <span className={Style.error}>{errors.email}</span>}
        </fieldset>
        <fieldset className={Style.fieldsetInput}>
          <label htmlFor="password" className={Style.label}><Icon icon="mdi:lock" width="24" height="24" /> Clave</label>
          <input
            type={showPassword ? "text" : "password"}
            className={Style.input}
            name="password"
            id="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={Style.eyeButton}
            disabled={loading}
          >
            <Icon
              icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
              width="24"
              height="24"
            />
          </button>
          {errors.password && <span className={Style.error}>{errors.password}</span>}
        </fieldset>
        <fieldset className={Style.fieldsetButtons}>
          <button type="submit" className={Style.buttonSubmit} disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <Link to="/register" className={Style.link}>Si no tenes cuenta, hace click acá</Link>
        </fieldset>
      </form>
    </main>
  );
};

export default Login;
