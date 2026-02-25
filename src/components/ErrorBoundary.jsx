// src/components/ErrorBoundary.jsx
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error Boundary caught an error:", error, errorInfo);
    }
    
    // You can also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoToDashboard = () => {
    const role = localStorage.getItem("prashikshan_role");
    let path = "/";
    
    switch (role) {
      case "student":
        path = "/student/dashboard";
        break;
      case "faculty":
        path = "/faculty/dashboard";
        break;
      case "industry":
        path = "/industry/dashboard";
        break;
      default:
        path = "/";
    }
    
    window.location.href = path;
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onReload={this.handleReload}
        onGoToDashboard={this.handleGoToDashboard}
      />;
    }

    return this.props.children;
  }
}

// Fallback UI Component
const ErrorFallback = ({ error, errorInfo, onReload, onGoToDashboard }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Something Went Wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We're sorry, but something unexpected happened. Please try again or return to the dashboard.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <motion.button
            onClick={onReload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:border-blue-500 dark:hover:border-blue-400 transition-all shadow-sm"
          >
            <RefreshCw size={20} />
            Reload Page
          </motion.button>

          <motion.button
            onClick={onGoToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <Home size={20} />
            Go to Dashboard
          </motion.button>
        </motion.div>

        {/* Development Error Details */}
        {isDevelopment && error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bug size={18} className="text-orange-500" />
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                Development Mode - Error Details
              </span>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 overflow-auto max-h-60">
              <p className="text-red-400 font-mono text-sm mb-2">
                {error.toString()}
              </p>
              {errorInfo && (
                <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </motion.div>
        )}

        {/* Support Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-gray-500 dark:text-gray-500"
        >
          If this problem persists,{" "}
          <a 
            href="mailto:support@prashikshan.com"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            contact support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ErrorBoundary;