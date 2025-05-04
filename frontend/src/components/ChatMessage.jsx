import React from "react";
import { UserIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";

const ChatMessage = ({ message, isAi }) => {
  return (
    <div
      className={`w-9/10 md:w-3/5 flex space-x-4 p-6 rounded-2xl transition-colors duration-200 ${
        isAi ? "bg-stone-200 place-self-start" : "bg-lime-800/50 place-self-end"
      }`}
    >
      {/* Lidando com os ícones */}
      <div
        className={`flex-shrink-0 rounded-full p-2 bg-stone-50 h-15 md:h-20`}
      >
        {isAi ? (
          <div className="w-10 md:w-15 p-2">
            <img src="./src/assets/captain.png" alt="" />
          </div>
        ) : (
          <div className="w-10 md:w-15 p-2">
            <img src="./src/assets/star-medal.png" alt="" />
          </div>
        )}
      </div>
      {/* Lidando com o nome */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center">
          <p
            className={`font-medium ${
              isAi ? "text-blue-900" : "text-stone-50"
            }`}
          >
            {isAi ? "PantherDust" : "Você"}
          </p>
        </div>
        {/* Lidando com a mensagem */}
        <div className="prose prose-sm max-w-none">
          <p
            className={`${
              isAi ? "text-gray-700" : "text-stone-300"
            }  text-base leading-relaxed whitespace-pre-wrap`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
