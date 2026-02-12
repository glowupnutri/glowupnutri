const Bestsellers = () => {
    const products = [
        {
            name: "FOCUS MIX",
            desc: "Kompleks na koncentrację i jasność umysłu. Bacopa + Lion's Mane + L-teanina.",
            price: "149 zł",
            badge: "BESTSELLER",
            emoji: "🧠",
        },
        {
            name: "ENERGY MIX",
            desc: "Naturalna energia bez crashu. Guarana + Rhodiola + Koenzym Q10.",
            price: "139 zł",
            badge: "BESTSELLER",
            emoji: "⚡",
        },
        {
            name: "SLEEP MIX",
            desc: "Głęboki, regenerujący sen. Magnez + Ashwagandha + L-tryptofan.",
            price: "129 zł",
            badge: "NOWOŚĆ",
            emoji: "🌙",
        },
    ]

    return (
        <section className="glowup-section glowup-section--gray" id="bestsellery">
            <div className="glowup-section__header">
                <div className="glowup-section__tag">Najpopularniejsze</div>
                <h2 className="glowup-section__title">BESTSELLERY</h2>
                <p className="glowup-section__subtitle">
                    Trzy formuły, które pokochali nasi klienci. Sprawdzone składniki w optymalnych dawkach.
                </p>
            </div>

            <div className="glowup-products">
                {products.map((product, i) => (
                    <div key={i} className="glowup-product-card">
                        <div className="glowup-product-card__image">
                            <div style={{
                                fontSize: '4rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #fafafa, #f0f0f0)'
                            }}>
                                {product.emoji}
                            </div>
                            <div className="glowup-product-card__badge">{product.badge}</div>
                        </div>
                        <div className="glowup-product-card__info">
                            <div className="glowup-product-card__name">{product.name}</div>
                            <div className="glowup-product-card__desc">{product.desc}</div>
                            <div className="glowup-product-card__footer">
                                <div className="glowup-product-card__price">{product.price}</div>
                                <button className="glowup-product-card__btn">Do koszyka</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Bestsellers
