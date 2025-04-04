import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { applyTheme } from './theme';

// Apply theme immediately
applyTheme();

// Verify that we're using the correct builds in production
if (process.env.NODE_ENV === 'production') {
  // More comprehensive check for development React builds
  const devBuildChecks = [
    // React core check
    () => {
      try {
        // @ts-ignore This check is for debugging only
        return React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?.ReactCurrentOwner?.current !== undefined;
      } catch (e) {
        return false;
      }
    },
    // React DOM check - development builds have additional warnings
    () => {
      try {
        // @ts-ignore This check is for debugging only
        return typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';
      } catch (e) {
        return false;
      }
    },
    // Check for development strings in React bundle
    () => {
      try {
        // Converting a component to string in dev mode includes more verbose output
        const TestComponent = () => null;
        return TestComponent.toString().includes('createElement') || TestComponent.toString().length > 100;
      } catch (e) {
        return false;
      }
    }
  ];
  
  // Run all checks
  const hasDevelopmentBuild = devBuildChecks.some(check => check());
  
  if (hasDevelopmentBuild) {
    console.warn('Development React build detected in production mode! This will negatively impact performance.');
    // Log which files to check
    console.warn('Please check your build configuration and ensure:');
    console.warn('1. The build:clean-dev script ran successfully');
    console.warn('2. Vite aliases in vite.config.ts are properly configured');
    console.warn('3. All React imports use the .js extension, not .tsx or .jsx');
  }
}

// Lazy-load App component
const App = lazy(() => import('./App'));

// Create a simple loading indicator for async components
const LoadingIndicator = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Preload LCP image with reduced execution cost
const preloadLCP = () => {
  const img = new Image();
  img.src = '/Bestchat.webp';
  img.fetchPriority = 'high';
  img.decoding = 'async';
  
  img.onload = () => {
    // Once image is loaded, fade out the placeholder
    const placeholder = document.querySelector('.lcp-placeholder');
    if (placeholder) {
      placeholder.classList.add('opacity-0');
      placeholder.classList.add('transition-opacity');
      placeholder.classList.add('duration-300');
    }
  };
};

// Start loading the LCP image immediately
preloadLCP();

// Render the application with optimized performance
const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  // Clean up placeholder when rendering React app
  const placeholder = document.querySelector('.lcp-placeholder');
  if (placeholder?.parentNode) {
    placeholder.parentNode.removeChild(placeholder);
  }
  
  if (rootElement) {
    // Use React 18's createRoot API
    const root = createRoot(rootElement);
    
    // Remove StrictMode in production to avoid double-rendering
    if (process.env.NODE_ENV === 'production') {
      root.render(
        <Suspense fallback={<LoadingIndicator />}>
          <App />
        </Suspense>
      );
    } else {
      root.render(
        <React.StrictMode>
          <Suspense fallback={<LoadingIndicator />}>
            <App />
          </Suspense>
        </React.StrictMode>
      );
    }
  }
};

// Use optimized rendering strategy based on document state
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(renderApp);
  });
} else {
  requestAnimationFrame(renderApp);
}

// Use requestIdleCallback to perform non-critical operations
window.addEventListener('load', () => {
  const idleCallback = window.requestIdleCallback || window.setTimeout;
  
  idleCallback(() => {
    // Preload remaining non-critical components
    import('./pages/Home');
    
    // Add analytics or other non-critical scripts here
    // This will help reduce initial JavaScript payload
  });
});
