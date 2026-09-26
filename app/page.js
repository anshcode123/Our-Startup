import Navigation from "@/components/site/Navigation";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import WhyUs from "@/components/site/WhyUs";
import Work from "@/components/site/Work";
import Process from "@/components/site/Process";
import About from "@/components/site/About";
import Technology from "@/components/site/Technology";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import { CinematicStory, FinalCTA } from "@/components/story";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <CinematicStory />
        <Services />
        <WhyUs />
        <Work />
        <Process />
        <About />
        <Technology />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
