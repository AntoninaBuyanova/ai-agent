import React from 'react';
import Header from '../components/es-mx/Header';
import HeroSection from '../components/es-mx/HeroSection';
import LogoCloud from '../components/es-mx/LogoCloud';
import Features from '../components/es-mx/Features';
import Testimonials from '../components/es-mx/Testimonials';
import HowItWorks from '../components/es-mx/HowItWorks';
import CTA from '../components/es-mx/CTA';
import Footer from '../components/es-mx/Footer';
import PageTitle from '../components/PageTitle';

export default function ESMX() {
  return (
    <>
      <PageTitle title="Mejor Respuesta - Chatea con los Mejores Modelos de IA | Consigue Respuestas Precisas" />
      <Header />
      <HeroSection />
      <LogoCloud />
      <Features />
      <Testimonials />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
} 