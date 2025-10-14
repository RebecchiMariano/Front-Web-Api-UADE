import React from 'react';
import '../../styles/DetalleProducto/DetalleProducto.css';

const DetalleProducto = () => {
  return (
    <div className="detalle-producto">
      {/* Header */}
      <div className="header-placeholder">
        <div className="header-content">
          {/* Aquí iría el componente del header */}
        </div>
      </div>

      {/* Banner */}
      <div className="banner"></div>

      {/* Hoja producto */}
      <div className="product-card-wrapper">
        
        <div className="product-card">
          {/* Imágenes producto */}
          <div className="product-images">
            <div className="image-cube main-image-cube" alt="Producto principal"></div>
            <div className="thumbnails">
              <div className="image-cube thumbnail-cube"></div>
              <div className="image-cube thumbnail-cube"></div>
              <div className="image-cube thumbnail-cube"></div>
              <div className="image-cube thumbnail-cube"></div>
            </div>
          </div>
          
          {/* Descripción producto */}
          <div className="product-info">
            <h1 className="title">SWIM GG 2</h1>
            <p className="subtitle">ANTIPARRAS DE COMPETICIÓN</p>
            
            <div className="characteristics">
              <p>CARACTERÍSTICAS</p>
              <p className="detail-line">⚫ COLOR: AZUL</p>
            </div>

            <div className="price-box">
              <span className="price">$100.000</span>
              <p className="price-message">INICIAR SESIÓN PARA AGREGAR EL PRODUCTO AL CARRITO</p>
            </div>
          </div>
        </div>

        {/* Productos recomendados */}
        <div className="product-recommendations">
          <div className="related-list">
            <div className="related-item">
              <div className="related-image-cube"></div>
            </div>
            <div className="related-item">
              <div className="related-image-cube"></div>
            </div>
            <div className="related-item">
              <div className="related-image-cube"></div>
            </div>
            <div className="related-item">
              <div className="related-image-cube"></div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-section">
          {/* Aquí iría el componente del footer */}
        </div>
      </footer>
    </div>
  );
};

export default DetalleProducto;