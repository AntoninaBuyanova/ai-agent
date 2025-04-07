import React from 'react';
import Header from '../components/es/Header';
import HeroSection from '../components/es/HeroSection';
import LogoCloud from '../components/es/LogoCloud';
import Features from '../components/es/Features';
import Testimonials from '../components/es/Testimonials';
import HowItWorks from '../components/es/HowItWorks';
import CTA from '../components/es/CTA';
import Footer from '../components/es/Footer';
import PageTitle from '../components/PageTitle';

export default function ES() {
  return (
    <>
      <PageTitle title="Mejor Respuesta - Chatea con los Mejores Modelos de IA | Obtén Respuestas Precisas" />
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