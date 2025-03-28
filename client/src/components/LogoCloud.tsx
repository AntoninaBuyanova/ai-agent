import React from 'react';
import { DetailedFeedbackIcon, AIDetectionIcon, PlagiarismFixIcon, InTextCitationsIcon, OneClickFixesIcon } from './icons/Logo';

const LogoCloud: React.FC = () => {
  return (
    <section className="py-6 md:py-10 bg-[#FFFFFF]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-[2rem] lg:text-[3.25rem] leading-[1.1] lg:leading-[1.2] font-aeonik font-medium mb-8 md:mb-12 text-center text-[#232323]">
          Chat that's actually made for students
        </h2>
        
        <div className="max-w-[1240px] mx-auto mb-12 md:mb-16">
          <img 
            src="/B.png" 
            alt="AI Chat Interface for Students" 
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-[1240px] mx-auto">
          {/* Always the best answer */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <DetailedFeedbackIcon className="w-6 h-6 md:w-8 md:h-8" />
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
              <AIDetectionIcon className="w-6 h-6 md:w-8 md:h-8" />
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
              <PlagiarismFixIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Academic databases</h3>
              <p className="text-[#666666] text-sm">
                Pull facts from real, credible academic sources
              </p>
            </div>
          </div>

          {/* Chat with PDFs */}
          <div className="flex flex-row items-start md:flex-col md:items-center md:text-center gap-3 md:gap-4">
            <div className="mb-0 md:mb-4">
              <InTextCitationsIcon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h3 className="text-[15px] md:text-base lg:text-base font-medium mb-1 md:mb-2">Chat with PDFs</h3>
              <p className="text-[#666666] text-sm">
                Ask across documents, compare arguments, extract key points
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoCloud;
