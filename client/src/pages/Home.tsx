import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import LogoCloud from '../components/LogoCloud';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';

export default function Home() {
  return (
    <>
      <PageTitle title="Best Answer - Chat with Top AI Models | Get Accurate Responses" />
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
