import React from "react";
import Style from "../../Styles/components/Hero.module.css";

const bannerImagePath = "/img/swimmerBanner.webp";

const Hero = ({ title, backgroundImage }) => {
  const imgSrc = backgroundImage || bannerImagePath;
  return (
    <section className={Style.heroSection}>
      <img src={imgSrc} alt={title || "Banner"} />
      <div className={Style.heroTitleContainer}>
        <h1>{title}</h1>
      </div>
    </section>
  );
};

export default Hero;
