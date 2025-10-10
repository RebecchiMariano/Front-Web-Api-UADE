import './Home.css';

export default function Home() {
  return (
    <main id="home" className="home">
      <section className="hero" aria-label="Hero swimming">
        <div className="hero__bg" />
        <div className="container">
          <h1 className="hero__title"><span>SWIMMING</span> VIBES</h1>
        </div>
      </section>

      <section className="panel" aria-labelledby="best-title">
        <div className="container panel__grid">
          <div className="panel__left">
            <h2 id="best-title">MAS VENDIDOS</h2>
            <ul className="products" role="list">
              <li className="product">
                <figure className="product__media" aria-label="Full Body">
                  <img src='/Home/FullBody.jpg' alt="Full Body" />
                </figure>
                <div className="product__info">
                  <h3 className="product__title">FULL BODY</h3>
                  <p className="product__tag">MALLAS</p>
                </div>
              </li>
              <li className="product">
                <figure className="product__media">
                  <img src="/Home/FirstAidKit.jpg" alt="First Aid" />
                </figure>
                <div className="product__info">
                  <h3 className="product__title">FIRST AID</h3>
                  <p className="product__tag">SALVAMENTO</p>
                </div>
              </li>
              <li className="product">
                <figure className="product__media">
                  <img src="/Home/SwimCap.jpg" alt="Swim Cap" />
                </figure>
                <div className="product__info">
                  <h3 className="product__title">SWIM CAP</h3>
                  <p className="product__tag">ACCESORIOS</p>
                </div>
              </li>
              <li className="product">
                <figure className="product__media">
                  <img src="/Home/SwimGG2.jpg" alt="Swim GG 2" />
                </figure>
                <div className="product__info">
                  <h3 className="product__title">SWIM GG 2</h3>
                  <p className="product__tag">ANTIPARRAS</p>
                </div>
              </li>
            </ul>
          </div>

          <aside className="panel__right" aria-labelledby="cat-title">
            <h2 id="cat-title">CATEGORIAS</h2>
            <nav aria-label="categorías">
              <ul className="tags" role="list">
                <li><a href="#" className="tag">MALLAS</a></li>
                <li><a href="#" className="tag">ANTIPARRAS</a></li>
                <li><a href="#" className="tag">ACCESORIOS</a></li>
                <li><a href="#" className="tag">SALVAMENTO</a></li>
              </ul>
            </nav>
          </aside>
        </div>
      </section>
    </main>
  );
}

