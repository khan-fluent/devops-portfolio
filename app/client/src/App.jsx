import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Dashboard from './sections/Dashboard';
import Terminal from './sections/Terminal';
import Architecture from './sections/Architecture';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Architecture />
        <Dashboard />
        <Terminal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
