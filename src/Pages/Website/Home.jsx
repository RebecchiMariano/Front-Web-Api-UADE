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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await fetch("/api/products/offers");
        // const data = await response.json();
        const data = await new Promise((resolve) => {
          setTimeout(() => {
            resolve(list);
          }, 1000);
        });
        setProducts(data);
        setCategories([...new Set(data.map((item) => item.category))]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className={Style.homeMain}>
      <Hero title="Swimming Vives" />
      <section className={Style.content}>
        <article className={Style.products}>
          <h2>Mas Vendidos</h2>
          <ul>
            {products.map((item) => (
              <li
                key={item.id}
                onClick={() => navigate(`/productos/${item.id}`)}
              >
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
          <h2>Categorias</h2>
          <nav>
            {categories.map((item, index) => (
              <Link
                key={index}
                to={`/productos?${new URLSearchParams({
                  category: item.toLowerCase(),
                }).toString()}`}
              >
                {item}
              </Link>
            ))}
          </nav>
        </article>
      </section>
    </main>
  );
};
export default Home;
