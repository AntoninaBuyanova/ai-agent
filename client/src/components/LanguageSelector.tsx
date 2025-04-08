import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';

// Define the language options
const languageOptions = [
  {
    code: 'en',
    name: 'English',
    flag: '/icons/us-flag.svg',
    path: '/'
  },
  {
    code: 'pt',
    name: 'Português (Portugal)',
    flag: '/icons/pt-flag.svg',
    path: '/pt'
  },
  {
    code: 'pt-br',
    name: 'Português (Brasil)',
    flag: '/icons/br-flag.svg',
    path: '/pt-br'
  },
  {
    code: 'es',
    name: 'Español (España)',
    flag: '/icons/es-flag.svg',
    path: '/es'
  },
  {
    code: 'es-mx',
    name: 'Español (México)',
    flag: '/icons/mx-flag.svg',
    path: '/es-mx'
  }
];

const LanguageSelector: React.FC = () => {
  const [, setLocation] = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Determine current language based on the URL path
  const { pathname } = window.location;
  const currentLangCode = pathname === '/' ? 'en' : 
                         pathname === '/pt' ? 'pt' : 
                         pathname === '/pt-br' ? 'pt-br' : 
                         pathname === '/es' ? 'es' : 
                         pathname === '/es-mx' ? 'es-mx' : 'en';
  
  const currentLang = languageOptions.find(lang => lang.code === currentLangCode) || languageOptions[0];
  const [selectedLanguage, setSelectedLanguage] = useState(currentLangCode);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLanguageSelect = (code: string) => {
    const selectedLang = languageOptions.find(lang => lang.code === code);
    if (selectedLang) {
      setSelectedLanguage(code);
      setIsDropdownOpen(false);
      setLocation(selectedLang.path);
    }
  };
  
  return (
    <div className="relative mt-1 self-start sm:self-start w-full sm:w-auto flex justify-start sm:justify-end" ref={dropdownRef}>
      <div 
        className="w-[90px] bg-white py-2 px-2 flex items-center justify-between cursor-pointer"
        style={{ borderRadius: '8px' }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="flex items-center">
          <img 
            src={currentLang.flag || '/icons/us-flag.svg'} 
            alt={currentLang.name}
            className="w-6 h-6 rounded-full mr-2" 
          />
          <span className="font-medium">
            {currentLang.code.toUpperCase()}
          </span>
        </div>
        <svg 
          className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-[200px] bg-[#1E1E1E] shadow-lg right-0 sm:right-0" style={{ borderRadius: '8px' }}>
          <ul className="py-2">
            {languageOptions.map((lang) => (
              <li 
                key={lang.code}
                className={`px-4 py-2 flex items-center cursor-pointer hover:bg-[#2A2A2A] text-white ${selectedLanguage === lang.code ? 'bg-[#2A2A2A]' : ''}`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <img 
                  src={lang.flag} 
                  alt={lang.name}
                  className="w-6 h-6 rounded-full mr-3" 
                />
                <span>
                  {lang.name}
                </span>
                {selectedLanguage === lang.code && (
                  <svg className="w-4 h-4 ml-auto text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 