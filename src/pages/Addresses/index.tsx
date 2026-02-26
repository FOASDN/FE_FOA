import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type AddressLabel = "home" | "work" | "other";

interface Address {
  id: string;
  label: AddressLabel;
  labelText: string;
  address: string;
  isDefault: boolean;
  icon: string;
  iconBgClass: string;
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "1",
    label: "home",
    labelText: "Nhà",
    address: "123 Đường Ngon, Quận 1, TP.HCM",
    isDefault: true,
    icon: "home",
    iconBgClass: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
  },
  {
    id: "2",
    label: "work",
    labelText: "Cơ quan",
    address: "456 Đại lộ Doanh nghiệp, Tầng 2, Quận 3, TP.HCM",
    isDefault: false,
    icon: "work",
    iconBgClass: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
  {
    id: "3",
    label: "other",
    labelText: "Phòng gym",
    address: "789 Đường Thể thao, Quận 7, TP.HCM",
    isDefault: false,
    icon: "fitness_center",
    iconBgClass: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
  },
];

const LABEL_OPTIONS: { value: AddressLabel; text: string }[] = [
  { value: "home", text: "Nhà" },
  { value: "work", text: "Cơ quan" },
  { value: "other", text: "Khác" },
];

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
      <h2 className="text-2xl font-bold mb-1">Alex Johnson</h2>
      <p className="text-muted-foreground text-sm mb-4">Thành viên từ 2021</p>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
        <span className="material-symbols-outlined text-sm">stars</span>
        Thực khách Bạch kim
      </div>
      <div className="grid grid-cols-3 gap-4 w-full border-t border-border pt-6">
        <div>
          <p className="text-xl font-bold">142</p>
          <p className="text-xs text-muted-foreground uppercase font-medium">Đơn hàng</p>
        </div>
        <div>
          <p className="text-xl font-bold">28</p>
          <p className="text-xs text-muted-foreground uppercase font-medium">Đánh giá</p>
        </div>
        <div>
          <p className="text-xl font-bold">12</p>
          <p className="text-xs text-muted-foreground uppercase font-medium">Đã lưu</p>
        </div>
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
        to="/favorites"
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <span className="material-symbols-outlined">favorite</span>
        Món yêu thích
      </Link>
      <Link
        to="#"
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
      >
        <span className="material-symbols-outlined">credit_card</span>
        Phương thức thanh toán
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
      <div className="h-px bg-border mx-4 my-2" />
      <button
        type="button"
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 font-medium transition-colors w-full text-left"
      >
        <span className="material-symbols-outlined">logout</span>
        Đăng xuất
      </button>
    </nav>
  </aside>
);

const AddressesPage = () => {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const { t } = useTranslation(['customer', 'common']);
  const [modalOpen, setModalOpen] = useState(false);
  const [formLabel, setFormLabel] = useState<AddressLabel>("home");
  const [formAddress, setFormAddress] = useState("");
  const [formApt, setFormApt] = useState("");
  const [formZip, setFormZip] = useState("");
  const [formDefault, setFormDefault] = useState(false);

  const openAddModal = () => {
    setFormLabel("home");
    setFormAddress("");
    setFormApt("");
    setFormZip("");
    setFormDefault(false);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSaveAddress = () => {
    const labelText = LABEL_OPTIONS.find((o) => o.value === formLabel)?.text ?? formLabel;
    const icon =
      formLabel === "home" ? "home" : formLabel === "work" ? "work" : "fitness_center";
    const iconBgClass =
      formLabel === "home"
        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        : formLabel === "work"
          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
          : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
    const fullAddress = [formAddress, formApt ? `Căn hộ ${formApt}` : "", formZip]
      .filter(Boolean)
      .join(", ");
    const newId = String(Date.now());
    setAddresses((prev) => {
      const newAddr = {
        id: newId,
        label: formLabel,
        labelText,
        address: fullAddress || "(Chưa nhập địa chỉ)",
        isDefault: formDefault || prev.length === 0,
        icon,
        iconBgClass,
      };
      const next = [...prev, newAddr];
      if (formDefault) {
        return next.map((a) => ({ ...a, isDefault: a.id === newId }));
      }
      return next;
    });
    closeModal();
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const next = prev.filter((a) => a.id !== id);
      const wasDefault = prev.find((a) => a.id === id)?.isDefault;
      if (wasDefault && next.length > 0 && !next.some((a) => a.isDefault)) {
        next[0].isDefault = true;
      }
      return next;
    });
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <ProfileSidebar />

          <section className="lg:col-span-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                {t('customer:addresses.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('customer:addresses.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="group relative flex flex-col justify-between p-6 bg-card rounded-xl shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center size-10 rounded-full ${addr.iconBgClass}`}
                        >
                          <span className="material-symbols-outlined">{addr.icon}</span>
                        </div>
                        <h3 className="font-bold text-lg text-foreground">{addr.labelText}</h3>
                      </div>
                      {addr.isDefault && (
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--health) 15%, transparent)",
                            color: "var(--health)",
                          }}
                        >
                          {t('customer:addresses.default')}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                      {addr.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button
                      type="button"
                      className="flex-1 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent transition-colors"
                    >
                      {t('customer:addresses.edit')}
                    </button>
                    <div className="w-px h-4 bg-border" />
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      {t('customer:addresses.delete')}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={openAddModal}
                className="group flex flex-col items-center justify-center p-6 min-h-[200px] rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-center size-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
                    add
                  </span>
                </div>
                <span className="text-primary font-bold text-lg">{t('customer:addresses.addAddress')}</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Modal Thêm địa chỉ */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
        >
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-2xl bg-card text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-border">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground" id="modal-title">
                  {t('customer:addresses.addNewAddress')}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6">
                <div className="relative w-full h-40 rounded-xl overflow-hidden mb-6 bg-muted flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    location_on
                  </span>
                  <span className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground">
                    Chọn vị trí trên bản đồ
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('customer:addresses.addressType')}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {LABEL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormLabel(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${formLabel === opt.value
                            ? "border border-primary bg-primary/10 text-primary"
                            : "border border-input text-muted-foreground hover:border-border"
                            }`}
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {t('customer:addresses.address')}
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">
                        search
                      </span>
                      <input
                        type="text"
                        value={formAddress}
                        onChange={(e) => setFormAddress(e.target.value)}
                        placeholder="Tìm kiếm địa chỉ..."
                        className="block w-full rounded-lg border border-input py-2.5 pl-10 pr-4 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('customer:addresses.apartment')}
                      </label>
                      <input
                        type="text"
                        value={formApt}
                        onChange={(e) => setFormApt(e.target.value)}
                        className="block w-full rounded-lg border border-input py-2.5 px-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        {t('customer:addresses.zipCode')}
                      </label>
                      <input
                        type="text"
                        value={formZip}
                        onChange={(e) => setFormZip(e.target.value)}
                        className="block w-full rounded-lg border border-input py-2.5 px-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDefault}
                      onChange={(e) => setFormDefault(e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary bg-background"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t('customer:addresses.setDefault')}
                    </span>
                  </label>
                </div>
              </div>
              <div className="bg-muted/50 px-6 py-4 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
                >
                  {t('customer:addresses.saveAddress')}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex justify-center rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-foreground border border-border hover:bg-accent transition-colors"
                >
                  {t('common:actions.cancel')}
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
