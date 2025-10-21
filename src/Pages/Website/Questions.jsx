import React from "react";
import { useState } from "react";
import Style from "../../Styles/pages/Questions.module.css";
import { Icon } from "@iconify/react";
import Hero from "../../Components/shared/Hero";

const questions = [
    {
        id: 1,
        question: "¿Cuáles son los métodos de pago disponibles?",
        answer: "Aceptamos todas las tarjetas de crédito y débito principales, transferencias bancarias y efectivo en nuestras tiendas físicas. También trabajamos con sistemas de pago online como MercadoPago."
    },
    {
        id: 2,
        question: "¿Cuál es el tiempo estimado de entrega?",
        answer: "Los tiempos de entrega varían según tu ubicación. Para envíos dentro de la ciudad, el tiempo estimado es de 24-48 horas hábiles. Para envíos al interior, puede tomar entre 3-5 días hábiles."
    },
    {
        id: 3,
        question: "¿Tienen política de devolución?",
        answer: "Sí, contamos con una política de devolución de 30 días. Si no estás satisfecho con tu compra, puedes devolverla en su empaque original y te reembolsaremos el monto completo."
    },
    {
        id: 4,
        question: "¿Cómo puedo rastrear mi pedido?",
        answer: "Una vez que tu pedido sea despachado, recibirás un correo electrónico con el número de seguimiento. Con este número podrás rastrear tu pedido a través de nuestra plataforma o directamente en el sitio web del courier."
    },
    {
        id: 5,
        question: "¿Tienen tiendas físicas?",
        answer: "Sí, contamos con tiendas físicas en los principales centros comerciales. Puedes encontrar la ubicación más cercana en nuestra sección de locales."
    },
    {
        id: 6,
        question: "¿Ofrecen garantía en los productos?",
        answer: "Todos nuestros productos cuentan con garantía del fabricante. El período de garantía varía según el producto, pero generalmente es de 6 meses a 1 año."
    }
];

const Questions = () => {
    const [openQuestion, setOpenQuestion] = useState(null);

    const toggleQuestion = (id) => {
        setOpenQuestion(openQuestion === id ? null : id);
    };

    return (
        <main className={Style.questionsMain}>
            <Hero title={"Preguntas"} />
            
            <div className={Style.accordion}>
                {questions.map((q) => (
                    <div key={q.id} className={Style.question}>
                        <div 
                            className={Style.questionHeader}
                            onClick={() => toggleQuestion(q.id)}
                        >
                            <h3 className={Style.questionTitle}>{q.question}</h3>
                            <Icon 
                                icon="mdi:chevron-down" 
                                className={`${Style.arrow} ${openQuestion === q.id ? Style.open : ''}`}
                            />
                        </div>
                        <div className={`${Style.answer} ${openQuestion === q.id ? Style.open : ''}`}>
                            <p>{q.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Questions;