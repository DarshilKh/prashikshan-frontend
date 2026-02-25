// src/components/common/LazyErrorBoundary.jsx
import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, WifiOff, ArrowLeft } from 'lucide-react';

class LazyErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    
    // Log error
    console.error('Lazy Loading Error:', error);
    console.error('Error Info:', errorInfo);
    
    // You could send to error tracking service here
    // errorTrackingService.log(error, errorInfo);
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOffline: false });
    if (this.state.hasError) {
      this.handleRetry();
    }
  };

  handleOffline = () => {
    this.setState({ isOffline: true });
  };

  handleRetry = () => {
    this.setState(prev => ({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: prev.retryCount + 1 
    }));
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.handleGoHome();
    }
  };

  handleGoHome = () => {
    const role = localStorage.getItem('prashikshan_role');
    let path = '/login';
    
    if (role === 'student') path = '/student/dashboard';
    else if (role === 'faculty') path = '/faculty/dashboard';
    else if (role === 'industry') path = '/industry/dashboard';
    
    window.location.href = path;
  };

  render() {
    const { hasError, error, isOffline, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      const isChunkError = error?.message?.includes('Loading chunk') || 
                          error?.message?.includes('Failed to fetch') ||
                          error?.message?.includes('dynamically imported module');
      const isNetworkError = isOffline || isChunkError;

      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[rgb(var(--background))] p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
                isNetworkError 
                  ? 'bg-yellow-100 dark:bg-yellow-500/20' 
                  : 'bg-red-100 dark:bg-red-500/20'
              }`}
            >
              {isNetworkError ? (
                <WifiOff className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </motion.div>

            {/* Error Title */}
            <h2 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">
              {isNetworkError ? 'Connection Issue' : 'Something went wrong'}
            </h2>

            {/* Error Message */}
            <p className="text-[rgb(var(--muted))] mb-6">
              {isNetworkError 
                ? "We're having trouble loading this page. Please check your internet connection and try again."
                : "We encountered an error while loading this page. Please try again."
              }
            </p>

            {/* Retry count indicator */}
            {retryCount > 0 && (
              <p className="text-sm text-[rgb(var(--muted))] mb-4">
                Retry attempts: {retryCount}
              </p>
            )}

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 rounded-xl text-left overflow-hidden"
              >
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">
                  Error Details:
                </p>
                <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
                  {error.message || 'Unknown error'}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={this.handleGoBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-medium hover:bg-[rgb(var(--background))] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </motion.button>

              <motion.button
                onClick={this.handleRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </motion.button>
              
              <motion.button
                onClick={this.handleGoHome}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[rgb(var(--surface))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] font-medium hover:bg-[rgb(var(--background))] transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </motion.button>
            </div>

            {/* Offline Indicator */}
            {isOffline && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-sm font-medium">You're currently offline</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      );
    }

    return children;
  }
}

export default LazyErrorBoundary;