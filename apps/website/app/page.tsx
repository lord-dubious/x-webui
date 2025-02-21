import CardsMarquee from "@/components/Cards";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import Footer from "@/components/footer";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";


export default function Home() {
  return (
    <div className="">
      <NavBar />
       <HeroSection />
       <FeaturesCarousel />
       <CardsMarquee />
       <Footer />
     
    </div>
  );
}
