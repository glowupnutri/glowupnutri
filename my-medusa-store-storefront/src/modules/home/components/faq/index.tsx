"use client"

import { useState } from "react"

const faqData = [
    {
        question: "Czym jest GlowUp Nutrition?",
        answer: "GlowUp Nutrition to marka autorskich mixów suplementacyjnych, tworzonych w oparciu o otwarte dane naukowe i badania kliniczne. Łączymy składniki w synergicznych formułach, by dostarczyć realne efekty — bez lania wody i bez domysłów.",
    },
    {
        question: "Z czego składają się Wasze mixy?",
        answer: "Każdy mix to starannie dobrana kombinacja składników aktywnych w optymalnych, klinicznie potwierdzonych dawkach. Używamy wyłącznie sprawdzonych surowców o udowodnionym działaniu. Pełny skład znajdziesz na karcie każdego produktu.",
    },
    {
        question: "Ile kosztuje dostawa i kiedy otrzymam przesyłkę?",
        answer: "Dostawa na terenie Polski jest bezpłatna przy zamówieniach powyżej 150 zł. Standardowy czas realizacji to 1-3 dni robocze. Każde zamówienie jest starannie pakowane i wysyłane kurierem.",
    },
    {
        question: "Czy mogę zwrócić produkt?",
        answer: "Tak! Masz 14 dni na zwrot nierozpakowanego produktu bez podawania przyczyny. W razie pytań — napisz do nas, pomożemy na każdym etapie.",
    },
    {
        question: "Czy suplementy GlowUp są bezpieczne?",
        answer: "Tak. Wszystkie nasze produkty powstają w certyfikowanych zakładach, zgodnie z normami GMP. Składniki dobieramy w dawkach potwierdzonych badaniami klinicznymi, z myślą o bezpieczeństwie i skuteczności.",
    },
    {
        question: "Jak stosować mixy GlowUp?",
        answer: "Każdy produkt ma jasną instrukcję stosowania na opakowaniu. Ogólna zasada to regularność — suplementy działają najlepiej, gdy stosujesz je systematycznie przez minimum 4-6 tygodni.",
    },
]

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)

    return (
        <section className="glowup-faq" id="faq">
            <div className="glowup-section__header">
                <div className="glowup-section__tag">Pytania</div>
                <h2 className="glowup-section__title">Najczęściej zadawane pytania</h2>
                <p className="glowup-section__subtitle">
                    Nie znalazłeś odpowiedzi? Napisz do nas!
                </p>
            </div>

            <div className="glowup-faq__list">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className={`glowup-faq__item ${activeIndex === index ? "active" : ""}`}
                    >
                        <button
                            className="glowup-faq__question"
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >
                            <span>{item.question}</span>
                            <div className="glowup-faq__icon">+</div>
                        </button>
                        <div className="glowup-faq__answer">
                            <div className="glowup-faq__answer-inner">{item.answer}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FAQ
