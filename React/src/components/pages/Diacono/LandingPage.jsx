import Navigation from "../../landing/Navigation";
import Hero from "../../landing/Hero";
import About from "../../landing/About";
import Mission from "../../landing/Mission";
import Features from "../../landing/Features";
import Audience from "../../landing/Audience";
import Benefits from "../../landing/Benefits";
import FAQ from "../../landing/FAQ";
import CTA from "../../landing/CTA";
import Footer from "../../landing/Footer";

export const LandingPage = () => {
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