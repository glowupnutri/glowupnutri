import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="glowup-footer" id="kontakt">
      <div className="glowup-footer__inner">
        <div className="glowup-footer__grid">
          {/* Brand */}
          <div className="glowup-footer__brand">
            <h3>GLOWUP<span>NUTRITION</span></h3>
            <p>
              Autorskie mixy suplementów o potwierdzonym działaniu.
              Formuły oparte na badaniach klinicznych.
            </p>
          </div>

          {/* Navigation */}
          <div className="glowup-footer__col">
            <h4>Nawigacja</h4>
            <ul>
              <li><LocalizedClientLink href="/">Strona główna</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/store">Sklep</LocalizedClientLink></li>
              <li><a href="#o-nas">O nas</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="glowup-footer__col">
            <h4>Kontakt</h4>
            <ul>
              <li><a href="mailto:kontakt@glowupnutrition.pl">kontakt@glowupnutrition.pl</a></li>
              <li><a href="tel:+48123456789">+48 123 456 789</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="glowup-footer__col">
            <h4>Prawne</h4>
            <ul>
              <li><LocalizedClientLink href="/privacy-policy">Polityka prywatności</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/terms">Regulamin</LocalizedClientLink></li>
              <li><LocalizedClientLink href="/returns">Zwroty i reklamacje</LocalizedClientLink></li>
            </ul>
          </div>
        </div>

        <div className="glowup-footer__bottom">
          <div className="glowup-footer__copyright">
            © {new Date().getFullYear()} GlowUp Nutrition. Wszelkie prawa zastrzeżone.
          </div>
          <div className="glowup-footer__socials">
            <a href="#" className="glowup-footer__social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="glowup-footer__social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="glowup-footer__social-link" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
