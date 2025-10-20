import { useState, useEffect } from "react";
import Style from "../../Styles/pages/Products.module.css";
import Hero from "../../Components/shared/Hero.jsx";
import { useNavigate, useLocation, Link } from "react-router";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../../Redux/Slices/cart.js";

const Products = () => {
  const { user } = useSelector((state) => state.user);
  const items = useSelector((state) => state.cart.value);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const money = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  });
  useEffect(() => {
    console.log("items", items);
  }, [items]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const response = await fetch(`/api/usuario`);
        // const data = await response.json();
        setProfile(user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);
  // Fetch de categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch("http://localhost:8080/categorias/");
        const data = await response.json();

        setCategorias(data.filter(cat => cat.estado === "ACTIVO"));
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const search = params.get("search");
        const categoryId = params.get("category");
        let query = new URLSearchParams({ page });

        if (search) {
          query.set("search", search);
          setSearch(search);
        } else {
          setSearch("");
        }

        if (categoryId) {
          setCategory(categoryId);
        } else {
          setCategory("");
        }

        // Fetch productos según la categoría seleccionada
        let response;
        if (category) {
          response = await fetch(`http://localhost:8080/productos/categoria/nombre/${encodeURIComponent(category)}`);
        } else if (search) {
          response = await fetch(`http://localhost:8080/productos/buscar?q=${encodeURIComponent(search)}`);
        } else {
          response = await fetch("http://localhost:8080/productos/todos");
        }


        const productos = await response.json();

        // Mapeo para adaptar los datos al frontend
        const mapped = productos.map((producto) => ({
          id: producto.id,
          name: producto.nombre,
          category: producto.categoria?.nombre || "Sin categoría",
          categoryId: producto.categoria?.id,
          img: producto.foto || "/img/default.jpg",
          price: producto.valor,
          descripcion: producto.descripcion,
          cantidad: producto.cantidad,
          descuento: producto.descuento,
        }));

        setProducts(mapped);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [page, location]);

  return (
    <main className={Style.productsMain}>
      <Hero title="Swimming Vives" />
      <section className={Style.content}>
        <article className={Style.categories}>
          <h2>Categorias</h2>
          <nav>
            <Link
              to="/productos"
              className={`${Style.category} ${!category ? Style.active : ""}`}
            >
              Todas las categorías
            </Link>
            {categorias.map((item) => (
              <Link
                key={item.id}
                to={`/productos?${new URLSearchParams({
                  category: item.nombre
                }).toString()}`}
                className={`${Style.category} ${category === item.nombre ? Style.active : ""
                  }`}
              >
                {item.nombre}
              </Link>

            ))}
          </nav>
        </article>
        <article className={Style.products}>
          <header>
            <h2>Productos</h2>
            <p>
              {search && `Resultados para "${search}"`}
              {category && `Categoría "${categorias.find(cat => cat.id === category)?.nombre || 'Sin categoría'}"`}
            </p>
          </header>
          <ul>
            {products.map((producto) => (
              <li
                key={producto.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/productos/${producto.id}`);
                }}
              >
                <figure>
                  <img src={producto.img} alt={producto.name} />
                </figure>
                <article>
                  <h3>{producto.name}</h3>
                  <p>{producto.category}</p>
                </article>

                {user && profile?.role !== "admin" && (
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className={Style.formCart}
                  >
                    <output>{money.format(producto.price)} </output>
                    {Array.isArray(items) &&
                      items.find((item) => item.id === producto.id) && (
                        <span className={Style.quantity}>
                          {
                            items.find((item) => item.id === producto.id)
                              .quantity
                          }
                        </span>
                      )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dispatch(add(producto));
                      }}
                    >
                      <Icon icon="mdi:cart" />
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => e.preventDefault()}
            className={Style.pagination}
          >
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <Icon icon="mdi:chevron-left" />
            </button>
            <output>{page}</output>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={products.length <= 12}
            >
              <Icon icon="mdi:chevron-right" />
            </button>
          </form>
        </article>
      </section>
    </main>
  );
};

export default Products;
