import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import { apiClient } from "@/lib/api-client";

const HEALTH_COLOR = "var(--health)";
const DIET_OPTIONS: { id: string; label: string; checked: boolean }[] = [
  { id: "vegetarian", label: "Ăn chay", checked: true },
  { id: "vegan", label: "Thuần chay", checked: false },
  { id: "keto", label: "Keto", checked: false },
  { id: "paleo", label: "Paleo", checked: false },
  { id: "gluten-free", label: "Không gluten", checked: true },
  { id: "pescatarian", label: "Ăn cá", checked: false },
];
const ALLERGY_OPTIONS: { id: string; label: string; icon: string; colorClass: string; checked: boolean }[] = [
  { id: "peanuts", label: "Đậu phộng", icon: "spa", colorClass: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400", checked: false },
  { id: "shellfish", label: "Hải sản có vỏ", icon: "set_meal", colorClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400", checked: true },
  { id: "eggs", label: "Trứng", icon: "egg", colorClass: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400", checked: false },
  { id: "dairy", label: "Sữa", icon: "water_drop", colorClass: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600", checked: false },
  { id: "wheat", label: "Lúa mì", icon: "grain", colorClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400", checked: false },
  { id: "soy", label: "Đậu nành", icon: "grass", colorClass: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400", checked: false },
];

const ProfileSettingsPage = () => {
  const { t } = useTranslation(["customer", "common"]);
  const { user, getUser } = useAuthStore();
  const { toast } = useToast();

  // Profile state (from develop — robust)
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [initial, setInitial] = useState<{ username: string; phone: string }>({ username: "", phone: "" });

  // Health profile state (from feature branch)
  const [diet, setDiet] = useState(DIET_OPTIONS.map((d) => ({ ...d, checked: false })));
  const [allergies, setAllergies] = useState(ALLERGY_OPTIONS.map((a) => ({ ...a, checked: false })));

  const normalize = (v: string) => v.trim();
  const isDirty =
    normalize(username) !== normalize(initial.username) ||
    normalize(phone) !== normalize(initial.phone);

  // Load user data from authStore
  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setInitial({ username: user.username || "", phone: user.phone || "" });

      // Apply health profile if exists
      const hp = user.healthProfile;
      if (hp) {
        setAllergies((prev) =>
          prev.map((a) => ({ ...a, checked: hp.allergies.includes(a.id) || hp.allergies.includes(a.label) }))
        );
        setDiet((prev) =>
          prev.map((d) => ({ ...d, checked: hp.dietaryGoals.includes(d.id) || hp.dietaryGoals.includes(d.label) }))
        );
      }
    }
  }, [user]);

  const toggleDiet = (id: string) => setDiet((prev) => prev.map((d) => (d.id === id ? { ...d, checked: !d.checked } : d)));
  const toggleAllergy = (id: string) => setAllergies((prev) => prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)));

  // Update profile info (username + phone)
  const onUpdateProfile = async () => {
    try {
      setSaving(true);
      setError(null);

      await apiClient.patch("/user/me", {
        username: username.trim(),
        phone: phone.trim() || undefined,
      });

      setInitial({ username: username.trim(), phone: phone.trim() });
      await getUser(); // Refresh global auth state
      toast(t("customer:profileSettings.updateSuccess"), "success");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Cập nhật thông tin không thành công";
      setError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  // Update health profile (allergies + dietary goals)
  const handleUpdateHealth = async () => {
    try {
      setSaving(true);
      setError(null);

      const updatedHealthProfile = {
        allergies: allergies.filter((a) => a.checked).map((a) => a.label),
        conditions: user?.healthProfile?.conditions || [],
        dietaryGoals: diet.filter((d) => d.checked).map((d) => d.label),
      };

      await apiClient.patch("/user/me", { healthProfile: updatedHealthProfile });
      await getUser();
      toast("Cập nhật hồ sơ sức khỏe thành công", "success");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Cập nhật thất bại";
      setError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
          {t("customer:profileSettings.title")}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t("customer:profileSettings.subtitle")}
        </p>
      </div>

      <div className="space-y-8">
        {/* Personal Info Card */}
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold mb-1">{t("customer:profileSettings.personalInfo")}</h3>
              <p className="text-muted-foreground text-sm">{t("customer:profileSettings.personalInfoDesc")}</p>
            </div>
            <div className="p-2 bg-accent rounded-full text-foreground">
              <span className="material-symbols-outlined">badge</span>
            </div>
          </div>

          {error && (
            <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-2xl px-5 py-4 mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-semibold ml-1">Username</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">person</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading || saving}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                  placeholder="Nhập username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">{t("customer:profileSettings.email")}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">mail</span>
                <input type="email" value={email} readOnly
                  className="w-full pl-12 pr-4 py-3.5 bg-muted/40 border border-input rounded-2xl text-foreground cursor-not-allowed"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">{t("customer:profileSettings.phone")}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">call</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading || saving}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-input rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-foreground placeholder:text-muted-foreground disabled:opacity-70"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>
          </div>

          {/* Profile action buttons — only show when dirty */}
          {isDirty && (
            <div className="flex flex-col md:flex-row md:justify-end gap-4 pt-6">
              <button
                type="button"
                className="bg-background text-foreground px-8 py-4 rounded-2xl font-bold border border-border hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                onClick={() => { setUsername(initial.username); setPhone(initial.phone); setError(null); }}
                disabled={saving}
              >
                {t("customer:profileSettings.cancel")}
              </button>
              <button
                type="button"
                onClick={onUpdateProfile}
                disabled={loading || saving || username.trim().length === 0}
                className="bg-primary disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
              >
                <span>{saving ? "Đang lưu..." : t("customer:profileSettings.updateProfile")}</span>
                <span className="material-symbols-outlined">check_circle</span>
              </button>
            </div>
          )}
        </div>

        {/* AI Health Profile Card */}
        <div className="bg-card rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50"
            style={{ backgroundColor: "color-mix(in srgb, var(--health) 20%, transparent)" }}
          />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold">{t("customer:profileSettings.aiHealthProfile")}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--health) 15%, transparent)",
                    color: "var(--health)",
                    borderColor: "color-mix(in srgb, var(--health) 30%, transparent)",
                  }}
                >Beta</span>
              </div>
              <p className="text-muted-foreground text-sm mb-2">AI sẽ gợi ý thực đơn dựa trên các tùy chọn của bạn.</p>
              <Link to="/ai-suggestions" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: "var(--health)" }}>
                <span className="material-symbols-outlined text-base">restaurant</span>
                Xem gợi ý món ăn phù hợp
              </Link>
            </div>
            <div className="p-2 rounded-full" style={{ backgroundColor: "color-mix(in srgb, var(--health) 15%, transparent)", color: "var(--health)" }}>
              <span className="material-symbols-outlined">health_and_safety</span>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-10">
            <label className="text-sm font-semibold mb-4 block">{t("customer:profileSettings.dietaryPreferences")}</label>
            <div className="flex flex-wrap gap-3">
              {diet.map((d) => (
                <label key={d.id} className="cursor-pointer">
                  <input type="checkbox" checked={d.checked} onChange={() => toggleDiet(d.id)} className="sr-only peer" />
                  <span className={`px-5 py-2.5 rounded-xl border font-medium transition-all peer-checked:shadow-md hover:border-[var(--health)]/50 ${d.checked ? "border-[var(--health)] text-white shadow-[var(--health)]/20" : "border-input bg-background text-muted-foreground"}`}
                    style={d.checked ? { backgroundColor: HEALTH_COLOR, boxShadow: `0 4px 14px color-mix(in srgb, var(--health) 25%, transparent)` } : undefined}
                  >{d.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-border w-full mb-8" />

          {/* Allergies */}
          <div>
            <label className="text-sm font-semibold mb-4 block">{t("customer:profileSettings.allergies")}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allergies.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-xl bg-background border border-transparent hover:border-[var(--health)]/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-full flex items-center justify-center ${a.colorClass}`}>
                      <span className="material-symbols-outlined text-sm">{a.icon}</span>
                    </div>
                    <span className="font-medium text-sm">{a.label}</span>
                  </div>
                  <label className="flex items-center cursor-pointer relative">
                    <input type="checkbox" checked={a.checked} onChange={() => toggleAllergy(a.id)} className="sr-only peer" />
                    <div className="w-11 h-6 rounded-full peer-focus:outline-none relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-gray-300 peer-checked:after:translate-x-5 bg-muted"
                      style={{ backgroundColor: a.checked ? HEALTH_COLOR : undefined }}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Health profile save button */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={handleUpdateHealth}
              disabled={saving}
              className="bg-primary disabled:opacity-60 hover:bg-primary/90 text-primary-foreground px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all flex items-center justify-center gap-2"
            >
              <span>{saving ? "Đang lưu..." : "Lưu hồ sơ sức khỏe"}</span>
              <span className="material-symbols-outlined">health_and_safety</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSettingsPage;
