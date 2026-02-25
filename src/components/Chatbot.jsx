// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

const Chatbot = ({ chatbotOpen, setChatbotOpen, isLoggedIn, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize with welcome message based on user role
  useEffect(() => {
    if (isLoggedIn && messages.length === 0) {
      const welcomeMessages = {
        student: "Hi! 👋 I'm your Prashikshan Assistant. I can help you find internships, track your credits, or answer questions about your projects. What would you like to know?",
        faculty: "Hello! 👋 I'm here to help you manage student progress, review internships, or generate reports. How can I assist you today?",
        industry: "Welcome! 👋 I can help you post internships, review applications, or manage your interns. What do you need help with?"
      };
      
      setMessages([
        { 
          text: welcomeMessages[userRole] || welcomeMessages.student, 
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [isLoggedIn, userRole]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Smart response system based on keywords and user role
  const getSmartResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Student-specific responses
    if (userRole === 'student') {
      if (message.includes('internship') || message.includes('project')) {
        return "I found several internships matching your profile! You can check the Projects page for AI/ML, Web Development, and Data Science opportunities. Would you like me to filter by specific skills?";
      }
      if (message.includes('credit') || message.includes('progress')) {
        return "You've completed 18 out of 30 credits (60%). You need 12 more credits to complete your internship requirements. Consider applying to 3-4 credit projects to reach your goal faster!";
      }
      if (message.includes('skill') || message.includes('learn')) {
        return "Based on current industry trends, I recommend focusing on: React, Python, Machine Learning, and Cloud Computing. These skills have the highest demand in available internships.";
      }
      if (message.includes('apply') || message.includes('application')) {
        return "To apply for an internship: 1) Go to Projects page, 2) Find a matching project, 3) Click 'Apply Now', 4) Submit your application. I can help you prepare your application if needed!";
      }
      if (message.includes('profile') || message.includes('resume')) {
        return "A complete profile increases your chances by 3x! Make sure to add your skills, projects, and a brief bio. Would you like tips on improving your profile?";
      }
    }
    
    // Faculty-specific responses
    if (userRole === 'faculty') {
      if (message.includes('student') || message.includes('progress')) {
        return "You have 156 students under your guidance. 8 internships are pending review, and the average completion rate is 73%. Would you like a detailed breakdown?";
      }
      if (message.includes('review') || message.includes('pending')) {
        return "You have 8 pending internship reviews. I recommend prioritizing students with upcoming deadlines. Shall I sort them by urgency?";
      }
      if (message.includes('report') || message.includes('analytics')) {
        return "I can generate reports on: Student Progress, Credit Distribution, Industry Collaboration, or Completion Rates. Which report would you like?";
      }
    }
    
    // Industry-specific responses
    if (userRole === 'industry') {
      if (message.includes('post') || message.includes('internship')) {
        return "To post a new internship: Go to Dashboard → Click 'Post New Internship' → Fill in details → Submit. Internships are reviewed within 24-48 hours.";
      }
      if (message.includes('application') || message.includes('candidate')) {
        return "You have 47 pending applications across 12 active listings. Top candidates have skill match scores above 85%. Would you like to review them?";
      }
      if (message.includes('intern') || message.includes('manage')) {
        return "You currently have 23 approved interns. You can track their progress, provide feedback, or update project milestones from the Dashboard.";
      }
    }
    
    // General responses
    if (message.includes('help') || message.includes('what can you do')) {
      const helpMessages = {
        student: "I can help you with:\n• Finding internships matching your skills\n• Tracking credit progress\n• Application tips\n• Profile optimization\n• Skill recommendations",
        faculty: "I can assist you with:\n• Reviewing student progress\n• Managing internship approvals\n• Generating reports\n• Industry collaboration insights",
        industry: "I can help you with:\n• Posting new internships\n• Reviewing applications\n• Managing interns\n• Tracking project progress"
      };
      return helpMessages[userRole] || helpMessages.student;
    }
    
    if (message.includes('thank')) {
      return "You're welcome! 😊 Feel free to ask if you need anything else.";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return `Hello! 👋 How can I help you today?`;
    }

    // Default responses
    const defaultResponses = [
      "I understand you're asking about that. Let me help you find the right information. Could you be more specific?",
      "That's a great question! For detailed assistance, you might want to check the relevant section in the dashboard or ask me something more specific.",
      "I'm here to help! Try asking about internships, credits, applications, or your profile.",
      "I'd be happy to assist with that. Could you provide more details about what you're looking for?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = getSmartResponse(input);
      setMessages(prev => [
        ...prev,
        { 
          text: response, 
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  // Quick action buttons based on role
  const getQuickActions = () => {
    const actions = {
      student: [
        { label: 'Find Internships', query: 'Help me find internships' },
        { label: 'Check Credits', query: 'What is my credit progress?' },
        { label: 'Skill Tips', query: 'What skills should I learn?' }
      ],
      faculty: [
        { label: 'Pending Reviews', query: 'Show pending reviews' },
        { label: 'Student Progress', query: 'How are my students doing?' },
        { label: 'Generate Report', query: 'Generate a report' }
      ],
      industry: [
        { label: 'Post Internship', query: 'How to post an internship?' },
        { label: 'View Applications', query: 'Show pending applications' },
        { label: 'Manage Interns', query: 'Help me manage interns' }
      ]
    };
    return actions[userRole] || actions.student;
  };

  const handleQuickAction = (query) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!chatbotOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatbotOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-linear-to-r from-blue-600 to-green-400 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-blue-500/25 transition-shadow z-40"
          >
            <MessageCircle size={24} />
            
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] card overflow-hidden z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[rgb(var(--border))] bg-linear-to-r from-blue-600 to-green-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    Smart Assistant
                    <Sparkles size={14} className="text-yellow-300" />
                  </h3>
                  <p className="text-xs text-white/80">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setChatbotOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[rgb(var(--background))]">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600' 
                        : 'bg-linear-to-br from-blue-500 to-green-400'
                    }`}>
                      {msg.sender === 'user' ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} className="text-white" />
                      )}
                    </div>
                    
                    {/* Message bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-green-400 flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-[rgb(var(--surface))] border border-[rgb(var(--border))] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-1">
                      <Loader2 size={16} className="animate-spin text-[rgb(var(--muted))]" />
                      <span className="text-sm text-[rgb(var(--muted))]">Typing...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
                <p className="text-xs text-[rgb(var(--muted))] mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-2">
                  {getQuickActions().map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.query)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[rgb(var(--border))] bg-[rgb(var(--surface))]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !isTyping && handleSend()}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;