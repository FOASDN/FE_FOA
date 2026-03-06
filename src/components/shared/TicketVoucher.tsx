import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// ---- Types ----

export interface TicketVoucherProps {
    code: string;
    title: string;
    description?: string;
    discountValue: string;
    minOrder?: string;
    expiryDate?: string;
    isUsed?: boolean;
    isExpired?: boolean;
    onCopy?: (code: string) => void;
    onUse?: (code: string) => void;
    className?: string;
}

// ---- Component ----

export function TicketVoucher({
    code,
    title,
    description,
    discountValue,
    minOrder,
    expiryDate,
    isUsed = false,
    isExpired = false,
    onCopy,
    onUse,
    className = '',
}: TicketVoucherProps) {
    const { t } = useTranslation(['customer', 'common']);
    const [copied, setCopied] = useState(false);

    const isDisabled = isUsed || isExpired;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onCopy?.(code);
    };

    return (
        <div
            className={`relative flex overflow-hidden rounded-2xl border ${isDisabled
                ? 'border-gray-200 bg-gray-50 dark:bg-gray-900/50 opacity-70'
                : 'border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50/50 dark:from-orange-950/30 dark:to-amber-950/20 hover:shadow-lg hover:shadow-orange-500/10'
                } transition-all duration-300 ${className}`}
        >
            {/* Left — Discount Value */}
            <div className={`flex flex-col items-center justify-center px-2 py-5 w-[135px] shrink-0 ${isDisabled
                ? 'bg-gray-100 dark:bg-gray-800'
                : 'bg-gradient-to-b from-orange-500 to-amber-500'
                }`}
            >
                <span className={`text-2xl font-black text-center whitespace-nowrap overflow-hidden text-ellipsis w-full px-1 ${isDisabled ? 'text-gray-400' : 'text-white'}`}>
                    {discountValue}
                </span>
                {minOrder && (
                    <span className={`text-[10px] font-medium mt-1 text-center whitespace-nowrap overflow-hidden text-ellipsis w-full px-1 ${isDisabled ? 'text-gray-400' : 'text-white/80'}`}>
                        Min: {minOrder}
                    </span>
                )}
            </div>

            {/* Dashed border cutout */}
            <div className="absolute left-[134px] top-0 bottom-0 flex flex-col justify-between py-0 z-10 pointer-events-none">
                <div className={`w-5 h-2.5 rounded-b-full ${isDisabled ? 'bg-background' : 'bg-background'} -mt-px`} />
                <div className="flex-1 border-l-2 border-dashed border-border/60 mx-2.5" />
                <div className={`w-5 h-2.5 rounded-t-full ${isDisabled ? 'bg-background' : 'bg-background'} -mb-px`} />
            </div>

            {/* Right — Info */}
            <div className="flex-1 flex flex-col justify-center px-5 py-4 ml-2">
                <h4 className="font-bold text-foreground text-sm line-clamp-1 mb-0.5">{title}</h4>
                {description && <p className="text-muted-foreground text-xs line-clamp-1 mb-2">{description}</p>}

                <div className="flex items-center gap-3">
                    {/* Code */}
                    <span className="inline-flex items-center gap-1.5 bg-background border border-border px-2.5 py-1 rounded-lg">
                        <span className="font-mono font-bold text-xs text-orange-600 tracking-wider">{code}</span>
                        <button onClick={handleCopy} className="text-muted-foreground hover:text-foreground transition-colors">
                            <span className="material-symbols-outlined text-[14px]">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                        </button>
                    </span>

                    {/* Expiry */}
                    {expiryDate && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {expiryDate}
                        </span>
                    )}
                </div>

                {/* Status badges */}
                {isUsed && (
                    <span className="mt-2 inline-flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {t('customer:voucherWallet.used')}
                    </span>
                )}
                {isExpired && !isUsed && (
                    <span className="mt-2 inline-flex items-center text-[10px] font-bold text-red-500 uppercase tracking-wider">
                        {t('customer:voucherWallet.expired')}
                    </span>
                )}
            </div>

            {/* Use Button */}
            {!isDisabled && onUse && (
                <div className="flex items-center pr-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); onUse(code); }}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 active:scale-95 transition-all"
                    >
                        {t('customer:voucherDetail.useNow')}
                    </button>
                </div>
            )}
        </div>
    );
}
