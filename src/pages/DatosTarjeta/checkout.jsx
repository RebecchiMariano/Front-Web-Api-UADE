import React from "react";
import "./checkout.css"; // importa tu CSS

const Checkout = () => {
  return (
    <div className="page">
      {/* Barra de búsqueda (espacio reservado) */}
      <div className="search-bar">
        {/* Aquí irá la barra de búsqueda */}
      </div>

      {/* Contenedor principal del checkout */}
      <main className="checkout-container">
        {/* Resumen del carrito */}
        <section className="summary">
          <h2>Carrito / Checkout</h2>
          <div className="total">
            <p>
              Antiparras Adidas Nike <span>x2</span>
            </p>
            <p>
              Antiparras Natación Espalda <span>x3</span>
            </p>
            <p>
              <strong>Total</strong> <span>$181.5</span>
            </p>
          </div>
        </section>

        {/* Formulario de pago */}
        <section className="form-container">
          <h2>Pago</h2>

          <div className="form-section">
            <h3>Información de Pago</h3>
            <form>
              <label>
                Número de Tarjeta
                <input type="text" placeholder="0000 0000 0000 0000" />
              </label>
              <label>
                Fecha de Expiración
                <input type="text" placeholder="MM/AA" />
              </label>
              <label>
                CVV
                <input type="text" placeholder="123" />
              </label>
              <label>
                Nombre en la Tarjeta
                <input type="text" placeholder="Nombre Completo" />
              </label>
            </form>
          </div>

          <hr />

          <div className="form-section">
            <h3>Dirección de Envío</h3>
            <form>
              <label>
                Ciudad
                <input type="text" placeholder="Buenos Aires" />
              </label>
              <label>
                Código Postal
                <input type="text" placeholder="00000" />
              </label>
              <label>
                Dirección
                <input type="text" placeholder="Calle, número, barrio" />
              </label>
            </form>
          </div>
        </section>

        {/* Botón de confirmar compra */}
        <div className="confirm-button">
          <button>Confirmar Compra</button>
        </div>
      </main>

      {/* Footer */}
      <footer>{/* Aquí irá el footer */}</footer>
    </div>
  );
};

export default Checkout;
