import CardsMarquee from "@/components/cards";
import FeaturesCarousel from "@/components/features-carousel";
import HeroSection from "@/components/hero-section";
import NavBar from "@/components/navbar";
import Footer from "@repo/ui/footer"


export default function Home() { 
  return (
    <div className="bg-black">
      <NavBar />
       <HeroSection />
       {/* <FeatureCarousel /> */}
       <FeaturesCarousel />
       <CardsMarquee />
       {/* <BigHeadline /> */}
       {/* <OpenSourceSection /> */}
       <Footer />
     
    </div>
  );
}
