import React from 'react';
import { Shield } from 'lucide-react';
import { AIIcon } from '../icons/Logo';

const HeroSection: React.FC = () => {
  return (
    <section className="pt-6 pb-6 md:pt-20 md:pb-20 overflow-hidden bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mx-auto">
          {/* Powered by banner */}
          <div className="inline-flex items-center gap-3 mb-6 md:mb-8 border border-[#E8E8E5] rounded-[100px] px-4 py-2">
            <span className="text-[#232323] text-[16px] leading-[24px] font-['Aeonik_Pro'] font-medium">Desarrollado por</span>
            <div className="flex items-center justify-center">
              <img 
                src="/icon.png" 
                alt="Logos de modelos IA" 
                className="h-8 w-auto object-contain" 
                width="120" 
                height="32" 
                loading="eager" 
                decoding="async"
              />
            </div>
            <span className="text-[#232323] text-[16px] leading-[24px] font-['Aeonik_Pro'] font-medium">y más</span>
          </div>

          {/* Main heading */}
          <h1 className="text-[2rem] sm:text-[3rem] md:text-[3.5rem] lg:text-[5rem] leading-[1.1] sm:leading-[1.2] md:leading-[1.2] font-orbikular mb-4 md:mb-8 text-[#232323]">
            Consigue la Mejor Respuesta.<br />
            Siempre
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-12 font-aeonik text-gray-600">
            Los mejores modelos de IA del mundo, trabajando juntos para contestar tus preguntas
          </p>
          <div className="flex justify-center md:mb-16">
            <a href="https://mystylus.ai/chat-agents" className="w-[280px] md:w-auto px-6 md:px-[3.75rem] py-3 md:py-[1.125rem] bg-[#232323] text-white rounded-full text-base md:text-[20px] font-aeonik font-medium cursor-pointer inline-flex items-center justify-center hover:bg-[#444444] transition-colors">
              Comienza ya – es gratis
            </a>
          </div>

          {/* University Logos */}
          <div className="hidden md:block max-w-[1240px] mx-auto">
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <img 
                src="/Uni.png" 
                alt="Universidades Asociadas incluyendo Cambridge, MIT, Oxford, Penn, Stanford y Sorbonne" 
                className="w-full h-auto"
                width="1240"
                height="100"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 