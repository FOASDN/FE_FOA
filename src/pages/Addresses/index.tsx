import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import type { AuthAddress } from "@/store/authStore";
import { userService } from "@/services/profile.service";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

type AddressLabel = "home" | "work" | "other";

interface AddressForm {
  label: AddressLabel;
  receiver_name: string;
  phone: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressForm = {
  label: "home",
  receiver_name: "",
  phone: "",
  detail: "",
  ward: "",
  district: "",
  city: "",
  isDefault: false,
};

const LABEL_OPTIONS: { value: AddressLabel; text: string; icon: string }[] = [
  { value: "home", text: "Nhà", icon: "home" },
  { value: "work", text: "Cơ quan", icon: "work" },
  { value: "other", text: "Khác", icon: "fitness_center" },
];

const LABEL_ICON_BG: Record<AddressLabel, string> = {
  home: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  work: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  other:
    "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
};

// ────────────────────────────────────────────────────────────────────────────
// Sidebar
// ────────────────────────────────────────────────────────────────────────────

const ProfileSidebar = () => (
  <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
    <div className="bg-card rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="relative mb-4">
        <div
          className="size-28 rounded-full bg-cover bg-center border-4 border-card shadow-md"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv4PSDDhCtUBfVmS8ouPp1wu7J68i3dBlwrZZaxiPuTY84XYLSLFprJ9p1RGVfq2YZ01-vr3JRZXiPYzp13HQoDKApebF1pj3y7qQ_z3VTOHAuVCnmUu8Ciym319lPFLa4wx5-qmxhGSOdOHqgHbNckj6E3Nf04mx7tVoFmyNEyfhOBjqjo9TM_3q05JfnfGCvt_S0sEuUdhrP0LvnnF7pu9ii6-KtKBAF2gsi2dKSpszo9ppz9QWS1kbcEMcLtusOJ9RCtyTDPPc')`,
          }}
        />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
        <span className="material-symbols-outlined text-sm">stars</span>
        Thực khách Bạch kim
      </div>
    </div>
    <nav className="bg-card rounded-2xl p-3 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border flex flex-col gap-1">
      <Link
        to="/profile"
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <span className="material-symbols-outlined">person</span>
        Hồ sơ & Sức khỏe
      </Link>
      <Link
        to="/profile/history"
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <span className="material-symbols-outlined">receipt_long</span>
        Lịch sử đơn hàng
      </Link>
      <Link
        to="/addresses"
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent text-foreground font-medium transition-colors"
      >
        <span
          className="material-symbols-outlined text-primary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          location_on
        </span>
        Địa chỉ
      </Link>
    </nav>
  </aside>
);

// ────────────────────────────────────────────────────────────────────────────
// Main Page
// ────────────────────────────────────────────────────────────────────────────

