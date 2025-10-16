import React, { useMemo, useState } from "react";
import "../../styles/Historial/Historial.css";

const DATA = [
  { id: "#12345", fecha: "10-10-2025", vendedor: "Roman Lopez",    items: 2, total: 150.0, estado: "Entregado" },
  { id: "#12346", fecha: "11-10-2025", vendedor: "Facundo Fernandez", items: 3, total: 100.0, estado: "Enviado"   },
  { id: "#12347", fecha: "12-10-2025", vendedor: "Mariano Garcia",  items: 5, total: 50.0,  estado: "Enviado"   },
];

export default function HistorialVentas() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    if (!q.trim()) return DATA;
    const t = q.toLowerCase();
    return DATA.filter(r =>
      r.id.toLowerCase().includes(t) ||
      r.vendedor.toLowerCase().includes(t) ||
      r.estado.toLowerCase().includes(t)
    );
  }, [q]);

  return (
    <main className="historial">
      {/* Banner/fondo */}
      <section className="historial__hero" aria-label="piletas banner" />

      {/* Card principal */}
      <section className="historial__card">
        <div className="historial__card__header">
          <h1>Historial de Venta</h1>

          <div className="search">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar Producto / Vendedor / Estado"
              aria-label="Buscar en historial"
            />
          </div>
        </div>

        <div className="table-wrap" role="region" aria-label="Tabla de historial">
          <table className="history">
            <thead>
              <tr>
                <th>Orden ID</th>
                <th>Fecha</th>
                <th>Vendedor</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.fecha}</td>
                  <td>{r.vendedor}</td>
                  <td>{r.items}</td>
                  <td>${r.total.toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        "badge " +
                        (r.estado === "Entregado" ? "success" :
                         r.estado === "Enviado"   ? "info"    : "warn")
                      }
                    >
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer minimal (puedes reemplazar por tu Footer real) */}
      <footer className="historial__footer">
        <div>Novedades</div>
        <div>© 2025 | UADE</div>
        <div>Contacto</div>
      </footer>
    </main>
  );
}
