import { clsx } from "clsx";

const STATS = [
  { label: "Voucher đang hoạt động", value: "24", trend: "+12%", icon: "confirmation_number" },
  { label: "Đã sử dụng", value: "1.842", trend: "-5%", trendDown: true, icon: "local_mall" },
  { label: "Sắp hết hạn", value: "5", sub: "Trong 7 ngày", icon: "event_busy" },
];

const VOUCHERS_MOCK = [
  { code: "SUMMER24", status: "active", statusLabel: "Đang dùng", statusColor: "bg-[#07880e]", used: 452, limit: 1000, discount: "20%", expire: "30/08/2024", enabled: true },
  { code: "WELCOME50", status: "disabled", statusLabel: "Tắt", statusColor: "bg-[#9a734c]", used: 124, limit: 500, discount: "50.000₫", expire: "12/12/2024", enabled: false },
  { code: "WEEKEND10", status: "expired", statusLabel: "Hết hạn", statusColor: "bg-[#e71008]", used: 200, limit: 200, discount: "10%", expire: "01/01/2024", enabled: false },
];

const AdminVouchers = () => {
  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap justify-between items-end gap-3 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
            Quản lý voucher
          </h2>
          <p className="text-[#9a734c] mt-1">
            Tạo, theo dõi và quản lý chiến dịch khuyến mãi.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-12 px-6 bg-[#ee8c2b] hover:bg-[#d87c24] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Tạo voucher
        </button>
      </div>

      {/* Stats - theo admin_voucher_list_management */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded-xl p-6 border border-[#e7dbcf] bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-[#9a734c] text-sm font-medium uppercase tracking-wider">{stat.label}</p>
              <span className="material-symbols-outlined text-[#ee8c2b] bg-[#ee8c2b]/10 p-2 rounded-lg">
                {stat.icon as string}
              </span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-[#1b140d] text-3xl font-bold leading-tight">{stat.value}</p>
              {stat.trend && (
                <p className={stat.trendDown ? "text-[#e71008] text-sm font-bold" : "text-[#07880e] text-sm font-bold"}>
                  {stat.trend}
                </p>
              )}
              {stat.sub && (
                <p className="text-[#ee8c2b] text-sm font-bold">{stat.sub}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar - search + filters */}
      <div className="bg-white border border-[#e7dbcf] rounded-xl overflow-hidden shadow-sm mb-4">
        <div className="flex flex-wrap justify-between items-center gap-4 p-4 border-b border-[#e7dbcf]">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative min-w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9a734c] text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm mã voucher..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#f3ede7] border-none focus:ring-2 focus:ring-[#ee8c2b]/50 text-sm text-[#1b140d] placeholder:text-[#9a734c]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f3ede7] px-4 hover:bg-[#e7dbcf] transition-colors text-sm font-medium text-[#1b140d]"
              >
                Tất cả trạng thái
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#f3ede7] px-4 hover:bg-[#e7dbcf] transition-colors text-sm font-medium text-[#1b140d]"
              >
                Tất cả danh mục
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="p-2 text-[#1b140d] hover:bg-[#f3ede7] rounded-lg transition-colors"
              title="Lọc"
            >
              <span className="material-symbols-outlined">filter_list</span>
            </button>
            <button
              type="button"
              className="p-2 text-[#1b140d] hover:bg-[#f3ede7] rounded-lg transition-colors"
              title="Tải xuống"
            >
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        </div>

        {/* Table - với cột Usage progress, Status dot, toggle bật/tắt */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfaf8] border-b border-[#e7dbcf]">
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">Mã voucher</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">Lượt dùng</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">Giá trị giảm</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">Hết hạn</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7dbcf]">
              {VOUCHERS_MOCK.map((v) => {
                const pct = v.limit ? Math.round((v.used / v.limit) * 100) : 0;
                return (
                  <tr key={v.code} className="hover:bg-[#ee8c2b]/5 transition-colors">
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-[#f3ede7] rounded text-sm font-mono font-bold text-[#1b140d] border border-[#e7dbcf]">
                        {v.code}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={clsx("size-2 rounded-full", v.statusColor)} />
                        <span
                          className={
                            v.status === "active"
                              ? "text-sm font-semibold text-[#07880e]"
                              : v.status === "expired"
                                ? "text-sm font-semibold text-[#e71008]"
                                : "text-sm font-semibold text-[#9a734c]"
                          }
                        >
                          {v.statusLabel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1 min-w-[120px]">
                        <div className="flex justify-between text-xs font-medium text-[#1b140d]">
                          <span>{v.used} / {v.limit}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#f3ede7] rounded-full overflow-hidden">
                          <div
                            className={clsx("h-full rounded-full", v.status === "expired" ? "bg-red-500" : "bg-[#ee8c2b]")}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-sm text-[#1b140d]">{v.discount}</td>
                    <td className="px-6 py-5 text-sm text-[#9a734c]">{v.expire}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        <div className="flex items-center gap-2 pr-4 border-r border-[#e7dbcf]">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={v.enabled}
                              disabled={v.status === "expired"}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-[#e7dbcf] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#ee8c2b] peer-disabled:opacity-50" />
                          </label>
                        </div>
                        <button type="button" className="p-1 hover:text-[#ee8c2b] transition-colors" title="Sửa">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button type="button" className="p-1 hover:text-[#e71008] transition-colors" title="Xóa">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-between border-t border-[#e7dbcf] bg-[#fcfaf8]">
          <p className="text-sm text-[#9a734c]">Hiển thị 1 đến 3 trong 24 kết quả</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors disabled:opacity-50"
              disabled
            >
              Trước
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-[#ee8c2b] text-white text-sm font-bold shadow-sm"
            >
              1
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors"
            >
              2
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors"
            >
              3
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminVouchers;
