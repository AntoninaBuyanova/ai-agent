import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Identify which modules should be externalized (not included in the bundle)
const EXTERNALIZED_MODULES: string[] = [
  // Add any large modules that should be loaded from CDN
];

// Define chunk strategy more precisely
const MANUAL_CHUNKS: Record<string, string[]> = {
  // React core libraries
  'react-core': ['react', 'react/jsx-runtime'],
  'react-dom': ['react-dom', 'react-dom/client'],
  'react-router': ['wouter'],
  
  // UI-related libraries
  'ui-core': [
    '@/components/ui/button', 
    '@/components/ui/card',
    '@/components/ui/dialog',
    '@/components/ui/form',
    '@/components/ui/input',
    '@radix-ui/react-dialog',
    '@radix-ui/react-label',
    '@radix-ui/react-slot',
    'class-variance-authority', 
    'clsx',
    'tailwind-merge',
  ],
  
  // Data handling
  'data-layer': [
    '@tanstack/react-query',
    'zod',
    '@hookform/resolvers',
  ],
  
  // Form handling
  'form-utils': [
    'react-hook-form',
  ],
};

// Create a function to dynamically load the cartographer plugin
const loadCartographer = async () => {
  const cartographer = await import("@replit/vite-plugin-cartographer");
  return cartographer.cartographer();
};

// List of development chunks to always exclude in production
const DEV_CHUNKS_PATTERN = [
  // Development React builds
  'react-dom.development.js',
  'scheduler.development.js',
  'react.development.js',
  'react-jsx-dev-runtime',
  'cjs/react-dom.development.js',
  'cjs/scheduler.development.js',
  // DevTools
  'react-devtools',
  'react-refresh',
  '__tests__',
  'test-utils',
];

export default defineConfig((config: ConfigEnv): UserConfig => {
  // Load env variables based on mode
  const { mode } = config;
  const env = loadEnv(mode, process.cwd(), '');
  const isProd = mode === 'production' || env.NODE_ENV === 'production';
  
  // Define plugins array
  const plugins = [
    react({
      // Use automatic runtime for JSX in production for smaller bundles
      jsxRuntime: isProd ? 'automatic' : 'classic',
      
      // Force React to be built in production mode
      jsxImportSource: isProd ? 'react' : undefined,
      
      // Remove development features in production
      babel: {
        plugins: isProd 
          ? [
              // Remove PropTypes in production
              'transform-react-remove-prop-types',
            ] 
          : []
      }
    }),
    
    // Only include error overlay in development
    !isProd ? runtimeErrorOverlay() : null,
    
    themePlugin(),
  ].filter(Boolean);
  
  // Add development-only plugins
  if (!isProd && env.REPL_ID !== undefined) {
    // We'll add this plugin after module initialization
    // @ts-ignore Ignoring promise return value
    plugins.push({ 
      name: 'async-cartographer',
      // Use configResolved hook to add the plugin
      configResolved: async () => await loadCartographer()
    });
  }
  
  return {
    // Force define process.env.NODE_ENV for all React packages
    define: {
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
      // Ensure React internal checks are disabled in production
      __DEV__: isProd ? 'false' : 'true',
    },
    
    plugins,
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
        
        // Force React packages to use their production versions
        ...(isProd ? {
          'react-dom$': 'react-dom/cjs/react-dom.production.min.js',
          'react-dom/client$': 'react-dom/cjs/react-dom-client.production.min.js',
          'react$': 'react/cjs/react.production.min.js',
          'react/jsx-runtime$': 'react/cjs/react-jsx-runtime.production.min.js',
          'scheduler$': 'scheduler/cjs/scheduler.production.min.js',
        } : {}),
      },
      
      // Disable mainFields to ensure we get the production files
      mainFields: isProd ? ['module', 'main'] : ['browser', 'module', 'main'],
    },
    
    root: path.resolve(__dirname, "client"),
    
    // Define different behavior for dev vs prod
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      
      // Optimize production build
      minify: isProd ? 'terser' : false,
      terserOptions: isProd ? {
        compress: {
          drop_console: false, // Don't drop console for stability
          drop_debugger: true,
          // Remove pure_funcs to avoid issues
          passes: 2, // Additional optimization pass
          ecma: 2020,
          global_defs: {
            // Force tree-shaking of development-only code
            __DEV__: false,
            __PROFILE__: false,
            __EXPERIMENTAL__: false,
            __USE_PROFILE__: false,
          },
        },
        mangle: {
          properties: false,
        },
        format: {
          comments: false,
          ecma: 2020,
        }
      } : undefined,
      
      rollupOptions: {
        output: {
          // Use more fine-grained chunk splitting
          manualChunks: (id: string) => {
            // Check if this is a development bundle or test file we want to exclude
            if (isProd && DEV_CHUNKS_PATTERN.some(pattern => id.includes(pattern))) {
              return null; // Skip including development versions in production
            }
            
            // Check if this module should be in a specific chunk
            for (const [chunkName, modules] of Object.entries(MANUAL_CHUNKS)) {
              if (modules.some(m => id.includes(m))) {
                return chunkName;
              }
            }
            
            // Put node_modules in vendor chunk if not specified above
            if (id.includes('node_modules')) {
              // Further split large vendor modules by first level path
              const match = id.match(/node_modules\/(?:@[^/]+\/)?[^/]+/);
              if (match) {
                return `vendor-${match[0].replace(/\//g, '-').replace('@', '')}`;
              }
              return 'vendor';
            }
            
            // Let pages be in separate chunks for code splitting
            if (id.includes('/pages/') && !id.includes('index')) {
              const pageName = id.split('/pages/')[1].split('/')[0];
              return `page-${pageName}`;
            }
            
            return null;
          },
          
          // Optimize chunk naming for better debugging and caching
          chunkFileNames: isProd 
            ? 'assets/[name].[hash].js' 
            : 'assets/[name].js',
          entryFileNames: isProd 
            ? 'assets/[name].[hash].js' 
            : 'assets/[name].js',
          assetFileNames: isProd 
            ? 'assets/[name].[hash].[ext]' 
            : 'assets/[name].[ext]',
        },
        
        // Externalize certain dependencies to load from CDN if needed
        external: isProd ? EXTERNALIZED_MODULES : [],
      },
      
      // Additional optimizations
      target: 'es2020', // Modern target for smaller output
      sourcemap: isProd ? false : 'inline',
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // 4kb - inline smaller assets
      chunkSizeWarningLimit: 1000, // KB
    },
    
    // Optimize dependencies
    optimizeDeps: {
      // Pre-bundle these dependencies
      include: [
        'react', 
        'react-dom', 
        'react-hook-form',
        'tailwind-merge',
        'clsx'
      ],
      // Don't process these dependencies
      exclude: EXTERNALIZED_MODULES,
      
      // Force development mode dependencies to be processed correctly
      esbuildOptions: {
        define: {
          'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
          '__DEV__': isProd ? 'false' : 'true',
        },
        treeShaking: true,
        legalComments: 'none',
        target: 'es2020',
        minify: isProd,
      },
    },
    
    // Use esbuild for faster builds
    esbuild: {
      legalComments: 'none',
      keepNames: false,
      treeShaking: true,
      target: 'es2020',
      // Skip drop option to avoid potential issues
      define: {
        // Replace process.env.NODE_ENV with actual value
        'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
        '__DEV__': isProd ? 'false' : 'true',
      },
    },
    
    // Optimize CSS
    css: {
      devSourcemap: !isProd,
      preprocessorOptions: {
        // Any preprocessor options here
      },
      // Let Vite handle the CSS minification
    },
  };
});
