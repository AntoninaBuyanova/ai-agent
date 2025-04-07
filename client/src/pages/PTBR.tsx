import React from 'react';
import Header from '../components/pt-br/Header';
import HeroSection from '../components/pt-br/HeroSection';
import LogoCloud from '../components/pt-br/LogoCloud';
import Features from '../components/pt-br/Features';
import Testimonials from '../components/pt-br/Testimonials';
import HowItWorks from '../components/pt-br/HowItWorks';
import CTA from '../components/pt-br/CTA';
import Footer from '../components/pt-br/Footer';
import PageTitle from '../components/PageTitle';

export default function PTBR() {
  return (
    <>
      <PageTitle title="Melhor Resposta - Converse com os Melhores Modelos de IA | Receba Respostas Precisas" />
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