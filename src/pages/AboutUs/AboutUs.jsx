import '../../styles/AboutUs/AboutUs.css'

export default function AboutUs() {
  return (
    <main id="about" className="about">
        <section className="about__header" role="banner">
            <div className="container">
                <h1>
                    <span className="accent">Sumergite</span> en Nuestra Historia
                </h1>
                <p className="kicker">
                    Fundada por los alumnos del equipo 11 de la materia Aplicaciones Interactivas
                </p>
            </div>
        </section>

        <section aria-labelledby="img1-title" className="about__block">
            <div className="container grid">
            <article className="about__content">
                <h2 id="img1-title">TITULO IMAGEN 1</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non eleifend ipsum, id iaculis ipsum. Donec viverra ullamcorper metus, eu dictum risus sagittis nec. Ut hendrerit, sapien quis lobortis faucibus, nisl dolor aliquet urna, at fermentum urna mauris sed nisl. Nunc vehicula dignissim tellus, at fringilla dolor semper eget. Praesent ullamcorper leo in facilisis blandit. Nam placerat imperdiet posuere. Morbi elit orci, porta sit amet semper in, rhoncus et justo. Curabitur consectetur dolor vitae ex gravida pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            </article>

            <figure className="about__figure">
                <img
                src="/About/AboutUs1.jpg"
                alt="Descripción breve de la imagen 1"
                width="480"
                height="360"
                />
                <figcaption className="sr-only">Imagen ilustrativa 1</figcaption>
            </figure>
            </div>
        </section>

        <section aria-labelledby="img2-title" className="about__block">
            <div className="container grid">
            <article className="about__content">
                <h2 id="img2-title">TITULO IMAGEN 2</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam non eleifend ipsum, id iaculis ipsum. Donec viverra ullamcorper metus, eu dictum risus sagittis nec. Ut hendrerit, sapien quis lobortis faucibus, nisl dolor aliquet urna, at fermentum urna mauris sed nisl. Nunc vehicula dignissim tellus, at fringilla dolor semper eget. Praesent ullamcorper leo in facilisis blandit. Nam placerat imperdiet posuere. Morbi elit orci, porta sit amet semper in, rhoncus et justo. Curabitur consectetur dolor vitae ex gravida pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.</p>
            </article>

            <figure className="about__figure">
                <img
                src="/About/AboutUs2.jpg"
                alt="Descripción breve de la imagen 2"
                width="480"
                height="360"
                />
                <figcaption className="sr-only">Imagen ilustrativa 2</figcaption>
            </figure>
            </div>
        </section>

    </main>
  );
}
