import React from "react";
import "../../styles/categorias/categorias.css";

const Categorias = () => {
  return (
    <div>
      {/* HEADER */}
      <header id="main-header">
        <h1>HEADER</h1>
      </header>

      {/* BANNER */}
      <section className="banner">
        <img src="banner.jpg" alt="Banner de natación" />
      </section>

      {/* CONTENEDOR PRINCIPAL */}
      <main className="contenedor-principal">
        <div className="lista-productos">
          {/* FILTRO IZQUIERDO */}
          <aside className="filtro">
            <h3>Categorías</h3>
            <ul>
              <li>
                <input type="checkbox" id="mallas" />{" "}
                <label htmlFor="mallas">Mallas</label>
              </li>
              <li>
                <input type="checkbox" id="antiparras" />{" "}
                <label htmlFor="antiparras">Antiparras</label>
              </li>
              <li>
                <input type="checkbox" id="accesorios" />{" "}
                <label htmlFor="accesorios">Accesorios</label>
              </li>
              <li>
                <input type="checkbox" id="salvamento" />{" "}
                <label htmlFor="salvamento">Salvamento</label>
              </li>
            </ul>

            <h3>Precio</h3>
            <div className="precio-filtro">
              <label>Min</label>
              <input type="number" placeholder="Min" />
              <label>Max</label>
              <input type="number" placeholder="Max" />
            </div>
          </aside>

          {/* LISTA DE PRODUCTOS */}
          <section className="productos">
            <h2>Lista de productos</h2>
            <input
              type="text"
              placeholder="Buscar..."
              className="buscador"
            />

            <div className="cards-container">
              {/* Simulación de muchos productos */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div className="card" key={i}>
                  <img
                    src={`antiparra${(i % 3) + 1}.jpg`}
                    alt={`Antiparra ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="paginacion">
              <button>&lt;</button>
              <span>1</span>
              <button>&gt;</button>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-section"></div>
      </footer>
    </div>
  );
};

export default Categorias;
