// src/pages/Landing.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Building2, 
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Play,
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Initialize dark mode from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class whenever darkMode state changes
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const features = [
    {
      title: "For Students",
      description: "Browse opportunities, track applications, and manage your internship credits in one place.",
      icon: GraduationCap,
      color: "blue",
      benefits: ["Browse 500+ internships", "Track credit progress", "AI-powered recommendations"]
    },
    {
      title: "For Faculty",
      description: "Monitor student progress, approve internships, and generate comprehensive reports.",
      icon: BookOpen,
      color: "green",
      benefits: ["Real-time monitoring", "One-click approvals", "Automated reports"]
    },
    {
      title: "For Industry",
      description: "Post openings, review applications, and find the perfect interns for your organization.",
      icon: Building2,
      color: "purple",
      benefits: ["Smart candidate matching", "Streamlined hiring", "Direct communication"]
    },
  ];

  const stats = [
    { value: "10K+", label: "Students", icon: Users },
    { value: "500+", label: "Companies", icon: Building2 },
    { value: "50+", label: "Colleges", icon: GraduationCap },
    { value: "95%", label: "Placement Rate", icon: TrendingUp },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and complete your profile with skills, education, and preferences.",
      icon: Users,
    },
    {
      step: "02",
      title: "Discover Opportunities",
      description: "Browse internships matched to your skills or post openings for candidates.",
      icon: Globe,
    },
    {
      step: "03",
      title: "Apply & Connect",
      description: "Apply to internships or review applications with our streamlined process.",
      icon: Zap,
    },
    {
      step: "04",
      title: "Track & Succeed",
      description: "Monitor progress, earn credits, and build your career with real experience.",
      icon: Award,
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      college: "IIT Delhi",
      image: "PS",
      content: "Prashikshan made finding the perfect internship so easy. I got placed at a top tech company within weeks!",
      rating: 5,
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Faculty Coordinator",
      college: "NIT Trichy",
      image: "RK",
      content: "Managing 200+ students' internships used to be a nightmare. Now it's just a few clicks. Absolutely brilliant!",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "HR Manager",
      college: "TechNova Solutions",
      image: "AP",
      content: "We've hired 15 exceptional interns through Prashikshan. The quality of candidates is outstanding.",
      rating: 5,
    },
  ];

  const trustedCompanies = [
    "Google", "Microsoft", "Amazon", "Infosys", "TCS", "Wipro", "Adobe", "Flipkart"
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden transition-colors duration-300">
      
      {/* ==================== NAVIGATION ==================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
                Prashikshan
              </span>
            </motion.div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group"
              >
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              
              {/* Dark Mode Toggle - Outlined */}
              <motion.button
                onClick={toggleDarkMode}
                whileHover={{ scale: 1.08, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm group"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </motion.button>

              {/* Desktop Buttons */}
              <div className="hidden md:flex items-center gap-3">
                
                {/* Login Button - Outlined */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200 shadow-sm"
                >
                  Login
                </motion.button>

                {/* Get Started Button - Gradient Fill */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </motion.button>
              </div>

              {/* Mobile Menu Button - Outlined */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2.5 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 shadow-sm"
              >
                {mobileMenuOpen ? (
                  <X size={22} className="text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu size={22} className="text-gray-700 dark:text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{ 
              height: mobileMenuOpen ? 'auto' : 0,
              opacity: mobileMenuOpen ? 1 : 0
            }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-left px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                >
                  Testimonials
                </button>
                
                <hr className="border-gray-200 dark:border-slate-700 my-2" />
                
                {/* Mobile Login Button - Outlined */}
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="mx-4 px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold hover:border-blue-500 dark:hover:border-blue-400 transition-all text-center"
                >
                  Login
                </button>
                
                {/* Mobile Get Started Button */}
                <button
                  onClick={() => {
                    navigate("/signup");
                    setMobileMenuOpen(false);
                  }}
                  className="mx-4 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                <Zap size={16} />
                <span>New: AI-Powered Skill Matching</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Transform Your
                <span className="bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
                  {" "}Internship{" "}
                </span>
                Journey
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Connecting students, faculty, and industry partners for seamless
                internship management. Track credits, manage applications, and
                build your career with India's #1 internship platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all"
                >
                  Start Free Today
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                >
                  <Play size={20} className="text-blue-600" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-blue-500" />
                  <span>100% Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-purple-500" />
                  <span>10K+ Users</span>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold">
                      AS
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Aditya Singh</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Computer Science • IIT Bombay</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Credit Progress</span>
                      <span className="text-sm font-semibold text-blue-600">18/30</span>
                    </div>
                    <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-linear-to-r from-blue-500 to-green-400"
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Applied", value: "12" },
                      { label: "Interviews", value: "5" },
                      { label: "Offers", value: "2" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    <span className="text-sm font-medium">New Match!</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 px-4 py-3 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Building2 size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Google</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Hiring Interns</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="text-center p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl backdrop-blur-sm border border-gray-100 dark:border-slate-700"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-1 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TRUSTED BY SECTION ==================== */}
      <section className="py-12 px-4 border-y border-gray-200 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Trusted by students from top companies and colleges
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {trustedCompanies.map((company, idx) => (
              <motion.div
                key={company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="text-xl md:text-2xl font-bold text-gray-300 dark:text-slate-600 hover:text-gray-400 dark:hover:text-slate-500 transition-colors cursor-default"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-4">
              <Star size={16} />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Built for Everyone in the
              <span className="bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">
                {" "}Internship Ecosystem
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              A comprehensive platform designed for all stakeholders - students, faculty, and industry partners.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-slate-700 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle size={18} className="text-green-500 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate("/signup")}
                  className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                >
                  Learn More <ChevronRight size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS SECTION ==================== */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-slate-800/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
              <Zap size={16} />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              Get started in minutes with our simple 4-step process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connector Line */}
                {idx < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-linear-to-r from-blue-500 to-green-400" />
                )}
                
                <div className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center text-white font-bold text-lg relative z-10">
                    {step.step}
                  </div>
                  <step.icon className="w-8 h-8 mx-auto mb-4 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section id="testimonials" className="py-20 px-4 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-sm font-medium mb-4">
              <Star size={16} />
              <span>Testimonials</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                {/* Content */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {testimonial.college}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-linear-to-r from-blue-600 via-blue-500 to-green-500 rounded-3xl p-12 md:p-16 text-white text-center overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
                Join thousands of students, faculty members, and companies already
                using Prashikshan to transform their internship experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                >
                  Create Free Account
                  <ArrowRight size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/30 transition-all"
                >
                  Sign In
                </motion.button>
              </div>

              <p className="mt-6 text-blue-100 text-sm">
                No credit card required • Free forever plan available
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-2xl font-bold">Prashikshan</span>
              </div>
              <p className="text-gray-400 mb-6">
                India's leading internship management platform connecting students, faculty, and industry.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub', 'Instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors group"
                  >
                    <span className="text-gray-400 group-hover:text-white text-xs font-medium">
                      {social.charAt(0)}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Integrations", "Updates"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Press", "Contact"]
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "Community", "Guides"]
              }
            ].map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-gray-400 hover:text-white transition-colors hover:translate-x-1 inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Prashikshan. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;