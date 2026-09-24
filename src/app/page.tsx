import { About } from "@/components/About";
import { Airport } from "@/components/Airport";
import { Contact } from "@/components/Contact";
import { CostCalculator } from "@/components/CostCalculator";
import { FAQ } from "@/components/FAQ";
import { Fleet } from "@/components/Fleet";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Rates } from "@/components/Rates";
import { StickyBar } from "@/components/StickyBar";
import { TrustBar } from "@/components/TrustBar";
import { WhyUs } from "@/components/WhyUs";
import { CARS } from "@/data/cars";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero cars={CARS} />
        <TrustBar />
        <Fleet />
        <WhyUs />
        <Rates />
        <Airport />
        <CostCalculator />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}

