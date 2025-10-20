import { useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router";
import Header from "../Components/shared/Header";
import Footer from "../Components/shared/Footer";
import { Toaster } from "react-hot-toast";

const Default = () => {
  const params = useParams();
  const { pathname } = useLocation();
  useEffect(() => {
    const title = params.id
      ? pathname
          .split("/")
          .filter((item) => item !== "")
          .shift()
      : pathname.split("/").pop();
    document.title =
      pathname === "/"
        ? `SV | HOME`
        : `SV | ${title.replace("/", "").toUpperCase()}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, params]);
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default Default;
