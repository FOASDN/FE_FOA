import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// ---- Types ----

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// ---- Component ----

export function FloatingAIChatbot() {
    const { t } = useTranslation(['customer', 'common']);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Send greeting on first open
    const handleOpen = () => {
        setIsOpen(true);
        if (messages.length === 0) {
            setMessages([{
                id: '1',
                role: 'assistant',
                content: t('customer:chatbot.greeting'),
                timestamp: new Date(),
            }]);
        }
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response (replace with real API later)
        setTimeout(() => {
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: t('customer:chatbot.defaultReply'),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1200);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Drawer */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-8rem)] bg-card rounded-3xl shadow-2xl shadow-black/10 border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">{t('customer:chatbot.title')}</h3>
                                <p className="text-[10px] text-white/80 font-medium">
                                    {t('customer:chatbot.subtitle')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-orange-500 text-white rounded-br-lg'
                                        : 'bg-muted text-foreground rounded-bl-lg'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-lg flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-border bg-card">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t('customer:chatbot.placeholder')}
                                className="flex-1 h-10 px-4 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center shadow-md shadow-orange-500/20 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* FAB Button */}
            <button
                onClick={isOpen ? () => setIsOpen(false) : handleOpen}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 active:scale-90 ${isOpen
                    ? 'bg-foreground/80 text-background hover:bg-foreground/90 rotate-0'
                    : 'bg-gradient-to-br from-orange-500 to-amber-500 text-white hover:shadow-orange-500/40 hover:shadow-2xl'
                    }`}
                aria-label={t('customer:chatbot.title')}
            >
                <span className="material-symbols-outlined text-[26px]">
                    {isOpen ? 'close' : 'smart_toy'}
                </span>
                {/* Pulse ring when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30" />
                )}
            </button>
        </>
    );
}
