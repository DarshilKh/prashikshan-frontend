// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-icons": ["lucide-react"],

          // Feature-based chunks
          auth: [
            "./src/pages/auth/Login.jsx",
            "./src/pages/auth/Signup.jsx",
            "./src/pages/auth/ForgotPassword.jsx",
          ],
          student: [
            "./src/pages/student/Dashboard.jsx",
            "./src/pages/student/Projects.jsx",
            "./src/pages/student/MyApplications.jsx",
            "./src/pages/student/Profile.jsx",
            "./src/pages/student/Settings.jsx",
          ],
          faculty: [
            "./src/pages/faculty/Dashboard.jsx",
            "./src/pages/faculty/Students.jsx",
            "./src/pages/faculty/StudentDetails.jsx",
            "./src/pages/faculty/Reports.jsx",
            "./src/pages/faculty/Messages.jsx",
            "./src/pages/faculty/Profile.jsx",
            "./src/pages/faculty/Settings.jsx",
          ],
          industry: [
            "./src/pages/industry/Dashboard.jsx",
            "./src/pages/industry/Openings.jsx",
            "./src/pages/industry/Applications.jsx",
            "./src/pages/industry/ApplicationReview.jsx",
            "./src/pages/industry/Messages.jsx",
            "./src/pages/industry/Profile.jsx",
            "./src/pages/industry/Settings.jsx",
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 500,
  },
});
