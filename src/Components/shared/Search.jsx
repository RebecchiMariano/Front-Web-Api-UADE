import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate, useLocation } from "react-router";
import Style from "../../Styles/components/Search.module.css";
const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, formState } = useForm({
    resolver: zodResolver(
      z.object({
        search: z.preprocess(
          (value) => value.trim().replace(/\s+/g, " "),
          z.string().min(3, "El campo debe tener al menos 3 caracteres")
        ),
      })
    ),
    defaultValues: {
      search: "",
    },
  });
  useEffect(() => {
    if (location.pathname === "/productos") {
      setValue("search", new URLSearchParams(location.search).get("search"));
    }
  }, [location, setValue]);
  return (
    <form
      onSubmit={handleSubmit((data) =>
        navigate(
          `/productos?${new URLSearchParams({
            ...location.search,
            ...data,
          }).toString()}`
        )
      )}
      className={Style.searchForm}
    >
      {open && (
        <>
          <fieldset className={Style.fieldset}>
            <input
              type="text"
              name="search"
              id="search"
              {...register("search")}
            />
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className={Style.submit}
            >
              <Icon
                icon={
                  formState.isSubmitting
                    ? "codex:loader"
                    : "material-symbols:search"
                }
              />
            </button>
          </fieldset>
        </>
      )}
      <button
        type="button"
        disabled={formState.isSubmitting}
        className={`${Style.toggle} ${open ? Style.open : ""}`}
      >
        <Icon
          icon={open ? "material-symbols:close" : "material-symbols:search"}
          onClick={() => setOpen(!open)}
          className={`${Style.icon}`}
        />
      </button>
    </form>
  );
};

export default Search;
