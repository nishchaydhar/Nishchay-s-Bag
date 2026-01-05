import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Minimize2 } from 'lucide-react';
import { Quest } from '../types';
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { Chat } from "@google/genai";

interface GroguProps {
  quests: Quest[];
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const Grogu: React.FC<GroguProps> = ({ quests }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Beep boop! I am Grogu, your odyssey bear! 🍯 How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation State
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [target, setTarget] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 100 });
  const [isHovered, setIsHovered] = useState(false);

  // Chat Session
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat
  useEffect(() => {
    if (isOpen && !chatSession.current) {
        chatSession.current = createChatSession(quests);
    }
  }, [isOpen]); 

  // Roaming Logic
  useEffect(() => {
    // Pick a new target every few seconds
    const interval = setInterval(() => {
        if (!isOpen && !isHovered) {
            const padding = 50;
            const newX = padding + Math.random() * (window.innerWidth - 100 - padding);
            const newY = padding + Math.random() * (window.innerHeight - 100 - padding);
            setTarget({ x: newX, y: newY });
        }
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isHovered]);

  // Animation Loop (Simple interpolation)
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
        if (!isOpen) {
            setPosition(prev => ({
                x: prev.x + (target.x - prev.x) * 0.02, // 0.02 is speed factor
                y: prev.y + (target.y - prev.y) * 0.02
            }));
        }
        animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, isOpen]);


  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!chatSession.current) chatSession.current = createChatSession(quests);
    if (!chatSession.current) {
        setMessages(prev => [...prev, { role: 'model', text: "Beep... *sad noise*... Check your API key?" }]);
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
    <>
      {/* Grogu The Character */}
      {!isOpen && (
          <div 
            style={{ 
                position: 'fixed', 
                left: position.x, 
                top: position.y, 
                zIndex: 50,
                transform: `scale(${isHovered ? 1.1 : 1})`,
                transition: 'transform 0.3s ease'
            }}
            className="cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setIsOpen(true)}
          >
             {/* Simple SVG Bear */}
             <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                {/* Ears */}
                <circle cx="25" cy="30" r="15" fill="#E6B89C" />
                <circle cx="75" cy="30" r="15" fill="#E6B89C" />
                {/* Head */}
                <rect x="15" y="20" width="70" height="60" rx="20" fill="#FDFBF7" stroke="#2D2A26" strokeWidth="3" />
                {/* Screen Face */}
                <rect x="25" y="35" width="50" height="30" rx="5" fill="#2D2A26" />
                {/* Eyes */}
                <circle cx="40" cy="50" r="3" fill="#00FF00" className="animate-pulse" />
                <circle cx="60" cy="50" r="3" fill="#00FF00" className="animate-pulse" />
                {/* Antenna */}
                <line x1="50" y1="20" x2="50" y2="5" stroke="#2D2A26" strokeWidth="2" />
                <circle cx="50" cy="5" r="4" fill="#EBC5C5" />
             </svg>
             {isHovered && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ink text-paper text-xs px-2 py-1 rounded whitespace-nowrap">
                    Chat with me!
                </div>
             )}
          </div>
      )}

      {/* Chat Window (Fixed Position when open) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
          <div className="bg-paper w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-ink/10 flex flex-col mb-4 animate-fade-in-up overflow-hidden">
            {/* Header */}
            <div className="bg-ink text-paper p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                 <Bot size={20} className="text-accent" />
                 <div>
                    <h3 className="font-serif text-lg leading-none">Grogu</h3>
                    <span className="text-[10px] text-accent uppercase tracking-widest">Robo-Companion</span>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-paper/60 hover:text-paper">
                <Minimize2 size={18} />
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
                placeholder="Ask Grogu..."
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
        </div>
      )}
    </>
  );
};