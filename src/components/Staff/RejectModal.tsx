import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

const REJECT_REASONS = [
  { value: "out_of_stock", label: "Hết món" },
  { value: "overloaded", label: "Quán đang quá tải" },
  { value: "closed", label: "Ngoài giờ phục vụ" },
  { value: "cannot_fulfill", label: "Không thể đáp ứng yêu cầu" },
  { value: "other", label: "Lý do khác" },
] as const;

interface RejectModalProps {
  isOpen: boolean;
  orderCode: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function RejectModal({
  isOpen,
  orderCode,
  onConfirm,
  onClose,
  isLoading,
}: RejectModalProps) {
  const [selectedReason, setSelectedReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedReason) return;
    onConfirm(selectedReason);
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedReason("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">
                Từ chối đơn hàng
              </h2>
              <p className="text-sm text-gray-500">#{orderCode}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Reason dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Lý do từ chối <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white focus:border-red-400 focus:ring-2 focus:ring-red-400/20 outline-none transition-all disabled:opacity-50"
          >
            <option value="">-- Chọn lý do --</option>
            {REJECT_REASONS.map((r) => (
              <option key={r.value} value={r.label}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || isLoading}
            className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
          </button>
        </div>
      </div>
    </div>
  );
}
