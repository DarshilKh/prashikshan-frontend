/**
 * ProfessionalBanner Component
 *
 * Reminder to keep communication professional.
 */

import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { PROFESSIONAL_GUIDELINES } from "../../config/uiConfig";

export function ProfessionalBanner({ dismissible = true }) {
  const [dismissed, setDismissed] = useState(false);

  // Check if user has dismissed before (localStorage)
  React.useEffect(() => {
    const wasDismissed = localStorage.getItem("professional_banner_dismissed");
    if (wasDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("professional_banner_dismissed", "true");
  };

  if (dismissed) return null;

  return (
    <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-blue-800 font-medium">
            {PROFESSIONAL_GUIDELINES.title}
          </p>
          <p className="text-sm text-blue-700 mt-1">
            {PROFESSIONAL_GUIDELINES.banner}
          </p>
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-blue-400 hover:text-blue-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfessionalBanner;
