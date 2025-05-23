import React, { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/query";
import { QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load pages to reduce initial bundle size
const Home = lazy(() => import("./pages/Home"));
const PT = lazy(() => import("./pages/PT"));
const PTBR = lazy(() => import("./pages/PTBR"));
const ES = lazy(() => import("./pages/ES"));
const ESMX = lazy(() => import("./pages/ESMX"));
const NotFound = lazy(() => import("./pages/not-found"));

// Loading component for lazy-loaded routes
const RouteLoadingIndicator = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// React.memo to prevent unnecessary re-renders
const Router = React.memo(function Router() {
  return (
    <Suspense fallback={<RouteLoadingIndicator />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pt" component={PT} />
        <Route path="/pt-br" component={PTBR} />
        <Route path="/es" component={ES} />
        <Route path="/es-mx" component={ESMX} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
