import Nav from '@/components/Layout/Nav';
import Footer from '@/components/Layout/Footer';
import Hero from '@/components/Hero';
import MenuGrid from '@/components/MenuGrid';
import BuildBox from '@/components/BuildBox';
import SauceArcadeSection from '@/components/sauce-arcade/SauceArcadeSection';
import Locations from '@/components/Locations';
import { useTransition } from '@/contexts/TransitionContext';

const Home = () => {
  const { transitionRef } = useTransition();

  return (
    <>
      <Nav transitionRef={transitionRef} />
      <main>
        <Hero />
        <MenuGrid transitionRef={transitionRef} />
        <BuildBox />
        <SauceArcadeSection />
        <Locations />
      </main>
      <Footer />
    </>
  );
};

export default Home;
