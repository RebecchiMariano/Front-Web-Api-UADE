import { createBrowserRouter } from "react-router";
import Default from "./Layouts/Default";
import User from "./Layouts/User";
import Admin from "./Layouts/Admin";
import Home from "./Pages/Website/Home";
import About from "./Pages/Website/About";
import Questions from "./Pages/Website/Questions";
import Products from "./Pages/Website/Products";
import Product from "./Pages/Website/Product";
import Login from "./Pages/Website/Login";
import Register from "./Pages/Website/Register";
import Profile from "./Pages/User/Profile";
import Cart from "./Pages/User/Cart";
import Checkout from "./Pages/User/Checkout";
import Dashboard from "./Pages/Admin/Dashboard";
import AdminProducts from "./Pages/Admin/Products";
import AdminOrders from "./Pages/Admin/Orders";
import AdminProductsCreate from "./Pages/Admin/ProductsCreate";
import AdminProductsUpdate from "./Pages/Admin/ProductsUpdate";
import Logout from "./Pages/Website/Logout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "questions",
        element: <Questions />,
      },
      {
        path: "productos",
        element: <Products />,
      },
      {
        path: "productos/:id",
        element: <Product />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "user",
        element: <User />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "cart",
            element: <Cart />,
          },
          {
            path: "checkout",
            element: <Checkout />,
          },
        ],
      },
      {
        path: "admin",
        element: <Admin />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "products",
            element: <AdminProducts />,
          },
          {
            path: "products/create",
            element: <AdminProductsCreate />,
          },
          {
            path: "products/:id",
            element: <AdminProductsUpdate />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
        ],
      },
    ],
  },
]);

export default router;