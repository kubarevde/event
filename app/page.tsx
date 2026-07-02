import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Hero from "@/components/sections/Hero";
import WhyImportant from "@/components/sections/WhyImportant";
import Value from "@/components/sections/Value";
import Directions from "@/components/sections/Directions";
import Formats from "@/components/sections/Formats";
import Speakers from "@/components/sections/Speakers";
import Registration from "@/components/sections/Registration";
import Faq from "@/components/sections/Faq";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyImportant />
        <Value />
        <Directions />
        <Formats />
        <Speakers />
        <Registration />
        <Faq />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
