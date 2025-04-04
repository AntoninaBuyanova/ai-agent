import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: {
      middlewareMode: true,
      hmr: { server },
    },
    appType: "custom",
  });

  app.use(vite.middlewares);
  
  // Special case for robots.txt and sitemap.xml in development
  app.get(['/robots.txt', '/sitemap.xml'], (req, res, next) => {
    const filePath = path.resolve(__dirname, '..', 'client', 'public', req.path);
    if (fs.existsSync(filePath)) {
      const contentType = req.path.endsWith('.xml') ? 'application/xml' : 'text/plain';
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Robots-Tag', 'index, follow');
      fs.createReadStream(filePath).pipe(res);
    } else {
      next();
    }
  });
  
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ 
        "Content-Type": "text/html",
        "X-Robots-Tag": "index, follow"
      }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    console.warn(`Warning: Build directory ${distPath} not found. Attempting to use fallback path.`);
    // Try a fallback path that might work in deployment
    const fallbackPath = path.resolve(process.cwd(), "dist", "public");
    
    if (fs.existsSync(fallbackPath)) {
      console.log(`Using fallback static path: ${fallbackPath}`);
      
      // Special handling for robots.txt and sitemap.xml
      app.get(['/robots.txt', '/sitemap.xml'], (req, res, next) => {
        const filePath = path.resolve(fallbackPath, req.path);
        if (fs.existsSync(filePath)) {
          const contentType = req.path.endsWith('.xml') ? 'application/xml' : 'text/plain';
          res.setHeader('Content-Type', contentType);
          res.setHeader('X-Robots-Tag', 'index, follow');
          fs.createReadStream(filePath).pipe(res);
        } else {
          next();
        }
      });
      
      app.use(express.static(fallbackPath, {
        setHeaders: (res, path) => {
          // Add SEO-friendly headers for all HTML responses
          if (path.endsWith('.html')) {
            res.setHeader('X-Robots-Tag', 'index, follow');
          }
        }
      }));
      
      // Serve index.html for any route not found
      app.use("*", (_req, res) => {
        res.setHeader('X-Robots-Tag', 'index, follow');
        res.sendFile(path.resolve(fallbackPath, "index.html"));
      });
      return;
    }
    
    throw new Error(
      `Could not find the build directory. Make sure to build the client first.`
    );
  }

  console.log(`Serving static files from: ${distPath}`);
  
  // Special handling for robots.txt and sitemap.xml
  app.get(['/robots.txt', '/sitemap.xml'], (req, res, next) => {
    const filePath = path.resolve(distPath, req.path);
    if (fs.existsSync(filePath)) {
      const contentType = req.path.endsWith('.xml') ? 'application/xml' : 'text/plain';
      res.setHeader('Content-Type', contentType);
      res.setHeader('X-Robots-Tag', 'index, follow');
      fs.createReadStream(filePath).pipe(res);
    } else {
      next();
    }
  });
  
  app.use(express.static(distPath, {
    setHeaders: (res, path) => {
      // Add SEO-friendly headers for all HTML responses
      if (path.endsWith('.html')) {
        res.setHeader('X-Robots-Tag', 'index, follow');
      }
    }
  }));

  // Serve index.html for any route not found
  app.use("*", (_req, res) => {
    res.setHeader('X-Robots-Tag', 'index, follow');
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
