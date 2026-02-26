import { useState } from "react";
import { useTranslation } from "react-i18next";

const EXPERIENCE_OPTIONS = [
    { id: "match_notes", label: "Món đúng với ghi chú / yêu cầu của tôi", icon: "check_circle" },
    { id: "on_time", label: "Giao đúng giờ", icon: "schedule" },
    { id: "packaging", label: "Đóng gói cẩn thận, món còn nóng", icon: "inventory_2" },
    { id: "staff", label: "Nhân viên thân thiện, chuyên nghiệp", icon: "support_agent" },
] as const;

const HEALTH_FIT_OPTIONS = [
    { value: "very_good", label: "Rất phù hợp", desc: "Món đúng với dị ứng, ăn kiêng, ghi chú của tôi" },
    { value: "good", label: "Phù hợp", desc: "Hầu hết đúng yêu cầu" },
    { value: "partial", label: "Không hoàn toàn", desc: "Một vài điểm chưa đúng" },
    { value: "not_good", label: "Không phù hợp", desc: "Không đúng với yêu cầu sức khỏe / ghi chú" },
] as const;

const OrderRatingPage = () => {
    const [stars, setStars] = useState(0);
    const { t } = useTranslation(['customer', 'common']);
    const [experience, setExperience] = useState<string[]>([]);
    const [healthFit, setHealthFit] = useState<string>("");
    const [comment, setComment] = useState("");
    const [improvement, setImprovement] = useState("");

    const toggleExperience = (id: string) => {
        setExperience((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        console.log({ stars, experience, healthFit, comment, improvement });
        // TODO: gửi API
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#191710] dark:text-gray-100 transition-colors duration-300 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <main className="flex-1 flex flex-col items-center py-10 px-4">
                        <div className="layout-content-container flex flex-col max-w-[720px] w-full">
                            <div className="flex flex-wrap gap-2 py-2">
                                <a className="text-[#8c7f5a] text-sm font-medium hover:underline" href="#">Đơn hàng</a>
                                <span className="text-[#8c7f5a] text-sm font-medium">/</span>
                                <span className="text-[#1b140d] dark:text-gray-400 text-sm font-medium">Đánh giá & Nhận xét</span>
                            </div>
                            <div className="flex flex-col gap-2 py-6">
                                <h1 className="text-[#1b140d] dark:text-white text-4xl font-extrabold leading-tight tracking-tight">{t('customer:rating.title')}</h1>
                                <p className="text-[#8c7f5a] text-lg font-normal">Phản hồi của bạn giúp chúng tôi hoàn thiện trải nghiệm hơn.</p>
                            </div>
                            <div className="bg-white dark:bg-[#1f2122] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-50 dark:border-gray-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-50 dark:border-gray-800">
                                    <div className="flex flex-col sm:flex-row gap-6 items-center">
                                        <div className="w-full sm:w-48 h-32 bg-center bg-no-repeat bg-cover rounded-lg flex-shrink-0" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&h=500&fit=crop")' }}></div>
                                        <div className="flex flex-col grow gap-1 text-center sm:text-left">
                                            <p className="text-primary text-xs font-bold uppercase tracking-widest">Đã giao</p>
                                            <h3 className="text-[#1b140d] dark:text-white text-2xl font-bold leading-tight">Phở Bò Đặc Biệt</h3>
                                            <p className="text-[#8c7f5a] text-sm">Đơn #84920 • Giao ngày 24 Th10, 2023</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col gap-10">
                                    {/* Rating */}
                                    <div className="flex flex-col items-center gap-4">
                                        <p className="text-[#1b140d] dark:text-white text-xl font-bold">Bữa ăn của bạn thế nào?</p>
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setStars(star)}
                                                    className="group focus:outline-none"
                                                    aria-label={`${star} sao`}
                                                >
                                                    <span
                                                        className={`material-symbols-outlined text-4xl transform transition-transform group-hover:scale-110 ${stars >= star ? "text-[#c9a94a]" : "text-[#e5e7eb] dark:text-gray-700"}`}
                                                        style={stars >= star ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
                                                    >
                                                        star
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-[#8c7f5a] text-sm">Chạm để đánh giá</p>
                                    </div>

                                    {/* Trải nghiệm */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#1b140d] dark:text-white text-base font-semibold">Trải nghiệm của bạn (chọn tất cả đúng)</label>
                                        <p className="text-[#8c7f5a] text-sm">Giúp chúng tôi biết điều gì làm bạn hài lòng.</p>
                                        <div className="flex flex-col gap-2">
                                            {EXPERIENCE_OPTIONS.map((opt) => (
                                                <label
                                                    key={opt.id}
                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${experience.includes(opt.id) ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-700 hover:border-primary/50"}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={experience.includes(opt.id)}
                                                        onChange={() => toggleExperience(opt.id)}
                                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="material-symbols-outlined text-[#8c7f5a] text-[20px]">{opt.icon}</span>
                                                    <span className="text-[#1b140d] dark:text-white text-sm font-medium">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Phù hợp sức khỏe & ghi chú */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#1b140d] dark:text-white text-base font-semibold">Món ăn có phù hợp với sức khỏe & yêu cầu của bạn không?</label>
                                        <p className="text-[#8c7f5a] text-sm">Ví dụ: đúng ghi chú đặt món, dị ứng, ăn kiêng, ít cay, bỏ mỡ...</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {HEALTH_FIT_OPTIONS.map((opt) => (
                                                <label
                                                    key={opt.value}
                                                    className={`flex flex-col gap-1 p-4 rounded-lg border cursor-pointer transition-all ${healthFit === opt.value ? "border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30" : "border-gray-200 dark:border-gray-700 hover:border-primary/50"}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name="healthFit"
                                                            value={opt.value}
                                                            checked={healthFit === opt.value}
                                                            onChange={() => setHealthFit(opt.value)}
                                                            className="text-primary focus:ring-primary"
                                                        />
                                                        <span className="text-[#1b140d] dark:text-white font-semibold text-sm">{opt.label}</span>
                                                    </div>
                                                    <span className="text-[#8c7f5a] text-xs pl-6">{opt.desc}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chia sẻ cảm nghĩ */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#1b140d] dark:text-white text-base font-semibold">Chia sẻ cảm nghĩ</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-primary focus:border-primary text-[#1b140d] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 text-base leading-relaxed resize-none"
                                            placeholder="Bạn thích điều gì ở món này? Ví dụ: gia vị vừa miệng, rau tươi, đúng ghi chú không cay..."
                                        />
                                    </div>

                                    {/* Điều cần cải thiện */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#1b140d] dark:text-white text-base font-semibold">Điều gì chúng tôi nên cải thiện? (tùy chọn)</label>
                                        <textarea
                                            value={improvement}
                                            onChange={(e) => setImprovement(e.target.value)}
                                            className="w-full min-h-[80px] p-4 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 focus:ring-primary focus:border-primary text-[#1b140d] dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600 text-sm leading-relaxed resize-none"
                                            placeholder="Ví dụ: giao trễ, món không đúng ghi chú, đóng gói chưa kỹ..."
                                        />
                                    </div>

                                    {/* Upload Photos */}
                                    <div className="flex flex-col gap-3">
                                        <label className="text-[#1b140d] dark:text-white text-base font-semibold">Thêm ảnh vào nhận xét</label>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <button type="button" className="aspect-square rounded-lg border-2 border-dashed border-primary/40 dark:border-primary/20 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group">
                                                <span className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:-translate-y-1">add_a_photo</span>
                                                <span className="text-xs font-bold text-primary">Tải lên</span>
                                            </button>
                                            <div className="hidden sm:flex col-span-3 items-center px-4">
                                                <p className="text-[#8c7f5a] text-sm italic">Chia sẻ ảnh giúp người khác dễ dàng chọn món ngon hơn.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="w-full bg-primary hover:bg-[#b09440] text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg shadow-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {t('customer:rating.submit')}
                                            <span className="material-symbols-outlined">send</span>
                                        </button>
                                        <p className="text-center text-[#8c7f5a] text-xs mt-4">Bằng việc gửi, bạn đồng ý với Nguyên tắc cộng đồng của chúng tôi.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-20"></div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default OrderRatingPage;
