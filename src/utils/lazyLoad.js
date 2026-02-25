// src/utils/lazyLoad.js
import React, { lazy, Suspense } from 'react';
import PageLoader, { 
  DashboardLoader, 
  TableLoader, 
  CardsLoader, 
  ProfileLoader,
  AuthLoader 
} from '../components/common/PageLoader';
import LazyErrorBoundary from '../components/common/LazyErrorBoundary';

/**
 * Enhanced lazy loading with retry logic and custom loaders
 */

// Retry logic for failed imports
const retryImport = (importFn, retries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    importFn()
      .then(resolve)
      .catch((error) => {
        if (retries === 0) {
          reject(error);
          return;
        }
        
        setTimeout(() => {
          retryImport(importFn, retries - 1, delay * 1.5)
            .then(resolve)
            .catch(reject);
        }, delay);
      });
  });
};

/**
 * Create a lazy component with error boundary and loading state
 * @param {Function} importFn - Dynamic import function
 * @param {React.Component} LoaderComponent - Loading component to show
 * @param {string} chunkName - Name for debugging
 */
export const lazyLoad = (importFn, LoaderComponent = PageLoader, chunkName = '') => {
  const LazyComponent = lazy(() => 
    retryImport(importFn).then(module => {
      // Log successful load in development
      if (process.env.NODE_ENV === 'development' && chunkName) {
        console.log(`✅ Loaded: ${chunkName}`);
      }
      return module;
    })
  );

  // Return a wrapper component
  return (props) => (
    <LazyErrorBoundary>
      <Suspense fallback={<LoaderComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
};

/**
 * Preload a lazy component (for hover preloading)
 */
export const preloadComponent = (importFn) => {
  importFn();
};

/**
 * Pre-configured lazy loaders for different page types
 */
export const lazyDashboard = (importFn) => lazyLoad(importFn, DashboardLoader);
export const lazyTable = (importFn) => lazyLoad(importFn, TableLoader);
export const lazyCards = (importFn) => lazyLoad(importFn, CardsLoader);
export const lazyProfile = (importFn) => lazyLoad(importFn, ProfileLoader);
export const lazyAuth = (importFn) => lazyLoad(importFn, AuthLoader);
export const lazyPage = (importFn) => lazyLoad(importFn, PageLoader);

export default lazyLoad;