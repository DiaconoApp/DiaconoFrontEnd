import Navigation from "../components/landing/Navigation";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Mission from "../components/landing/Mission";
import Features from "../components/landing/Features";
import Audience from "../components/landing/Audience";
import Benefits from "../components/landing/Benefits";
import FAQ from "../components/landing/FAQ";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen font-['Montserrat']">
      <Navigation />
      <Hero />
      <About />
      <Mission />
      <Features />
      <Audience />
      <Benefits />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
