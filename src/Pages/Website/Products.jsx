import { useState, useEffect } from "react";
import Style from "../../Styles/pages/Products.module.css";
import Hero from "../../Components/shared/Hero.jsx";
import { useNavigate, useLocation, Link } from "react-router";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { addToCartAsync } from "../../Redux/Slices/cart.js";
import { fetchProducts } from "../../Redux/Slices/product.js";

const Products = () => {
  const { user } = useSelector((state) => state.user);
  const items = useSelector((state) => state.cart.value);
  const cartStatus = useSelector((state) => state.cart.status);
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.product);
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
  }, [items]);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
    const params = new URLSearchParams(location.search);
    const currentSearch = params.get("search");
    const categoryName = params.get("category");

    setSearch(currentSearch || "");
    setCategory(categoryName || "");

    dispatch(fetchProducts({ category: categoryName, search: currentSearch }));
  }, [location, dispatch]);


  const handleAddToCart = (producto) => {
    if (!user?.accessToken) {
      console.warn("Usuario no autenticado. No se puede agregar al carrito.");
      return;
    }

    dispatch(addToCartAsync({
      productoId: producto.id,
      cantidad: 1,
      accessToken: user.accessToken,
      productData: {
        id: producto.id,
        name: producto.name,
        category: producto.category,
        price: producto.price,
        img: producto.img
      }
    }));
  };

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
              {category && `Categoría "${categorias.find(cat => cat.nombre === category)?.nombre || 'Sin categoría'}"`}
            </p>
          </header>
          <ul>
            {products.filter(product => product.estado === 'ACTIVO').map((producto) => (
              <li
                key={producto.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/productos/${producto.name}`);
                }}
              >
                <figure>
                  <img
                    src={producto.img || "/img/default.jpg"}
                    alt={producto.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/img/default.jpg";
                    }}
                  />
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
                        handleAddToCart(producto);
                      }}
                      disabled={cartStatus === 'loading'}
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
