import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/authStore";
import type { AuthAddress } from "@/store/authStore";
import { userService } from "@/services/profile.service";
import { AddressModal, LABEL_OPTIONS, LABEL_ICON_BG } from "@/components/shared/AddressModal";
import type { AddressLabel } from "@/components/shared/AddressModal";

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
    setEditIndex(null);
    setError(null);
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    setEditIndex(idx);
    setError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditIndex(null);
    setError(null);
  };

  const handleSave = async (newAddr: AuthAddress) => {
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
      <AddressModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        initialData={editIndex !== null ? addresses[editIndex] : null}
        isFirstAddress={addresses.length === 0}
      />
    </div>
  );
};

export default AddressesPage;
