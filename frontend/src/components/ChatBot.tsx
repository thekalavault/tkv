import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const PREDEFINED_TOPICS = [
  { label: "Pricing & Plans", value: "pricing" },
  { label: "Curation Process", value: "process" },
  { label: "The Collection", value: "collection" },
  { label: "Contact Concierge", value: "contact" }
];

type MessageAction = { label: string; actionType: 'send' | 'navigate'; payload: string };

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  media?: string[];
  actions?: MessageAction[];
};

export default function ChatBot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome-1',
      sender: 'bot', 
      text: 'Hello, I am the Kala Assistant. How may I assist you with your corporate art curation today?' 
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleAction = (action: MessageAction) => {
    if (action.actionType === 'send') {
      handleSend(action.payload);
    } else if (action.actionType === 'navigate') {
      setIsOpen(false);
      navigate(action.payload);
    }
  };

  const handleSend = (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputValue('');
    setIsTyping(true);

    // Generate response with artificial delay
    setTimeout(() => {
      const lowerInput = textToSend.toLowerCase();
      let botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'As the Kala Assistant, I can assist you with details regarding our premium art leasing, curation logistics, and subscription structures.'
      };
      
      if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse.text = 'Hello. I am here to guide you through our museum-grade collections and white-glove corporate installation services. What specific information do you need?';
        botResponse.actions = [
          { label: "View Process", actionType: "send", payload: "How does the curation process work?" }
        ];
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('subscription') || lowerInput.includes('pricing') || lowerInput.includes('plans')) {
        botResponse.text = 'Our leasing structures are deeply tailored to the architectural scale of your environment. We offer dynamic corporate subscriptions that include full white-glove curation, museum-grade installation, and quarterly asset rotations.';
        botResponse.actions = [
          { label: "Schedule Consultation", actionType: "navigate", payload: "/inquire" },
          { label: "Explore Subscriptions", actionType: "navigate", payload: "/subscriptions" }
        ];
      } else if (lowerInput.includes('art') || lowerInput.includes('collection')) {
        botResponse.text = 'The Kala Vault houses thousands of museum-grade pieces. Our private vault is meticulously sourced to define premium transit paths, grand lobbies, and executive boardrooms.';
        botResponse.media = [
          "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600",
          "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=600"
        ];
        botResponse.actions = [
          { label: "Browse Full Collection", actionType: "navigate", payload: "/collections" }
        ];
      } else if (lowerInput.includes('process') || lowerInput.includes('curation')) {
        botResponse.text = 'Our white-glove process is seamless: Discover, Consult, Subscribe, Install, and Rotate. We propose a cohesive visual narrative, then execute the precision logistics so you never have to lift a finger.';
        botResponse.actions = [
          { label: "What are the subscription plans?", actionType: "send", payload: "Pricing and plans" }
        ];
      } else if (lowerInput.includes('contact') || lowerInput.includes('support') || lowerInput.includes('concierge')) {
        botResponse.text = 'We would be delighted to elevate your space. You can schedule a private assessment or reach out directly to our client success team.';
        botResponse.actions = [
          { label: "Book Assessment", actionType: "navigate", payload: "/inquire" }
        ];
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500); 
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body-md">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mb-6 w-[350px] md:w-[400px] bg-[#160D0A]/95 backdrop-blur-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-[#C5A059]/30 flex flex-col overflow-hidden rounded-3xl"
            style={{ height: '580px' }}
          >
            {/* Header */}
            <div className="relative p-5 border-b border-[#C5A059]/20 overflow-hidden bg-gradient-to-r from-[#4A0E17]/40 via-[#160D0A] to-[#241611]">
              {/* Dynamic animated gradient background for header */}
              <motion.div 
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 z-0 bg-[length:200%_200%] opacity-25"
                style={{ backgroundImage: 'linear-gradient(45deg, rgba(197,160,89,0.1), rgba(74,14,23,0.3), rgba(0,0,0,0))' }}
              />
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A0E17] to-[#160D0A] border border-[#C5A059]/60 flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.3)]">
                      <span className="material-symbols-outlined text-[#C5A059] text-[18px]">account_balance</span>
                    </div>
                    {/* Pulsing online indicator */}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C5A059] rounded-full border-2 border-[#160D0A]" />
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C5A059] rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-[15px] text-[#FAF6F0] tracking-wider leading-tight">Curatorial Concierge</span>
                    <span className="font-mono text-[9px] text-[#C5A059] tracking-[0.25em] uppercase mt-0.5">The Kala Vault Private Desk</span>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#FAF6F0]/60 hover:text-white hover:bg-white/10 transition-all">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-[#C5A059]/20 scrollbar-track-transparent">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 150 }}
                    key={msg.id} 
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
                  >
                    <div 
                      className={`max-w-[88%] p-4 text-[13px] leading-relaxed shadow-sm relative ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-r from-[#4A0E17] to-[#58111A] text-[#FAF6F0] border border-[#C5A059]/30 rounded-2xl rounded-tr-sm font-normal' 
                          : 'bg-white/5 border border-[#C5A059]/15 text-[#FAF6F0]/90 rounded-2xl rounded-tl-sm backdrop-blur-md'
                      }`}
                    >
                      {msg.text}
                      
                      {/* Rich Media Images */}
                      {msg.media && (
                        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none snap-x">
                          {msg.media.map((url, i) => (
                            <img key={i} src={url} alt="Collection Preview" className="h-24 w-32 object-cover rounded-lg snap-start border border-[#C5A059]/20 flex-shrink-0 shadow-lg" />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons for Bot Messages */}
                    {msg.actions && msg.sender === 'bot' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.3 }}
                        className="mt-2 flex flex-wrap gap-2 max-w-[85%]"
                      >
                        {msg.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleAction(act)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 ${
                              act.actionType === 'navigate' 
                                ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 hover:bg-[#C5A059] hover:text-[#160D0A]'
                                : 'bg-white/5 text-[#FAF6F0]/70 border border-white/10 hover:bg-white/15'
                            }`}
                          >
                            {act.label}
                            {act.actionType === 'navigate' && <span className="material-symbols-outlined text-[12px]">arrow_outward</span>}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.9, transformOrigin: 'left' }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/5 border border-[#C5A059]/20 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center backdrop-blur-sm">
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Predefined Topics Row */}
            <div className="px-4 pb-3 pt-2 bg-gradient-to-t from-[#160D0A] via-[#160D0A] to-transparent flex overflow-x-auto gap-2 scrollbar-none snap-x relative z-10">
              {PREDEFINED_TOPICS.map(topic => (
                <button
                  key={topic.value}
                  onClick={() => handleSend(topic.label)}
                  disabled={isTyping}
                  className="snap-start flex-shrink-0 px-3.5 py-1.5 bg-[#241611]/80 backdrop-blur-md border border-[#C5A059]/20 rounded-full text-[10px] font-mono tracking-widest text-[#FAF6F0]/80 hover:bg-[#C5A059]/15 hover:text-[#C5A059] hover:border-[#C5A059]/40 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase"
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#160D0A] border-t border-[#C5A059]/15 flex items-center gap-3 relative z-10">
              <div className="flex-1 bg-white/5 border border-[#C5A059]/20 rounded-full flex items-center px-4 py-1.5 focus-within:border-[#C5A059]/60 focus-within:bg-white/10 transition-colors">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  disabled={isTyping}
                  placeholder="Type your curatorial inquiry..."
                  className="w-full bg-transparent border-none outline-none text-[#FAF6F0] text-[13px] placeholder:text-[#FAF6F0]/40 h-8"
                />
              </div>
              <button 
                onClick={() => handleSend()}
                disabled={isTyping || !inputValue.trim()}
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-[#4A0E17] to-[#58111A] text-[#DFC07D] border border-[#C5A059]/40 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(74,14,23,0.5)] flex-shrink-0"
              >
                <span className="material-symbols-outlined text-[17px]">send</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="relative group cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {/* Ambient glow behind the button */}
          <div className="absolute inset-0 bg-[#C5A059] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
          
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#4A0E17] via-[#241611] to-[#160D0A] border border-[#C5A059]/40 text-[#DFC07D] p-1.5 pr-5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] hover:border-[#C5A059] transition-all duration-500">
            <div className="w-11 h-11 bg-[#C5A059]/15 rounded-full flex items-center justify-center relative overflow-hidden border border-[#C5A059]/30">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(197,160,89,0.5)_360deg)]"
              />
              <div className="absolute inset-[2px] bg-[#160D0A] rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#DFC07D] text-[20px]">account_balance</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-[12px] tracking-wider text-[#FAF6F0] whitespace-nowrap">Concierge</span>
              <span className="font-mono text-[9px] text-[#C5A059]">Private Advisory</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
