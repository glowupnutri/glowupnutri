import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import Bestsellers from "@modules/home/components/bestsellers"
import ComingSoon from "@modules/home/components/coming-soon"
import AboutMixes from "@modules/home/components/about-mixes"
import FAQ from "@modules/home/components/faq"

export const metadata: Metadata = {
  title: "GlowUp Nutrition — Mixy, które naprawdę działają",
  description:
    "Autorskie mixy suplementów o potwierdzonym działaniu. Formuły oparte na badaniach klinicznych. Konkretne dawki, realne efekty.",
}

export default function Home() {
  return (
    <>
      <Hero />
      <Bestsellers />
      <ComingSoon />
      <AboutMixes />
      <FAQ />
    </>
  )
}
