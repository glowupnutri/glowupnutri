"use client"

import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const GlowUpNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  return (
    <>
      <div className={`glowup-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="glowup-nav__inner">
          {/* Logo */}
          <LocalizedClientLink href="/" className="glowup-nav__logo">
            GLOWUP<span>NUTRITION</span>
          </LocalizedClientLink>

          {/* Desktop Menu */}
          <ul className="glowup-nav__menu">
            <li><LocalizedClientLink href="/">Strona główna</LocalizedClientLink></li>
            <li><LocalizedClientLink href="/store">Sklep</LocalizedClientLink></li>
            <li><a href="#o-nas">O nas</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#kontakt">Kontakt</a></li>
          </ul>

          {/* Actions */}
          <div className="glowup-nav__actions">
            {/* Account */}
            <LocalizedClientLink href="/account" className="glowup-nav__action-btn" aria-label="Moje konto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </LocalizedClientLink>

            {/* Cart */}
            <LocalizedClientLink href="/cart" className="glowup-nav__action-btn" aria-label="Koszyk">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </LocalizedClientLink>

            {/* Burger */}
            <button
              className={`glowup-nav__burger ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu mobilne"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`glowup-mobile-menu ${mobileOpen ? "open" : ""}`}>
        <ul className="glowup-mobile-menu__links">
          <li><LocalizedClientLink href="/" onClick={() => setMobileOpen(false)}>Strona główna</LocalizedClientLink></li>
          <li><LocalizedClientLink href="/store" onClick={() => setMobileOpen(false)}>Sklep</LocalizedClientLink></li>
          <li><a href="#o-nas" onClick={() => setMobileOpen(false)}>O nas</a></li>
          <li><a href="#faq" onClick={() => setMobileOpen(false)}>FAQ</a></li>
          <li><a href="#kontakt" onClick={() => setMobileOpen(false)}>Kontakt</a></li>
          <li><LocalizedClientLink href="/account" onClick={() => setMobileOpen(false)}>Moje konto</LocalizedClientLink></li>
          <li><LocalizedClientLink href="/cart" onClick={() => setMobileOpen(false)}>Koszyk</LocalizedClientLink></li>
        </ul>
      </div>
    </>
  )
}

export default GlowUpNav
