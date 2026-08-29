import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Mic, MicOff, Volume2, Copy, Check, Trash2 } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';

export default function AIAssistant({ isOpen, setIsOpen }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm **Ask Amit AI**, Amit's personal portfolio assistant. Ask me anything about Amit's skills, projects (StudyMind AI, CPU Scheduling Visualizer), education, or coding profiles!",
      provider: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const isDev = import.meta.env.DEV;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, isListening, isSpeaking]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          setInput(transcript);
          handleSend(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setVoiceSupported(false);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (!voiceSupported) {
      alert("Web Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const handleSend = async (messageText = input) => {
    const textToSend = messageText.trim();
    if (!textToSend || loading) return;

    stopSpeech();
    setInput('');

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      const data = await res.json();
      const aiResponseText = data.response || "I'm having trouble connecting to my AI assistant right now. Please try again in a moment.";

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        provider: data.provider || null
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (isListening) {
        speakText(aiResponseText);
      }
    } catch (err) {
      console.error('Chat API Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm having trouble connecting to my AI assistant right now. Please try again in a moment.",
          provider: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    stopSpeech();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Chat cleared! How can I assist you with Amit's portfolio?",
        provider: null
      }
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="ai-assistant-trigger fixed z-50 glass-panel p-0 sm:p-4 rounded-full flex items-center justify-center text-primary hover:text-secondary hover:scale-110 transition-all shadow-2xl shadow-primary/20 glow-hover group"
          aria-label="Ask AI Assistant"
        >
          <Bot className="size-5 sm:size-[26px]" />
          <span className="hidden sm:block absolute right-full mr-4 glass-panel text-on-surface font-mono-label text-xs py-2 px-4 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-primary/20">
            Ask Amit AI
          </span>
        </button>
      )}

      {/* Floating Chat Window Drawer */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-[calc(100vw-3rem)] sm:max-w-[420px] h-[min(78dvh,32rem)] sm:h-[580px] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100vh-3rem)] flex flex-col overflow-hidden glass-panel rounded-xl sm:rounded-2xl border border-primary/25 shadow-2xl animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="p-3 sm:p-4 bg-surface-container-high/90 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                <Bot className="size-4 sm:size-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">Ask Amit AI</h3>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-label text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                  Online • Voice Enabled
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                title="Clear Chat"
                className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg"
              >
                <Trash2 className="size-4" />
              </button>
              <button
                onClick={() => {
                  stopSpeech();
                  setIsOpen(false);
                }}
                title="Close Chat"
                className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-background/90">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-on-primary-container font-medium rounded-tr-none shadow-md'
                      : 'bg-surface-container-high/90 text-on-surface border border-outline-variant/30 rounded-tl-none'
                  }`}
                >
                  {msg.content}

                  {isDev && msg.provider && (
                    <div className="mt-1 text-[10px] font-mono-label text-secondary opacity-80">
                      Provider: {msg.provider}
                    </div>
                  )}
                </div>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-3 mt-1.5 px-1 text-[10px] sm:text-[11px] font-mono-label text-on-surface-variant">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-primary transition-colors flex items-center gap-1"
                    >
                      {copiedId === msg.id ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>

                    <button
                      onClick={() => speakText(msg.content)}
                      className="hover:text-secondary transition-colors flex items-center gap-1"
                    >
                      <Volume2 size={12} /> Listen
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="self-start bg-surface-container-high/90 p-3 sm:p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 border border-outline-variant/30">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            )}

            {(isListening || isSpeaking) && (
              <div className="self-center px-3 sm:px-4 py-1.5 rounded-full bg-success/15 border border-success/40 text-success text-[10px] sm:text-xs font-mono-label flex items-center gap-2">
                {isListening ? <Mic size={14} className="animate-pulse" /> : <Volume2 size={14} className="animate-bounce" />}
                <span>{isListening ? 'Listening for prompt...' : 'Speaking response...'}</span>
                {isSpeaking && (
                  <button onClick={stopSpeech} className="text-error font-bold ml-1 hover:underline">
                    Stop
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length < 5 && (
            <div className="px-2.5 sm:px-3 py-2 bg-surface-container-high/60 border-t border-outline-variant/20 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
              {portfolioData.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-2.5 sm:px-3 py-1 rounded-full bg-surface-container/80 text-on-surface-variant hover:text-secondary hover:border-secondary/40 border border-outline-variant/20 text-[10px] sm:text-xs font-mono-label transition-all flex-shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-2.5 sm:p-3 bg-surface-container-high/90 border-t border-outline-variant/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 sm:p-2.5 rounded-full border transition-all ${
                  isListening
                    ? 'voice-danger animate-pulse'
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                }`}
                title={isListening ? 'Stop listening' : 'Voice input'}
              >
                {isListening ? <MicOff className="size-4 sm:size-[18px]" /> : <Mic className="size-4 sm:size-[18px]" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? 'Listening...' : 'Ask about Amit...'}
                disabled={loading}
                className="min-w-0 flex-1 bg-surface-container/90 border border-outline-variant/30 rounded-full px-3 sm:px-4 py-2 sm:py-2.5 text-on-surface text-xs md:text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`p-2 sm:p-2.5 rounded-full transition-all ${
                  input.trim() && !loading
                    ? 'bg-primary-container text-on-primary-container hover:bg-primary shadow-md'
                    : 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed'
                }`}
              >
                <Send className="size-4 sm:size-[18px]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
