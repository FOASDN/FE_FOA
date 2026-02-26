import { useState } from "react";
import { clsx } from "clsx";

const MENU_MOCK = [
  { id: "1", name: "Burger Gà Cay", description: "Sốt cay, rau xanh, phô mai", category: "Món chính", price: "415.000₫", rating: 4.9, isAvailable: true },
  { id: "2", name: "Pizza Margherita", description: "Cà chua, mozzarella, húng quế", category: "Món chính", price: "672.000₫", rating: 4.7, isAvailable: true },
  { id: "3", name: "Trà sữa trân châu", description: "Size M/L", category: "Đồ uống", price: "45.000₫", rating: 4.5, isAvailable: false },
  { id: "4", name: "Salad tươi", description: "Rau xanh, sốt chanh", category: "Khai vị", price: "89.000₫", rating: 4.5, isAvailable: true },
];

const CATEGORY_CHIPS = [
  { id: "all", label: "Tất cả món" },
  { id: "main", label: "Món chính" },
  { id: "appetizer", label: "Khai vị" },
  { id: "drinks", label: "Đồ uống" },
  { id: "dessert", label: "Tráng miệng" },
];

const AdminMenuManagement = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
            Quản lý thực đơn
          </h2>
          <p className="text-[#9a734c] mt-1">
            Quản lý món ăn, cập nhật giá và trạng thái phục vụ.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-2">
            <p className="text-xl font-bold text-[#ee8c2b]">{MENU_MOCK.length}</p>
            <p className="text-xs uppercase tracking-widest text-[#9a734c] font-bold">Tổng món</p>
          </div>
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
              onClick={() => setViewMode("card")}
              className={clsx("p-2 rounded-md transition-colors", viewMode === "card" ? "bg-[#ee8c2b]/10 text-[#ee8c2b]" : "text-[#9a734c] hover:bg-[#f3ede7]")}
              title="Xem thẻ"
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
          </div>
          <button
            type="button"
            className="flex items-center justify-center gap-2 h-11 px-6 bg-[#ee8c2b] hover:bg-[#d87c24] text-white text-sm font-bold rounded-lg shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Thêm món mới
          </button>
        </div>
      </div>

      {/* Search + Category chips */}
      <div className="bg-white rounded-xl border border-[#e7dbcf] p-2 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1 p-2">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#9a734c]">search</span>
            <input
              type="text"
              placeholder="Tìm món, nguyên liệu hoặc danh mục..."
              className="w-full h-12 pl-10 pr-4 bg-[#f8f7f6] border border-transparent rounded-lg text-[#1b140d] placeholder:text-[#9a734c] focus:outline-none focus:border-[#ee8c2b]/50 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 p-2 overflow-x-auto no-scrollbar">
            {CATEGORY_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveCategory(chip.id)}
                className={clsx(
                  "shrink-0 h-10 px-5 rounded-lg font-medium text-sm transition-colors",
                  activeCategory === chip.id
                    ? "bg-[#ee8c2b] text-white"
                    : "bg-[#f8f7f6] text-[#1b140d] hover:bg-[#ee8c2b]/10"
                )}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-white border border-[#e7dbcf] rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fcfaf8] border-b border-[#e7dbcf]">
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider w-20">Ảnh</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Tên món</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Danh mục</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Giá</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Trạng thái</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7dbcf]">
                {MENU_MOCK.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fcfaf8] transition-colors">
                    <td className="py-4 px-6">
                      <div className="h-12 w-12 rounded-lg bg-[#f3ede7] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#9a734c]">restaurant</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-[#1b140d]">{item.name}</p>
                      <p className="text-xs text-[#9a734c] mt-0.5">{item.description}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-[#1b140d]">{item.price}</p>
                    </td>
                    <td className="py-4 px-6">
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.isAvailable} className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ee8c2b]" />
                        <span className="ml-3 text-xs font-medium text-[#9a734c] peer-checked:text-[#ee8c2b]">
                          {item.isAvailable ? "Đang bán" : "Tạm ngừng"}
                        </span>
                      </label>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="p-2 text-[#9a734c] hover:text-[#ee8c2b] hover:bg-[#ee8c2b]/10 rounded-lg" title="Chỉnh sửa">
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button type="button" className="p-2 text-[#9a734c] hover:text-red-500 hover:bg-red-500/10 rounded-lg" title="Xóa">
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_MOCK.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "flex flex-col bg-white rounded-xl overflow-hidden border border-[#e7dbcf] hover:shadow-xl transition-all duration-300",
                !item.isAvailable && "opacity-60"
              )}
            >
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#f3ede7]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#9a734c] text-5xl">restaurant</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span
                    className={clsx(
                      "text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm",
                      item.isAvailable ? "bg-[#ee8c2b]" : "bg-gray-500"
                    )}
                  >
                    {item.isAvailable ? "ĐANG BÁN" : "HẾT HÀNG"}
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[#1b140d] text-lg font-bold leading-tight flex-1">{item.name}</h3>
                  <p className="text-[#ee8c2b] text-lg font-black ml-2">{item.price}</p>
                </div>
                <p className="text-[#9a734c] text-sm line-clamp-2 mb-3">{item.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#9a734c] uppercase px-2 py-1 bg-orange-50 rounded">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#ee8c2b] text-sm">star</span>
                    <span className="text-sm font-bold text-[#1b140d]">{item.rating}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-[#e7dbcf] flex items-center gap-2">
                  <button
                    type="button"
                    className={clsx(
                      "flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors",
                      item.isAvailable
                        ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                        : "bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100"
                    )}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {item.isAvailable ? "check_circle" : "cancel"}
                    </span>
                    {item.isAvailable ? "Còn món" : "Hết món"}
                  </button>
                  <button type="button" className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 hover:bg-red-100 transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMenuManagement;