const AddressesPage = () => {
  const { t } = useTranslation(["customer", "common"]);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Local copy of addresses for display; synced from authStore
  const [addresses, setAddresses] = useState<AuthAddress[]>(
    user?.addresses ?? [],
  );

  // Keep in sync if authStore changes (e.g. from another tab or getUser call)
  useEffect(() => {
    setAddresses(user?.addresses ?? []);
  }, [user?.addresses]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null); // null = add mode
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Save addresses to BE, update authStore ────────────────────────────────
  const persistAddresses = async (updated: AuthAddress[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await userService.updateMe({ addresses: updated });
      // BE returns the full updated user — sync authStore so checkout sees the change
      const updatedUser = res.data?.data as any;
      if (updatedUser && user) {
        setUser({ ...user, addresses: updatedUser.addresses ?? updated });
      }
      setAddresses(updated);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        "Lưu địa chỉ thất bại. Vui lòng thử lại.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Modal helpers ─────────────────────────────────────────────────────────
  const openAddModal = () => {
    setForm({ ...EMPTY_FORM, isDefault: addresses.length === 0 });
    setEditIndex(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    const a = addresses[idx];
    setForm({
      label: (a.label as AddressLabel) ?? "home",
      receiver_name: a.receiver_name,
      phone: a.phone,
      detail: a.detail,
      ward: a.ward,
      district: a.district,
      city: a.city,
      isDefault: a.isDefault,
    });
    setEditIndex(idx);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditIndex(null);
    setError(null);
  };

  const handleSave = async () => {
    // Basic validation
    if (!form.receiver_name.trim()) {
      setError("Vui lòng nhập tên người nhận");
      return;
    }
    if (!form.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }
    if (!form.detail.trim()) {
      setError("Vui lòng nhập địa chỉ chi tiết");
      return;
    }
    if (!form.ward.trim()) {
      setError("Vui lòng nhập phường/xã");
      return;
    }
    if (!form.district.trim()) {
      setError("Vui lòng nhập quận/huyện");
      return;
    }
    if (!form.city.trim()) {
      setError("Vui lòng nhập thành phố");
      return;
    }

    const newAddr: AuthAddress = {
      label: form.label,
      receiver_name: form.receiver_name.trim(),
      phone: form.phone.trim(),
      detail: form.detail.trim(),
      ward: form.ward.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      isDefault: form.isDefault,
    };

    let updated: AuthAddress[];

    if (editIndex !== null) {
      // Edit existing
      updated = addresses.map((a, i) => (i === editIndex ? newAddr : a));
    } else {
      // Add new
      updated = [...addresses, newAddr];
    }

    // Normalize: only one default
    if (newAddr.isDefault) {
      updated = updated.map((a, i) => ({
        ...a,
        isDefault:
          editIndex !== null ? i === editIndex : i === updated.length - 1,
      }));
    } else if (!updated.some((a) => a.isDefault) && updated.length > 0) {
      // Auto-set first as default if none selected
      updated[0] = { ...updated[0], isDefault: true };
    }

    await persistAddresses(updated);
    closeModal();
  };

  const handleDelete = async (idx: number) => {
    const updated = addresses.filter((_, i) => i !== idx);
    // If we deleted the default and there are remaining addresses, assign first as default
    if (addresses[idx].isDefault && updated.length > 0) {
      updated[0] = { ...updated[0], isDefault: true };
    }
    await persistAddresses(updated);
  };

  const handleSetDefault = async (idx: number) => {
    const updated = addresses.map((a, i) => ({ ...a, isDefault: i === idx }));
    await persistAddresses(updated);
  };

  const setField = <K extends keyof AddressForm>(
    key: K,
    val: AddressForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ProfileSidebar />

          <section className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                {t("customer:addresses.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("customer:addresses.subtitle")}
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">
                  error
                </span>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {addresses.map((addr, idx) => {
                const labelKey = (addr.label as AddressLabel) ?? "other";
                const opt =
                  LABEL_OPTIONS.find((o) => o.value === labelKey) ??
                  LABEL_OPTIONS[2];
                return (
                  <div
                    key={idx}
                    className="group relative flex flex-col justify-between p-6 bg-card rounded-xl shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex items-center justify-center size-10 rounded-full ${LABEL_ICON_BG[labelKey]}`}
                          >
                            <span className="material-symbols-outlined">
                              {opt.icon}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-foreground">
                            {opt.text}
                          </h3>
                        </div>
                        {addr.isDefault && (
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                            style={{
                              backgroundColor:
                                "color-mix(in srgb, var(--health) 15%, transparent)",
                              color: "var(--health)",
                            }}
                          >
                            {t("customer:addresses.default")}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-sm mb-1">
                        {addr.receiver_name} · {addr.phone}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {addr.detail}, {addr.ward}, {addr.district}, {addr.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-4 border-t border-border flex-wrap">
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(idx)}
                          disabled={saving}
                          className="text-xs font-medium text-primary hover:underline disabled:opacity-50"
                        >
                          Đặt mặc định
                        </button>
                      )}
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={() => openEditModal(idx)}
                        className="py-1.5 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                      >
                        {t("customer:addresses.edit")}
                      </button>
                      <div className="w-px h-4 bg-border" />
                      <button
                        type="button"
                        onClick={() => handleDelete(idx)}
                        disabled={saving}
                        className="py-1.5 px-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
                      >
                        {t("customer:addresses.delete")}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add new card */}
              <button
                type="button"
                onClick={openAddModal}
                className="group flex flex-col items-center justify-center p-6 min-h-[200px] rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 32 }}
                  >
                    add
                  </span>
                </div>
                <span className="text-primary font-bold text-lg">
                  {t("customer:addresses.addAddress")}
                </span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border animate-in zoom-in-95 fade-in duration-200">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">
                  {editIndex !== null
                    ? "Chỉnh sửa địa chỉ"
                    : t("customer:addresses.addNewAddress")}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Error trong modal */}
                {error && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {error}
                  </p>
                )}

                {/* Label type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("customer:addresses.addressType")}
                  </label>
                  <div className="flex gap-2">
                    {LABEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setField("label", opt.value)}
                        className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          form.label === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {opt.icon}
                        </span>
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Receiver name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Tên người nhận *
                    </label>
                    <input
                      type="text"
                      value={form.receiver_name}
                      onChange={(e) =>
                        setField("receiver_name", e.target.value)
                      }
                      placeholder="Nguyễn Văn A"
                      className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      placeholder="0901234567"
                      className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Detail */}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Địa chỉ chi tiết (số nhà, tên đường) *
                  </label>
                  <input
                    type="text"
                    value={form.detail}
                    onChange={(e) => setField("detail", e.target.value)}
                    placeholder="123 Đường Lê Lợi"
                    className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Ward / District / City */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Phường/Xã *
                    </label>
                    <input
                      type="text"
                      value={form.ward}
                      onChange={(e) => setField("ward", e.target.value)}
                      placeholder="Phường 1"
                      className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Quận/Huyện *
                    </label>
                    <input
                      type="text"
                      value={form.district}
                      onChange={(e) => setField("district", e.target.value)}
                      placeholder="Quận 1"
                      className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Thành phố *
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="TP.HCM"
                      className="block w-full rounded-lg border border-input py-2 px-3 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Set default */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setField("isDefault", e.target.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">
                    {t("customer:addresses.setDefault")}
                  </span>
                </label>
              </div>

              <div className="bg-muted/50 px-6 py-4 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving && (
                    <span className="material-symbols-outlined animate-spin text-sm">
                      progress_activity
                    </span>
                  )}
                  {t("customer:addresses.saveAddress")}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="inline-flex justify-center rounded-lg bg-background px-5 py-2.5 text-sm font-semibold text-foreground border border-border hover:bg-accent transition-colors disabled:opacity-60"
                >
                  {t("common:actions.cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressesPage;
