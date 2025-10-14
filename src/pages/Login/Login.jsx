import React from 'react';
import './login.css';

const Login = () => {
  return (
    <div className="page">
      {/* Header */}
      <div className="heather">
        <h1>barra de busqueda aca</h1>
      </div>

      {/* Banner */}
      <div className="banner">
        <h1>Imagen aca</h1>
      </div>

      {/* Rectángulo gris encima del banner */}
      <main className="wide-gray">
        {/* Cubo blanco de login */}
        <section className="card">
          <h1>Ingresar</h1>
          <form id="loginForm">
            <label className="field">
              <span>Correo:</span>
              <input type="email" placeholder="Correo" required />
            </label>
            <label className="field">
              <span>Clave:</span>
              <input type="password" placeholder="Clave" required />
            </label>
            <button type="submit">Ingresar</button>
            <button type="button">Si no tenes cuenta, hace click acá</button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>© 2025 | UADE</p>
        <p>Todos los derechos reservados</p>
      </footer>
    </div>
  );
};

export default Login;