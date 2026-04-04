import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PrecisionServicesGrid } from "@/components/services/PrecisionServicesGrid";
import { SanctuaryFeature } from "@/components/services/SanctuaryFeature";
import { SpecialtiesHero } from "@/components/services/SpecialtiesHero";

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        <SpecialtiesHero />
        <PrecisionServicesGrid />
        <SanctuaryFeature />
      </main>
      <Footer />
    </>
  );
}
