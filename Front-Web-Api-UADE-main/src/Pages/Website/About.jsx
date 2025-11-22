import React from "react";
import Hero from "../../Components/shared/Hero";
import Style from "../../Styles/pages/About.module.css";

const aboutInfo = [
    {
        id: 1,
        title: "¿Quienes Somos?",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, ex? Quaerat facilis voluptas nihil recusandae necessitatibus enim quod eaque minus, ut, doloribus blanditiis? Perferendis repellat veritatis aspernatur autem deleniti cumque."
    },
    {
        id: 2,
        title: "Nuestro equipo",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, ex? Quaerat facilis voluptas nihil recusandae necessitatibus enim quod eaque minus, ut, doloribus blanditiis? Perferendis repellat veritatis aspernatur autem deleniti cumque."
    },
    {
        id: 3,
        title: "Encontranos",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, ex? Quaerat facilis voluptas nihil recusandae necessitatibus enim quod eaque minus, ut, doloribus blanditiis? Perferendis repellat veritatis aspernatur autem deleniti cumque."
    }
]

const About = () => {
    return (
        <main className={Style.aboutMain}>
            <Hero title={"Sobre Nosotros"} />
            <ul className={Style.info}>
                {aboutInfo.map((item) => (
                    <li key={item.id} className={Style.item}>
                        <h3 className={Style.title}>{item.title}</h3>
                        <p>{item.description}</p>
                    </li>
                    ))}
            </ul>
        </main>
    );
}

export default About;