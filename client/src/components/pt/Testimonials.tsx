import React from 'react';

const AgentBuilder: React.FC = () => {
  return (
    <section className="py-6 md:py-10 lg:py-[3.75rem] bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12">
          {/* Left side - Text content */}
          <div className="md:w-1/2">
            <h2 className="text-[32px] lg:text-[52px] font-medium leading-[1.2] mb-6 text-[#232323]">
              Quer um tutor de matemática?
              <br />
              Ou um verificador de factos?
              <br />
              Construa-o.
            </h2>
            <p className="text-[16px] md:text-[20px] font-['Aeonik_Pro'] font-normal text-[#3C3C3C] leading-[24px] md:leading-[28px] md:mb-8">
              Crie os seus próprios agentes de IA com tom, capacidades
              e instruções detalhadas adaptadas às suas necessidades
            </p>
            <a href="https://mystylus.ai/chat-agents" className="hidden md:inline-flex items-center justify-center bg-[#232323] text-white px-[60px] py-[18px] rounded-full text-[20px] font-['Aeonik_Pro'] font-medium hover:bg-[#333333] transition-colors cursor-pointer">
              Experimentar
            </a>
          </div>

          {/* Right side - Form UI */}
          <div className="md:w-1/2 relative">
            <div className="absolute inset-0 -z-10">
              <img 
                src="want.png" 
                alt="Padrão de fundo" 
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl">
              <img 
                src="want2.png" 
                alt="Interface do construtor de agentes" 
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Mobile Try It button */}
          <div className="block md:hidden w-full">
            <a href="https://mystylus.ai/chat-agents" className="w-full inline-flex items-center justify-center bg-[#232323] text-white px-[60px] py-[18px] rounded-full text-[16px] font-['Aeonik_Pro'] font-medium hover:bg-[#333333] transition-colors cursor-pointer">
              Experimentar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgentBuilder; 