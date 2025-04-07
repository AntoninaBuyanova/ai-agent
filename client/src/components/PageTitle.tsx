import React, { useEffect } from 'react';

interface PageTitleProps {
  title: string;
}

/**
 * PageTitle component to dynamically set the document title
 * This is a utility component that doesn't render anything visible
 */
const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  useEffect(() => {
    // Save the original title to restore when component unmounts
    const originalTitle = document.title;
    
    // Set the new title
    document.title = title;
    
    // Restore the original title when the component unmounts
    return () => {
      document.title = originalTitle;
    };
  }, [title]);

  // This component doesn't render anything visible
  return null;
};

export default PageTitle; 