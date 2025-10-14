import '../../styles/Home/Home.css';

const products = [
  {
    id: 'full-body',
    title: 'FULL BODY',
    tag: 'MALLAS',
    image: '/Home/FullBody.jpg',
    alt: 'Traje de bano modelo Full Body',
  },
  {
    id: 'first-aid',
    title: 'FIRST AID',
    tag: 'SALVAMENTO',
    image: '/Home/FirstAidKit.jpg',
    alt: 'Kit de primeros auxilios para natacion',
  },
  {
    id: 'swim-cap',
    title: 'SWIM CAP',
    tag: 'ACCESORIOS',
    image: '/Home/SwimCap.jpg',
    alt: 'Gorra de natacion Swim Cap',
  },
  {
    id: 'swim-gg2',
    title: 'SWIM GG 2',
    tag: 'ANTIPARRAS',
    image: '/Home/SwimGG2.jpg',
    alt: 'Antiparras modelo Swim GG 2',
  },
];

const categories = ['MALLAS', 'ANTIPARRAS', 'ACCESORIOS', 'SALVAMENTO'];

export default function Home() {
  return (
    <main id="home" className="home">
      <section className="hero" aria-label="banner natacion">
        <div className="hero__bg">
          <h1 className="hero__title">
            SWIMMING VIBES
          </h1>
          </div>
      </section>

      <section className="panel" aria-labelledby="best-title">
          <div className="panel__left">
            <h2 id="best-title" className="panel__heading">
              Mas Vendidos
            </h2>

            <ul className="products" role="list">
              {products.map((product) => (
                <li key={product.id} className="product">
                  <figure className="product__media">
                    <img src={product.image} alt={product.alt} loading="lazy" />
                  </figure>

                    <div className="product__info">
                      <h3 className="product__title">{product.title}</h3>
                      <p className="product__tag">{product.tag}</p>
                    </div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="panel__right" aria-labelledby="cat-title">
            <h2 id="cat-title" className="panel__heading">
              Nuestras Categorias
            </h2>
            <nav aria-label="categorias destacadas" className="categorias">
              <ul className="tags" role="list">
                {categories.map((category) => (
                  <li key={category}>
                    <span className="tag">{category}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
      </section>
    </main>
  );
}
