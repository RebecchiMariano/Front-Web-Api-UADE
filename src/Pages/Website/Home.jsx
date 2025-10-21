import { useEffect, useState } from "react";
import Hero from "../../Components/shared/Hero.jsx";
import { Link, useNavigate } from "react-router";
import Style from "../../Styles/pages/Home.module.css";

const list = [
  {
    id: 1,
    name: "Full Body",
    category: "Mallas",
    img: "/img/fullBodyWomen.jpg",
  },
  {
    id: 2,
    name: "First Aid",
    category: "Salvamento",
    img: "/img/backpack.webp",
  },
  {
    id: 3,
    name: "Swim Cap",
    category: "Accesorios",
    img: "/img/swimCap.webp",
  },
  {
    id: 4,
    name: "Swim GG 2",
    category: "Antiparras",
    img: "/img/antiparras.jpg",
  },
];

const Home = () => {
  const [products, setProducts] = useState(list);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/categorias/");
        const data = await response.json();
        const activas = data.filter((cat) => cat.estado === "ACTIVO");
        setCategories(activas);
      } catch (error) {
        console.error("Error fetching categorías:", error);
      }
    };
    fetchCategorias();
  }, []);


  return (
    <main className={Style.homeMain}>
      <Hero title="Swimming Vives" />
      <section className={Style.content}>
        <article className={Style.products}>
          <h2>Más Vendidos</h2>
          <ul>
            {products.map((item) => (
              <li key={item.id} onClick={() => navigate(`/productos/${item.id}`)}>
                <figure>
                  <img src={item.img} alt={item.name} />
                </figure>
                <article>
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                </article>
              </li>
            ))}
          </ul>
        </article>

        <article className={Style.categories}>
          <h2>Categorías</h2>
          <nav>
            {categories.map((item) => (
              <Link
                key={item.nombre}
                to={`/productos?${new URLSearchParams({
                  category: item.nombre,
                }).toString()}`}
              >
                {item.nombre}
              </Link>
            ))}
          </nav>
        </article>

      </section>
    </main>
  );
};

export default Home;
