import { useState } from "react";
import { clsx } from "clsx";

const ORDER_TABS = [
  { id: "all", label: "Tất cả đơn", count: 128 },
  { id: "pending", label: "Chờ xử lý", count: 12 },
  { id: "preparing", label: "Đang chế biến", count: 24 },
  { id: "ready", label: "Sẵn sàng lấy", count: 8 },
  { id: "delivered", label: "Đã giao", count: 84 },
];

const ORDERS_MOCK = [
  { id: "ORD-7721", time: "Hôm nay, 12:45", customer: "Nguyễn Thị A", items: 3, total: "1.360.000₫", status: "preparing", statusLabel: "Đang chế biến", statusClass: "bg-blue-100 text-blue-700", isNew: true },
  { id: "ORD-7722", time: "Hôm nay, 12:38", customer: "Trần Văn B", items: 1, total: "582.000₫", status: "pending", statusLabel: "Chờ xử lý", statusClass: "bg-amber-100 text-amber-700", isNew: false },
  { id: "ORD-7723", time: "Hôm nay, 12:30", customer: "Lê Thị C", items: 5, total: "1.760.000₫", status: "ready", statusLabel: "Sẵn sàng", statusClass: "bg-green-100 text-green-700", isNew: false },
  { id: "ORD-7724", time: "Hôm nay, 12:15", customer: "Phạm Văn D", items: 2, total: "996.000₫", status: "delivered", statusLabel: "Đã giao", statusClass: "bg-gray-100 text-gray-600", isNew: false },
];

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
            Quản lý đơn hàng
          </h2>
          <p className="text-[#9a734c] mt-1">
            Kiểm soát luồng đơn hàng theo thời gian thực.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e7dbcf] rounded-lg text-sm font-semibold text-[#1b140d] hover:bg-[#f3ede7]"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Xuất dữ liệu
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm shadow-[#ee8c2b]/20 hover:bg-[#d87c24]"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Tạo đơn thủ công
          </button>
          <div className="flex bg-white rounded-lg border border-[#e7dbcf] p-1">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={clsx("p-2 rounded-md transition-colors", viewMode === "table" ? "bg-[#ee8c2b]/10 text-[#ee8c2b]" : "text-[#9a734c] hover:bg-[#f3ede7]")}
              title="Xem bảng"
            >
              <span className="material-symbols-outlined text-[20px]">table_chart</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={clsx("p-2 rounded-md transition-colors", viewMode === "kanban" ? "bg-[#ee8c2b]/10 text-[#ee8c2b]" : "text-[#9a734c] hover:bg-[#f3ede7]")}
              title="Xem bảng kanban"
            >
              <span className="material-symbols-outlined text-[20px]">view_kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status tabs */}
      <div className="border-b border-[#e7dbcf] mb-6">
        <div className="flex gap-8 overflow-x-auto">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "pb-4 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "border-[#ee8c2b] text-[#ee8c2b] font-bold"
                  : "border-transparent text-[#9a734c] hover:text-[#1b140d]"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white border border-[#e7dbcf] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfaf8] text-[#9a734c] text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4 text-center">Số món</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Tổng tiền</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7dbcf]">
                {ORDERS_MOCK.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcfaf8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1b140d]">#{order.id}</span>
                        {order.isNew && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Đơn mới" />
                        )}
                      </div>
                      <p className="text-[10px] text-[#9a734c] mt-0.5">{order.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-xs">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-[#1b140d]">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs bg-[#f3ede7] px-2 py-1 rounded font-bold">{order.items} món</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold", order.statusClass)}>
                        {order.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#1b140d]">{order.total}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button type="button" className="p-1.5 text-[#9a734c] hover:bg-gray-100 rounded" title="In hóa đơn">
                          <span className="material-symbols-outlined text-xl">print</span>
                        </button>
                        <button type="button" className="p-1.5 text-[#9a734c] hover:bg-gray-100 rounded" title="Sửa đơn">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        {order.status === "pending" && (
                          <button type="button" className="ml-2 px-3 py-1.5 bg-[#ee8c2b] text-white text-xs font-bold rounded shadow-sm hover:bg-[#d87c24]">
                            Chấp nhận
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button type="button" className="ml-2 px-3 py-1.5 bg-[#ee8c2b] text-white text-xs font-bold rounded shadow-sm hover:bg-[#d87c24]">
                            Sẵn sàng
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button type="button" className="ml-2 px-3 py-1.5 bg-[#1b140d] text-white text-xs font-bold rounded shadow-sm hover:bg-black">
                            Giao hàng
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-min">
            {[
              { title: "Chờ xử lý", status: ["pending"], color: "amber", count: 5 },
              { title: "Đang chế biến", status: ["preparing"], color: "blue", count: 3 },
              { title: "Sẵn sàng", status: ["ready"], color: "green", count: 2 },
              { title: "Đã giao", status: ["delivered"], color: "gray", count: 8 },
            ].map((column) => (
              <div key={column.title} className="flex flex-col bg-black/5 rounded-xl p-3 min-h-[500px]">
                <div className="px-2 py-3 flex justify-between items-center mb-3">
                  <h3 className="text-base font-bold text-[#1b140d] flex items-center gap-2">
                    {column.title}
                    <span className={clsx("text-xs px-2 py-1 rounded-full font-bold", `bg-${column.color}-100 text-${column.color}-700`)}>
                      {column.count}
                    </span>
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 px-1 pb-2">
                  {ORDERS_MOCK.filter((o) => column.status.includes(o.status)).map((card) => (
                    <div
                      key={card.id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-[#e7dbcf] hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1b140d] text-sm">#{card.id}</span>
                          {card.isNew && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Đơn mới" />
                          )}
                        </div>
                        <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full", card.statusClass)}>
                          {card.statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-xs">
                          {card.customer.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1b140d] truncate">{card.customer}</p>
                          <p className="text-[10px] text-[#9a734c]">{card.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#e7dbcf]">
                        <span className="text-xs text-[#9a734c]">{card.items} món</span>
                        <span className="text-sm font-bold text-[#1b140d]">{card.total}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.status === "pending" && (
                          <button type="button" className="flex-1 px-3 py-2 bg-[#ee8c2b] text-white text-xs font-bold rounded-lg hover:bg-[#d87c24] transition-colors">
                            Chấp nhận
                          </button>
                        )}
                        {card.status === "preparing" && (
                          <button type="button" className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors">
                            Sẵn sàng
                          </button>
                        )}
                        {card.status === "ready" && (
                          <button type="button" className="flex-1 px-3 py-2 bg-[#1b140d] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">
                            Giao hàng
                          </button>
                        )}
                        <button type="button" className="px-3 py-2 border border-[#e7dbcf] rounded-lg hover:bg-[#f3ede7] transition-colors" title="Chi tiết">
                          <span className="material-symbols-outlined text-[#9a734c] text-lg">visibility</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
