import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HEALTH_COLOR = "var(--health)";

const DIET_OPTIONS = ["Thuần chay", "Keto", "Paleo", "Ăn chay", "Ít carb"];

const ALLERGY_OPTIONS = [
  { id: "peanuts", label: "Đậu phộng", icon: "allergy" },
  { id: "gluten", label: "Gluten", icon: "bakery_dining" },
  { id: "dairy", label: "Sữa", icon: "water_drop" },
  { id: "shellfish", label: "Hải sản có vỏ", icon: "set_meal" },
];

const HEALTH_GOALS = [
  { id: "weight", label: "Giảm cân", icon: "monitoring" },
  { id: "muscle", label: "Tăng cơ", icon: "fitness_center" },
  { id: "energy", label: "Năng lượng tốt hơn", icon: "bolt" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['customer', 'common']);
  const [diet, setDiet] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<Record<string, boolean>>({
    peanuts: false,
    gluten: false,
    dairy: false,
    shellfish: false,
  });
  const [healthGoal, setHealthGoal] = useState<string | null>("muscle");
  const [allergySearch, setAllergySearch] = useState("");

  const toggleDiet = (option: string) => {
    setDiet((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    );
  };

  const toggleAllergy = (id: string) => {
    setAllergies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleComplete = () => {
    navigate("/profile");
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="bg-background min-h-screen font-sans">
      {/* Progress Top Bar */}
      <div className="fixed top-0 left-0 w-full bg-card/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 text-orange-600 cursor-pointer group"
            >
              <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
              </div>
              <h2 className="text-2xl font-black tracking-tighter">FoodieDash</h2>
            </div>
          </div>
          <div className="w-24" />
        </div>
      </div>

      <main className="pt-24 pb-12 px-6 flex flex-col items-center">
        {/* Main Card */}
        <div className="w-full max-w-2xl bg-card rounded-[24px] border border-border overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-3">
                {t('customer:onboarding.title')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t('customer:onboarding.subtitle')}
              </p>
            </div>

            {/* AI Insight */}
            <div className="mb-10 flex items-start gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-bold text-primary">Gợi ý AI:</span> Dữ liệu này giúp chúng tôi
                lọc 100% món ăn an toàn cho bạn, đối chiếu nguyên liệu với hồ sơ riêng của bạn theo thời
                gian thực.
              </p>
            </div>

            {/* Dietary Preferences */}
            <div className="mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">
                Chế độ ăn
              </h2>
              <div className="flex flex-wrap gap-3">
                {DIET_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleDiet(opt)}
                    className={`flex h-11 items-center justify-center rounded-xl px-6 font-medium shadow-sm transition-all hover:brightness-105 active:scale-95 ${diet.includes(opt)
                      ? "text-white"
                      : "bg-muted/50 text-foreground border border-border hover:border-[var(--health)]/50"
                      }`}
                    style={diet.includes(opt) ? { backgroundColor: HEALTH_COLOR } : undefined}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Allergies & Intolerances */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4 px-1 flex-wrap gap-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Dị ứng & Không dung nạp
                </h2>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    search
                  </span>
                  <input
                    type="text"
                    value={allergySearch}
                    onChange={(e) => setAllergySearch(e.target.value)}
                    placeholder="Tìm chất gây dị ứng..."
                    className="text-xs py-1.5 pl-8 pr-4 rounded-full border border-input bg-transparent focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {ALLERGY_OPTIONS.map((a) => (
                  <label
                    key={a.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center">
                        <span className="material-symbols-outlined text-muted-foreground text-lg">
                          {a.icon}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{a.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={allergies[a.id] || false}
                      onChange={() => toggleAllergy(a.id)}
                      className="size-6 rounded-md border-input focus:ring-[var(--health)]"
                      style={{ accentColor: HEALTH_COLOR }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Health Goals */}
            <div className="mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 px-1">
                Mục tiêu sức khỏe
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {HEALTH_GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setHealthGoal(g.id)}
                    className={`flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all group ${healthGoal === g.id
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border bg-muted/30 hover:border-primary hover:bg-primary/5"
                      }`}
                  >
                    <div
                      className={`size-12 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${healthGoal === g.id ? "bg-primary" : "bg-card"
                        }`}
                    >
                      <span
                        className={`material-symbols-outlined ${healthGoal === g.id ? "text-primary-foreground" : "text-primary"
                          }`}
                      >
                        {g.icon}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Footer */}
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 h-14 rounded-xl text-muted-foreground font-bold text-base hover:bg-muted transition-colors"
              >
                {t('customer:onboarding.skip')}
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="flex-[2] h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {t('customer:onboarding.complete')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-sm text-muted-foreground text-center max-w-md">
          Dữ liệu của bạn được mã hóa và chỉ dùng để cải thiện trải nghiệm dinh dưỡng. Bạn có thể
          cập nhật cài đặt này bất cứ lúc nào trong hồ sơ.
        </p>
      </main>
    </div>
  );
};

export default OnboardingPage;
