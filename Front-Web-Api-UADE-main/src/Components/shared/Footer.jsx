import React from "react";
import { Icon } from "@iconify/react";
import Style from "../../Styles/components/Footer.module.css";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";

const IconPath = "/img/Icon.svg";

const socialMediasList = [
  {
    id: 1,
    name: "Facebook",
    icon: "mdi:facebook",
    link: "https://www.facebook.com/SwimmingVives",
  },
  {
    id: 2,
    name: "Instagram",
    icon: "mdi:instagram",
    link: "https://www.instagram.com/SwimmingVives",
  },
  {
    id: 3,
    name: "Twitter",
    icon: "mdi:twitter",
    link: "https://www.twitter.com/SwimmingVives",
  },
];

const Footer = () => {
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .min(3, "El campo debe tener al menos 3 caracteres")
          .regex(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Por favor, ingresa un correo electrónico válido"
          ),
      })
    ),
    defaultValues: {
      email: "",
    },
  });
  return (
    <footer className={Style.footer}>
      <section className={Style.newsletter}>
        <h2>Novedades</h2>
        <form
          onSubmit={handleSubmit((data) => {
            new Promise((resolve) =>
              setTimeout(
                () => resolve(toast.success("Gracias por suscribirte")),
                1000
              )
            );
          })}
        >
          <fieldset>
            <label htmlFor="email">
              <Icon icon="mdi:email-outline" />
            </label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Correco Electronico"
              {...register("email")}
            />
            {formState.errors.email && (
              <output>{formState.errors.email.message}</output>
            )}
          </fieldset>
          <button type="submit" disabled={formState.isSubmitting}>
            <Icon
              icon={
                formState.isSubmitting ? "codex:loader" : "mdi:send-outline"
              }
            />
          </button>
        </form>
      </section>
      <section className={Style.data}>
        <figure>
          <img src={IconPath} alt="" />
        </figure>
        <article className={Style.info}>
          <h2>{new Date().getFullYear()}</h2>
          <p>UADE</p>
        </article>
        <article className={Style.copy}>
          <p>
            &copy; {new Date().getFullYear()} Swimming Vives. Todos los derechos
            reservados.
          </p>
        </article>
      </section>
      <section className={Style.socialMedia}>
        <h2>Contacto</h2>
        <nav>
          {socialMediasList.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon={item.icon} />
            </Link>
          ))}
        </nav>
      </section>
    </footer>
  );
};

export default Footer;
