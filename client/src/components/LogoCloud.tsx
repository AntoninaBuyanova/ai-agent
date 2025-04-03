import React, { useEffect, useState, useRef } from 'react';
import { ChatIcon, QuotesIcon, DocumentIcon, ColumnsIcon } from './icons/Logo';

const LogoCloud: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  // Optimize for mobile performance
  useEffect(() => {
    // Preload image immediately to reduce render delay
    const img = new Image();
    img.fetchPriority = 'high';
    img.decoding = 'async';
    
    // Set up onload handler before setting src to ensure it catches
    img.onload = () => {
      if (imgRef.current) {
        imgRef.current.src = img.src;
        // Apply fade-in effect
        requestAnimationFrame(() => {
          if (imgRef.current) imgRef.current.style.opacity = '1';
          if (placeholderRef.current) placeholderRef.current.style.opacity = '0';
          setImageLoaded(true);
        });
      }
    };
    
    // Start loading the image
    img.src = '/Bestchat.webp';
    
    // Alternative approach if the image is not loaded after 1s to ensure something shows
    const fallbackTimer = setTimeout(() => {
      if (!imageLoaded && imgRef.current) {
        imgRef.current.src = '/Bestchat.webp';
        imgRef.current.style.opacity = '1';
        if (placeholderRef.current) placeholderRef.current.style.opacity = '0';
      }
    }, 1000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [imageLoaded]);

  return (
    <section className="py-6 md:py-10 lg:pt-10 lg:pb-[3.75rem] bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[2rem] lg:text-[3.25rem] leading-[1.1] lg:leading-[1.2] font-aeonik font-medium mb-8 md:mb-12 text-center text-[#232323]">
          Chat that's actually made for students
        </h2>
        
        <div className="max-w-[1240px] mx-auto mb-12 md:mb-16 relative">
          {/* Simplified placeholder for better performance */}
          <div 
            ref={placeholderRef}
            className="w-full bg-gray-100 rounded-2xl shadow-lg"
            style={{
              aspectRatio: "16/9",
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            {/* Inline SVG loading indicator to improve perceived performance */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>

          {/* Image optimized for LCP on mobile */}
          <img 
            ref={imgRef}
            alt="AI Chat Interface for Students" 
            width="1240"
            height="697"
            className="w-full h-auto rounded-2xl shadow-lg absolute top-0 left-0"
            style={{ 
              opacity: 0,
              transition: "opacity 0.3s ease-in-out" 
            }}
            fetchPriority="high"
            decoding="async"
            loading="eager" 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1240px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-[1240px] mx-auto px-4 py-6 md:py-8 lg:py-12">
          {/* Always the best answer */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <ChatIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Always the best answer</h3>
              <p className="text-[#666666] text-sm">
                We auto-select the best model to give you a smarter, faster answer
              </p>
            </div>
          </div>

          {/* Academic citations */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <QuotesIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Academic citations</h3>
              <p className="text-[#666666] text-sm">
                Every answer come with formatted, trustworthy academic citations
              </p>
            </div>
          </div>

          {/* Academic databases */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <DocumentIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Chat with PDFs</h3>
              <p className="text-[#666666] text-sm">
                Ask across documents, compare arguments, extract key points
              </p>
            </div>
          </div>

          {/* Chat with PDFs */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <ColumnsIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Academic databases</h3>
              <p className="text-[#666666] text-sm">
                Pull facts from real, credible academic sources
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
