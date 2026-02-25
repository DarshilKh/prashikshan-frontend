// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X, AlertTriangle } from "lucide-react";

// Create Context
const ToastContext = createContext(null);

// Toast Types Configuration
const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-500/10",
    borderColor: "border-green-200 dark:border-green-500/30",
    iconColor: "text-green-500",
    titleColor: "text-green-800 dark:text-green-300",
    textColor: "text-green-700 dark:text-green-400",
    progressColor: "bg-green-500"
  },
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200 dark:border-red-500/30",
    iconColor: "text-red-500",
    titleColor: "text-red-800 dark:text-red-300",
    textColor: "text-red-700 dark:text-red-400",
    progressColor: "bg-red-500"
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-500/10",
    borderColor: "border-blue-200 dark:border-blue-500/30",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800 dark:text-blue-300",
    textColor: "text-blue-700 dark:text-blue-400",
    progressColor: "bg-blue-500"
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-500/10",
    borderColor: "border-yellow-200 dark:border-yellow-500/30",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800 dark:text-yellow-300",
    textColor: "text-yellow-700 dark:text-yellow-400",
    progressColor: "bg-yellow-500"
  }
};

// Individual Toast Component
const Toast = ({ id, type, title, message, onClose, duration }) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`relative w-80 md:w-96 rounded-xl border ${config.bgColor} ${config.borderColor} shadow-lg overflow-hidden`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`shrink-0 ${config.iconColor}`}>
            <Icon size={24} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <p className={`font-semibold ${config.titleColor}`}>
                {title}
              </p>
            )}
            <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={() => onClose(id)}
            className={`shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${config.textColor}`}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
      />
    </motion.div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type, message, title = null, duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    return id;
  }, []);

  const showSuccess = useCallback((message, title = "Success") => {
    return addToast("success", message, title);
  }, [addToast]);

  const showError = useCallback((message, title = "Error") => {
    return addToast("error", message, title);
  }, [addToast]);

  const showInfo = useCallback((message, title = "Info") => {
    return addToast("info", message, title);
  }, [addToast]);

  const showWarning = useCallback((message, title = "Warning") => {
    return addToast("warning", message, title);
  }, [addToast]);

  // Simple show method without title
  const toast = useCallback({
    success: (message) => addToast("success", message, null),
    error: (message) => addToast("error", message, null),
    info: (message) => addToast("info", message, null),
    warning: (message) => addToast("warning", message, null),
  }, [addToast]);

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    toast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Custom Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;