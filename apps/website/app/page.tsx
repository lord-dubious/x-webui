import BigHeadline from "@/components/big-headline";
import CardsMarquee from "@/components/cards";
import FeaturesCarousel from "@/components/features-carousel";
import HeroSection from "@/components/hero-section";
import NavBar from "@/components/navbar";
import Footer from "@repo/ui/footer"


export default function Home() { 
  return (
    <div className="">
      <NavBar />
       <HeroSection />
       <FeaturesCarousel />
       <CardsMarquee />
       {/* <OpenSourceSection /> */}
       <BigHeadline />
       <Footer />
     
    </div>
  );
}
