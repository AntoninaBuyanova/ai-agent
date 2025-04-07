import React from 'react';
import Header from '../components/pt/Header';
import HeroSection from '../components/pt/HeroSection';
import LogoCloud from '../components/pt/LogoCloud';
import Features from '../components/pt/Features';
import Testimonials from '../components/pt/Testimonials';
import HowItWorks from '../components/pt/HowItWorks';
import CTA from '../components/pt/CTA';
import Footer from '../components/pt/Footer';
import PageTitle from '../components/PageTitle';

export default function PT() {
  return (
    <>
      <PageTitle title="Melhor Resposta - Converse com os Melhores Modelos de IA | Obtenha Respostas Precisas" />
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