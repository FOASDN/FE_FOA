import { useEffect, useRef, useState } from 'react';
import { useOrderSupportChat } from '@/hooks/useOrderSupportChat';

interface OrderSupportChatProps {
    orderId?: string;
}

export function OrderSupportChat({ orderId }: OrderSupportChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const {
        conversation,
        messages,
        initializing,
        loading,
        sending,
        error,
        sendMessage,
    } = useOrderSupportChat(orderId, { enabled: isOpen });

    // Tự động cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]); // Thêm isOpen để cuộn khi vừa mở chat

    const handleToggle = () => {
        if (!orderId) return;
        setIsOpen((prev) => !prev);
    };

    const handleSend = async () => {
        if (!input.trim() || sending || !conversation) return;
        const content = input.trim();
        setInput('');
        try {
            await sendMessage(content);
        } catch {
            setInput(content); // Phục hồi tin nhắn nếu lỗi
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
        }
    };

    return (
        <>
            {/* Card khởi động Chat (Entry Card) */}
            <div className="bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Hỗ trợ trực tuyến
                            </p>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                            Cần thay đổi món hoặc gặp sự cố? Nhắn ngay cho cửa hàng nhé!
                        </p>
                        {!orderId && (
                            <p className="mt-2 text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 inline-block px-2 py-1 rounded-md">
                                Không thể mở chat vì thiếu mã đơn hàng.
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={!orderId}
                        className="group flex flex-col items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 hover:-translate-y-0.5 transition-all active:scale-95 shrink-0"
                    >
                        <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">
                            forum
                        </span>
                    </button>
                </div>
            </div>

            {/* Floating Chat Panel (Cửa sổ chat nổi) */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-slate-50 dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200/60 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300">

                    {/* Header */}
                    <div className="relative flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-[22px]">storefront</span>
                                </div>
                                {/* Chấm xanh Online */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-none mb-1">
                                    FoodieDash Support
                                </h3>
                                <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                    Đang hoạt động
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5 space-y-4 bg-slate-50/50 dark:bg-slate-900 scroll-smooth">
                        {initializing && (
                            <div className="flex justify-center mt-4">
                                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full animate-pulse">
                                    Đang kết nối...
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="flex justify-center mt-2">
                                <span className="text-xs font-medium text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-500/20">
                                    {error}
                                </span>
                            </div>
                        )}

                        {!initializing && !loading && messages.length === 0 && !error && (
                            <div className="flex flex-col items-center justify-center h-full opacity-60 mt-[-10px]">
                                <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">waving_hand</span>
                                <p className="text-xs text-slate-500 text-center max-w-[80%]">
                                    Xin chào! Cửa hàng có thể giúp gì cho bạn với đơn hàng này?
                                </p>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const isUser = msg.senderType === 'USER';
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed shadow-sm ${isUser
                                            ? 'bg-orange-500 text-white rounded-2xl rounded-tr-sm' // Bong bóng của khách (đuôi bên phải)
                                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm' // Bong bóng của quán (đuôi bên trái)
                                            }`}
                                    >
                                        <p className="break-words">{msg.content}</p>
                                    </div>
                                    <span className="mt-1 text-[10px] font-medium text-slate-400 px-1">
                                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-full p-1.5 pr-2 border border-transparent focus-within:border-orange-500/30 focus-within:bg-white transition-colors">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 h-9 px-3 bg-transparent text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => { void handleSend(); }}
                                disabled={!input.trim() || sending || initializing || !conversation}
                                className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md disabled:opacity-40 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-90"
                            >
                                <span className="material-symbols-outlined text-[18px] ml-0.5">
                                    send
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}