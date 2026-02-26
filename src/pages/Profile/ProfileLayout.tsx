import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Profile Overview & Navigation */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Profile Card */}
            <div className="bg-card rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/10 to-transparent" />
              <div className="relative mb-4">
                <div
                  className="size-28 rounded-full bg-cover bg-center border-4 border-card shadow-md"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv4PSDDhCtUBfVmS8ouPp1wu7J68i3dBlwrZZaxiPuTY84XYLSLFprJ9p1RGVfq2YZ01-vr3JRZXiPYzp13HQoDKApebF1pj3y7qQ_z3VTOHAuVCnmUu8Ciym319lPFLa4wx5-qmxhGSOdOHqgHbNckj6E3Nf04mx7tVoFmyNEyfhOBjqjo9TM_3q05JfnfGCvt_S0sEuUdhrP0LvnnF7pu9ii6-KtKBAF2gsi2dKSpszo9ppz9QWS1kbcEMcLtusOJ9RCtyTDPPc')`,
                  }}
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-card shadow-sm hover:scale-105 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
              </div>
              <h2 className="text-2xl font-bold mb-1">Nguyễn Văn A</h2>
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

            {/* Navigation Menu */}
            <nav className="bg-card rounded-2xl p-3 shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border flex flex-col gap-1">
              <NavLink
                to="/profile"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                    >
                      person
                    </span>
                    Hồ sơ & Sức khỏe
                  </>
                )}
              </NavLink>
              <NavLink
                to="/profile/history"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}>
                      receipt_long
                    </span>
                    Lịch sử đơn hàng
                  </>
                )}
              </NavLink>
              <NavLink
                to="/profile/favorites"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}>
                      favorite
                    </span>
                    Món yêu thích
                  </>
                )}
              </NavLink>
              <NavLink
                to="/profile/wallet"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}>
                      confirmation_number
                    </span>
                    Ví Voucher
                  </>
                )}
              </NavLink>
              <NavLink
                to="/addresses"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                <span className="material-symbols-outlined">location_on</span>
                Địa chỉ
              </NavLink>
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

          {/* RIGHT COLUMN: Tab content */}
          <section className="lg:col-span-8 space-y-8">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
