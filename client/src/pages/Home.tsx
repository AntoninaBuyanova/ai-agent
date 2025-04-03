import React, { useEffect, lazy, Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import LogoCloud from '@/components/LogoCloud';

// Lazy load components that aren't needed for initial render
const Features = lazy(() => import('@/components/Features'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const CTA = lazy(() => import('@/components/CTA'));
const Footer = lazy(() => import('@/components/Footer'));

// Simple placeholder for lazy-loaded components
const ComponentPlaceholder = () => (
  <div className="w-full py-12 bg-gray-50 animate-pulse">
    <div className="max-w-[1240px] mx-auto h-64 bg-gray-200 rounded-lg"></div>
  </div>
);

const Home: React.FC = () => {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.hash && target.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetId = target.getAttribute('href') as string;
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.getBoundingClientRect().top + window.scrollY - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Prefetch remaining components when idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        // Preload remaining components
        import('@/components/Features');
        import('@/components/Testimonials');
        import('@/components/HowItWorks');
      });
    }
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Critical above-the-fold components loaded eagerly */}
      <Header />
      <HeroSection />
      <LogoCloud />
      
      {/* Below-the-fold components loaded lazily */}
      <Suspense fallback={<ComponentPlaceholder />}>
        <Features />
      </Suspense>
      
      <Suspense fallback={<ComponentPlaceholder />}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<ComponentPlaceholder />}>
        <HowItWorks />
      </Suspense>
      
      <Suspense fallback={<ComponentPlaceholder />}>
        <CTA />
      </Suspense>
      
      <Suspense fallback={<ComponentPlaceholder />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Home;
