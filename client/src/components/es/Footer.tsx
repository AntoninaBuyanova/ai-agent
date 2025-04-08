import React from 'react';
import { LinkedInIcon, TwitterIcon, InstagramIcon, YoutubeIcon, FacebookIcon } from '../icons/Logo';
import LanguageSelector from '../LanguageSelector';

const Footer: React.FC = () => {
  return (
    <footer className="py-20 bg-[#F8F8F3] font-aeonik">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and tagline with language selector */}
        <div className="mb-16 flex justify-between items-center">
          <img 
            src="Banner (2).png" 
            alt="Reimagina la Palabra - Plataforma Inteligente para Escritura e Investigación" 
            className="h-auto max-w-[550px] w-full md:w-auto"
          />
          <div className="hidden md:block">
            <LanguageSelector />
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* Company */}
          <div>
            <h3 className="font-medium mb-4 font-aeonik">Empresa</h3>
            <ul className="space-y-3">
              <li><a href="https://mystylus.ai/terms-conditions/" className="text-[#232323] hover:opacity-70 font-aeonik">Términos de servicio</a></li>
              <li><a href="https://mystylus.ai/privacy-policy/" className="text-[#232323] hover:opacity-70 font-aeonik">Política de cookies y privacidad</a></li>
              <li><a href="https://mystylus.ai/about-us/" className="text-[#232323] hover:opacity-70 font-aeonik">Sobre nosotros</a></li>
              <li><a href="https://mystylus.ai/affiliate-program/" className="text-[#232323] hover:opacity-70 font-aeonik">Programa de Afiliados</a></li>
            </ul>
          </div>

          {/* AI Generators */}
          <div>
            <h3 className="font-medium mb-4 font-aeonik">Generadores de IA</h3>
            <ul className="space-y-3">
              <li><a href="https://mystylus.ai/paragraph-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Párrafos</a></li>
              <li><a href="https://mystylus.ai/ai-paper-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Artículos Científicos</a></li>
              <li><a href="https://mystylus.ai/ai-story-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Historias</a></li>
              <li><a href="https://mystylus.ai/thesis-statement-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Tesis: Pruébalo</a></li>
            </ul>
          </div>

          {/* Writing tools */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-medium mb-4 font-aeonik">Herramientas de escritura</h3>
            <ul className="space-y-3">
              <li><a href="https://mystylus.ai/ai-essay-writer/" className="text-[#232323] hover:opacity-70 font-aeonik">Asistente de Escritura IA</a></li>
              <li><a href="https://mystylus.ai/essay-title-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Títulos para Ensayos</a></li>
              <li><a href="https://mystylus.ai/paraphrase-tool/" className="text-[#232323] hover:opacity-70 font-aeonik">Herramienta de Paráfrasis</a></li>
              <li><a href="https://mystylus.ai/ai-literature-review-generator/" className="text-[#232323] hover:opacity-70 font-aeonik">Generador de Revisión de Literatura</a></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-medium mb-4 font-aeonik">Síguenos</h3>
            <div className="flex gap-4 flex-wrap">
              <a href="https://www.linkedin.com/company/mystylus-ai/" className="text-[#232323] hover:opacity-70"><LinkedInIcon className="w-6 h-6" /></a>
              <a href="https://x.com/stylusai/" className="text-[#232323] hover:opacity-70"><TwitterIcon className="w-6 h-6" /></a>
              <a href="https://www.instagram.com/mystylus.ai/" className="text-[#232323] hover:opacity-70"><InstagramIcon className="w-6 h-6" /></a>
              <a href="https://www.youtube.com/@mystylus" className="text-[#232323] hover:opacity-70"><YoutubeIcon className="w-6 h-6" /></a>
              <a href="https://www.facebook.com/mystylusai/" className="text-[#232323] hover:opacity-70"><FacebookIcon className="w-6 h-6" /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 text-sm text-[#232323] font-aeonik">
          <div className="flex flex-col gap-3">
            <div>© 2024 myStylus Todos los Derechos Reservados</div>
            <div>
              <a href="mailto:info@myStylus.ai" className="hover:opacity-70 font-medium">info@myStylus.ai</a>
              <span className="mx-2">•</span>
              <a href="https://mystylus.ai/privacy-policy/" className="hover:opacity-70 font-medium">Política de privacidad</a>
            </div>
            
            {/* Mobile Language Selector */}
            <div className="mt-4 md:hidden">
              <LanguageSelector />
            </div>
          </div>
          
          <div className="md:col-start-3 md:col-span-2 flex flex-col">
            <span>MyStylus, Inc., 3524 Silverside Road, Suite 35B,</span>
            <span>Wilmington 19810, Delaware, USA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 