import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';
import { Quest } from '../types';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { Chat } from "@google/genai";

interface ChatBotProps {
  quests: Quest[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const ChatBot: React.FC<ChatBotProps> = ({ quests }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Greetings. I am your Odyssey Companion. Need help planning a quest today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // We use a ref to keep the chat session instance across renders
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat session when opened or when quests change
  useEffect(() => {
    if (isOpen && !chatSession.current) {
        chatSession.current = createChatSession(quests);
    }
  }, [isOpen]); 

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Create session if it doesn't exist (edge case)
    if (!chatSession.current) {
         chatSession.current = createChatSession(quests);
    }

    if (!chatSession.current) {
        setMessages(prev => [...prev, { role: 'model', text: "I cannot connect right now. Is the API Key configured?" }]);
        return;
    }
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendMessageToChat(chatSession.current, userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-paper w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-ink/10 flex flex-col mb-4 pointer-events-auto animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-ink text-paper p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <Bot size={20} className="text-accent" />
               <h3 className="font-serif text-lg">Companion</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-paper/60 hover:text-paper">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F7F5F0]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`
                    max-w-[85%] p-3 text-sm font-sans leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-ink text-paper rounded-2xl rounded-br-none' 
                      : 'bg-white text-ink border border-ink/5 rounded-2xl rounded-bl-none shadow-sm'}
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-ink/5 shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                    <span className="w-1.5 h-1.5 bg-ink/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-ink/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice..."
              className="flex-1 bg-ink/5 border-none rounded-xl px-4 py-2 text-ink text-sm focus:ring-1 focus:ring-accent outline-none placeholder:text-ink/30"
              disabled={isLoading}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-ink text-paper p-2 rounded-xl hover:bg-ink/90 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-ink text-paper p-4 rounded-full shadow-xl hover:scale-105 transition-transform group flex items-center justify-center relative"
      >
        {isOpen ? (
            <Minimize2 size={24} />
        ) : (
            <>
                <MessageCircle size={24} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                </span>
            </>
        )}
      </button>
    </div>
  );
};