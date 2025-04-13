import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = { sender: "bot", text: "⚠️ Error talking to AI!" };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-8 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-purple-400">
          ChatGenie 🤖
        </h1>

        <div className="bg-gray-800 rounded-lg shadow-md p-4 h-[450px] overflow-y-scroll mb-4 text-lg">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 px-4 py-2 rounded-lg w-fit max-w-[80%] ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-600 text-right"
                  : "mr-auto bg-green-600 text-left"
              }`}
            >
              <span className="block text-sm font-bold mb-1">
                {msg.sender === "user" ? "You" : "Genie"}
              </span>
              {msg.text}
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded-l-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none text-lg"
            placeholder="Ask something..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-r-md text-white font-semibold text-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
