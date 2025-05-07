import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Moon, Sun } from "lucide-react";

const shortForms = {
  ds: "data structures",
  os: "operating systems",
  ai: "artificial intelligence",
  pdc: "parallel distributed computing",
};
const sendBotQuery = async (userMessage, user = null) => {
    try {
      const response = await fetch('/api/bot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage, user }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return data.response;
      } else {
        console.error('Bot error:', data.error);
        return "⚠️ Sorry, something went wrong.";
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return "🚫 Unable to connect to the server.";
    }
  };
  
function expandShortForms(text) {
  let expanded = text;
  for (const short in shortForms) {
    const regex = new RegExp(`\\b${short}\\b`, 'gi');
    expanded = expanded.replace(regex, shortForms[short]);
  }
  return expanded;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [darkMode, setDarkMode] = useState(false);
  const [awaitingEndConfirmation, setAwaitingEndConfirmation] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState(".");
  const [awaitingEndDecision, setAwaitingEndDecision] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setMessages([{ sender: "bot", text: "🤖 Hello! How may I help you today?" }]);
      setConversationEnded(false); // Reset ended convo when reopening
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const sendMessage = async () => {
    if (userInput.trim() === "") return;

    const expandedInput = expandShortForms(userInput.toLowerCase());
    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);

    if (conversationEnded) {
      setUserInput("");
      return;
    }

    if (awaitingEndDecision) {
      if (expandedInput.includes("yes")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "👍 Thank you! Have a wonderful day! 🌟" },
        ]);
        setConversationEnded(true);
      } else if (expandedInput.includes("no")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "😊 Alright! What else can I help you with?" },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "❓ Please type 'yes' or 'no'." },
        ]);
      }
      setAwaitingEndDecision(false);
      setUserInput("");
      return;
    }

    if (awaitingEndConfirmation) {
      if (expandedInput.includes("yes")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🧠 Would you like to end the conversation? (yes/no)" },
        ]);
        setAwaitingEndDecision(true);
      } else if (expandedInput.includes("no")) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🤖 No worries! Tell me what you need help with." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "❓ Please type 'yes' or 'no'." },
        ]);
      }
      setAwaitingEndConfirmation(false);
      setUserInput("");
      return;
    }

    try {
      setIsTyping(true);
      const response = await axios.post("http://localhost:5000/api/bot/ask", { message: expandedInput });
      const botReply = response.data.reply || "Sorry, I couldn't find an answer.";

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `🤖 ${botReply}` },
          { sender: "bot", text: "🤖 Did you get what you needed? (yes/no)" },
        ]);
        setIsTyping(false);
        setAwaitingEndConfirmation(true);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Server error!" },
      ]);
      setIsTyping(false);
    }

    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, [isTyping]);

  const startDrag = (e) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX, y: e.clientY });
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const handleDrag = (e) => {
    if (isDragging) {
      const dx = dragOffset.x - e.clientX;
      const dy = dragOffset.y - e.clientY;
      setPosition((prev) => ({
        bottom: prev.bottom + dy,
        right: prev.right + dx,
      }));
      setDragOffset({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  });

  return (
    <div>
      {/* Floating Button */}
      <div
        style={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
          background: "linear-gradient(135deg, #00f2fe, #4facfe)",
          borderRadius: "50%",
          width: "65px",
          height: "65px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 0 20px #00f2fe, 0 0 40px #4facfe",
          zIndex: 1000,
        }}
        onClick={toggleChat}
        onMouseDown={startDrag}
      >
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: position.bottom + 80,
            right: position.right,
            width: "320px",
            height: "460px",
            background: darkMode
              ? "linear-gradient(135deg, #0f0c29, #302b63, #24243e)"
              : "linear-gradient(135deg, #ffffff, #e0f7fa)",
            borderRadius: "20px",
            boxShadow: darkMode
              ? "0 0 30px rgba(0, 255, 255, 0.5)"
              : "0 0 30px rgba(0, 150, 136, 0.5)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            color: darkMode ? "white" : "#333",
            userSelect: "none",
            backdropFilter: "blur(12px)",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "15px",
              backgroundColor: darkMode ? "rgba(0, 255, 255, 0.2)" : "rgba(0, 150, 136, 0.3)",
              fontWeight: "bold",
              cursor: "move",
              textAlign: "center",
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onMouseDown={startDrag}
          >
            🤖 Chat Assistant
            <div onClick={toggleDarkMode} style={{ cursor: "pointer" }}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  gap: "8px",
                }}
              >
                {msg.sender === "bot" && (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "url('https://cdn-icons-png.flaticon.com/512/4712/4712027.png') center/cover",
                    }}
                  />
                )}
                <div
                  style={{
                    backgroundColor: msg.sender === "user"
                      ? (darkMode ? "rgba(255,0,255,0.3)" : "rgba(0,150,136,0.3)")
                      : (darkMode ? "rgba(0,255,255,0.3)" : "rgba(0,150,136,0.2)"),
                    padding: "10px 15px",
                    borderRadius: "20px",
                    maxWidth: "70%",
                    fontSize: "14px",
                  }}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      background: "url('https://cdn-icons-png.flaticon.com/512/4712/4712107.png') center/cover",
                    }}
                  />
                )}
              </div>
            ))}
            {isTyping && (
              <div style={{ fontStyle: "italic", color: darkMode ? "cyan" : "teal", marginLeft: "10px" }}>
                Typing{typingDots}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!conversationEnded && (
            <div
              style={{
                padding: "10px",
                display: "flex",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              }}
            >
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: darkMode ? "white" : "#333",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: "8px",
                  backgroundColor: darkMode ? "#00ffff" : "#009688",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  cursor: "pointer",
                  color: darkMode ? "#0f0c29" : "white",
                  fontSize: "18px",
                  boxShadow: "0 0 10px currentColor",
                }}
              >
                ➤
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
