import BigHeadline from "@/components/big-headline";
import CardsMarquee from "@/components/cards";
import FeaturesCarousel from "@/components/features-carousel";
import HeroSection from "@/components/hero-section";
import NavBar from "@/components/navbar";
import OpenSourceSection from "@/components/open-source";
import Footer from "@repo/ui/footer"


export default function Home() { 
  return (
    <div className="bg-black">
      <NavBar />
       <HeroSection />
       <FeaturesCarousel />
       <CardsMarquee />
       <BigHeadline />
       <OpenSourceSection />
       <Footer />
     
    </div>
  );
}
