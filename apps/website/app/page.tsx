import BigHeadline from "@/components/BigHeadline";
import CardsMarquee from "@/components/Cards";
import FeaturesCarousel from "@/components/FeaturesCarousel";
import HeroSection from "@/components/HeroSection";
import NavBar from "@/components/NavBar";
import Footer from "@repo/ui/footer"


export default function Home() {
  return (
    <div className="">
      <NavBar />
       <HeroSection />
       <FeaturesCarousel />
       <CardsMarquee />
       <BigHeadline />
       <Footer />
     
    </div>
  );
}
