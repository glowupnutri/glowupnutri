const Hero = () => {
  return (
    <section className="glowup-hero">
      <div className="glowup-hero__content">
        <div className="glowup-hero__badge">🔬 Oparte na badaniach klinicznych</div>
        <h1 className="glowup-hero__title">
          Suplementy, które <em>naprawdę działają.</em>
        </h1>
        <p className="glowup-hero__subtitle">
          Autorskie mixy o potwierdzonym działaniu. Konkretne dawki, synergiczne formuły, realne efekty — bez kompromisów.
        </p>
        <a href="#bestsellery" className="glowup-hero__cta">
          Sprawdź nasze mixy
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </section>
  )
}

export default Hero
