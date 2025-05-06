import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isAi: false }]);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://panther-dust.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.message, isAi: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Desculpe, houve um erro ao processar sua solicitação.",
          isAi: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" flex flex-col h-screen bg-stone-900">
      <div className="w-full border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl text-center md:text-3xl font-bold text-gray-200 flex items-center gap-2 relative">
            <span className="text-yellow-300">PantherDust</span>
            <span>
              <img
                className="w-10 h-10 bottom-0 absolute"
                src="/logo.png"
                alt=""
              />
            </span>
            <span className="pl-5">Chatbot IA</span>
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 relative">
            <div className="bg-[url(/bg-img.png)] bg-no-repeat bg-size-[30rem] bg-center opacity-50 w-full h-full absolute z-1"></div>
            <div className="text-stone-50 z-2">
              <p className="text-xl font-medium">Inicie uma conversa</p>
              <p className="mt-2">Faça uma pergunta!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isAi={message.isAi}
            />
          ))
        )}
        {isLoading && (
          <div className="flex items-center justify-center space-x-2 p-4">
            <div className="animate-bounce h-2 w-2 bg--500 rounded-full"></div>
            <div className="animate-bounce h-2 w-2 bg--500 rounded-full delay-100"></div>
            <div className="animate-bounce h-2 w-2 bg--500 rounded-full delay-200"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-none p-6 bg-stone-900 border-t border-gray-200 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-7xl  mx-auto w-full">
          <div className="flex flex-col space-y-3">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="flex-1 min-h-[60px] bg-stone-900 w-full rounded-2xl border-2 border-gray-300 px-6 py-4 text-base text-stone-50 focus:outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500 focus:ring-opacity-50 transition-all duration-200 pr-16"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 inline-flex items-center justify-center w-12 h-12 rounded-xl text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <i>
                  <img className="p-2" src="/gun.png" alt="" />{" "}
                </i>
                {/* <PaperAirplaneIcon className="h-6 w-6 rotate-90" /> */}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Aperte Enter para enviar sua mensagem
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
