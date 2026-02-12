const AboutMixes = () => {
    return (
        <section className="glowup-about" id="o-nas">
            <div className="glowup-about__grid">
                {/* Image */}
                <div className="glowup-about__image">
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #fff5f5 0%, #fafafa 50%, #f5f5f5 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        padding: '40px',
                    }}>
                        <div style={{ fontSize: '5rem' }}>🧬</div>
                        <div style={{
                            textAlign: 'center',
                            color: '#999',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                        }}>
                            GlowUp Nutrition
                            <br />
                            Badania · Formuły · Efekty
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div className="glowup-about__text">
                    <h2>
                        TWORZYMY MIXY, KTÓRE <em>NAPRAWDĘ DZIAŁAJĄ.</em>
                    </h2>

                    <p>
                        Masz dość łykania tabletek, po których nie czujesz różnicy?
                    </p>

                    <p><strong>My też.</strong></p>

                    <p>
                        Dlatego skończyliśmy z domysłami. Nasze formuły powstają w oparciu
                        otwarte dane i badania kliniczne.
                    </p>

                    <p>
                        Łączymy składniki tak, by wzajemnie &ldquo;podkręcały&rdquo; swoją moc
                        i uderzały w problem ze zdwojoną siłą.
                    </p>

                    <div className="glowup-about__highlight">
                        Konkretne dawki, udowodnione działanie, realne efekty. Po prostu.
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutMixes
