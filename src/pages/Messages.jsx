import React, { useState } from "react";
import { motion } from "framer-motion";
import { facultyData } from "../data/mockData";

const MessagesPage = ({ userRole }) => {
  const [selectedStudent, setSelectedStudent] = useState(
    facultyData.students[0]
  );

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "student",
      text: "Hello Professor, I have a question about my internship credits.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "faculty",
      text: "Hi Aarav, sure! What would you like to know?",
      time: "10:32 AM",
    },
    {
      id: 3,
      sender: "student",
      text: "I completed my AI project internship. How do I submit it for review?",
      time: "10:35 AM",
    },
    {
      id: 4,
      sender: "faculty",
      text: "You can submit it through the dashboard. I will review it within 2 days.",
      time: "10:37 AM",
    },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "faculty",
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setNewMessage("");
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold">Messages</h2>
        <p className="opacity-70">
          Chat with {userRole === "faculty" ? "students" : "applicants"}
        </p>
      </div>

      {/* Chat Container */}
      <div
        className="h-[calc(100%-80px)] flex rounded-2xl shadow-lg
          bg-[rgb(var(--surface))]
          border border-black/10 dark:border-white/10"
      >
        {/* Sidebar */}
        <div className="w-80 border-r border-black/10 dark:border-white/10 overflow-y-auto">
          <div className="p-4 border-b border-black/10 dark:border-white/10">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg
                border border-black/10 dark:border-white/10
                bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {facultyData.students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedStudent(student)}
              className={`p-4 cursor-pointer transition
                border-b border-black/5 dark:border-white/10
                hover:bg-black/5 dark:hover:bg-white/5
                ${
                  selectedStudent.id === student.id
                    ? "bg-blue-500/10"
                    : ""
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-green-400 flex items-center justify-center text-white font-semibold">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm opacity-70">
                    {student.branch}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-600 to-green-400 flex items-center justify-center text-white font-semibold">
              {selectedStudent.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="font-semibold">{selectedStudent.name}</p>
              <p className="text-sm opacity-70">
                {selectedStudent.branch} • {selectedStudent.credits} Credits
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  msg.sender === "faculty"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    msg.sender === "faculty"
                      ? "bg-blue-600 text-white"
                      : "bg-black/10 dark:bg-white/10"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-black/10 dark:border-white/10"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-lg
                  border border-black/10 dark:border-white/10
                  bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
