// Staff Menu Management Page

import { useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";

interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    image: string;
    inStock: boolean;
}

const MOCK_MENU_ITEMS: MenuItem[] = [
    { id: "1", name: "Phở Hà Nội đặc biệt", description: "Nước dùng thanh ngọt, thịt bò mềm", category: "Món chính", price: 75000, image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400", inStock: true },
    { id: "2", name: "Bún chả Hà Nội", description: "Chả nướng, bún tươi, nước mắm chua ngọt", category: "Món chính", price: 65000, image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400", inStock: true },
    { id: "3", name: "Gỏi cuốn tôm thịt", description: "Tôm tươi, thịt heo, rau sống, bún", category: "Khai vị", price: 45000, image: "https://yummyday.vn/uploads/images/goi-cuon-tom-thit-9.jpg", inStock: false },
    { id: "4", name: "Phở Hải Sản", description: "Tôm, mực, cá, nước dùng đậm đà", category: "Món chính", price: 85000, image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400", inStock: true },
    { id: "5", name: "Cơm tấm sườn bì", description: "Sườn nướng, bì, chả, trứng", category: "Món chính", price: 55000, image: "https://i.ytimg.com/vi/OVb5uoDWspM/maxresdefault.jpg", inStock: true },
    { id: "6", name: "Trà sữa trân châu", description: "Trân châu đen, trà Ô long", category: "Đồ uống", price: 35000, image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400", inStock: false },
    { id: "7", name: "Cà phê sữa đá", description: "Cà phê phin truyền thống", category: "Đồ uống", price: 25000, image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400", inStock: true },
    { id: "8", name: "Bánh mì pate", description: "Pate, thịt nguội, dưa leo, rau thơm", category: "Khai vị", price: 20000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", inStock: true },
    { id: "9", name: "Nem rán", description: "Nem rán giòn, rau sống", category: "Khai vị", price: 40000, image: "https://images.unsplash.com/photo-1626790680787-de5e9a07bcf2?w=400", inStock: true },
    { id: "10", name: "Chè ba màu", description: "Đậu đỏ, đậu xanh, thạch, nước cốt dừa", category: "Tráng miệng", price: 30000, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400", inStock: false },
    { id: "11", name: "Nước ép dưa hấu", description: "Dưa hấu tươi, mát lạnh", category: "Đồ uống", price: 28000, image: "https://cookbeo.com/media/2020/12/nuoc-ep-dua-hau/coc-nuoc-ep-dua-hau.jpg", inStock: true },
    { id: "12", name: "Bánh flan", description: "Bánh flan mềm mịn, caramel thơm ngon", category: "Tráng miệng", price: 25000, image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400", inStock: true },
];

const CATEGORIES = ["Tất cả", "Món chính", "Khai vị", "Đồ uống", "Tráng miệng"];

export default function StaffMenu() {
    const [menuItems, setMenuItems] = useState(MOCK_MENU_ITEMS);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("Tất cả");

    const filteredItems = menuItems.filter(item => {
        const matchesSearch = searchQuery === '' ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "Tất cả" || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const toggleStock = (id: string) => {
        setMenuItems(prev => prev.map(item =>
            item.id === id ? { ...item, inStock: !item.inStock } : item
        ));
    };

    const totalItems = menuItems.length;
    const inStockItems = menuItems.filter(item => item.inStock).length;
    const outOfStockItems = totalItems - inStockItems;

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div>
                    <h1 className="text-[32px] font-extrabold text-[#1b140d] mb-1">Quản lý món ăn</h1>
                    <p className="text-base text-[#9a734c]">Cập nhật trạng thái món ăn trong thực đơn</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-4 bg-white border-2 border-[#e7dbcf] rounded-xl text-center min-w-[100px]">
                        <div className="text-[28px] font-extrabold text-[#1b140d] leading-none">{totalItems}</div>
                        <div className="text-xs font-semibold text-[#9a734c] mt-1">Tổng món</div>
                    </div>
                    <div className="px-6 py-4 bg-emerald-50 border-2 border-emerald-500 rounded-xl text-center min-w-[100px]">
                        <div className="text-[28px] font-extrabold text-emerald-500 leading-none">{inStockItems}</div>
                        <div className="text-xs font-semibold text-[#9a734c] mt-1">Còn món</div>
                    </div>
                    <div className="px-6 py-4 bg-red-50 border-2 border-red-500 rounded-xl text-center min-w-[100px]">
                        <div className="text-[28px] font-extrabold text-red-500 leading-none">{outOfStockItems}</div>
                        <div className="text-xs font-semibold text-[#9a734c] mt-1">Hết món</div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a734c]" />
                    <input
                        type="text"
                        placeholder="Tìm món ăn theo tên hoặc mô tả..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-4 border-2 border-[#e7dbcf] rounded-xl text-[15px] transition-all focus:outline-none focus:border-[#ee8c2b] focus:shadow-[0_0_0_4px_rgba(238,140,43,0.1)]"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`px-5 py-2.5 rounded-[10px] text-sm font-semibold transition-all border-2 ${categoryFilter === cat
                                    ? 'bg-[#ee8c2b] text-white border-[#ee8c2b]'
                                    : 'bg-white text-[#1b140d] border-[#e7dbcf] hover:border-[#ee8c2b] hover:text-[#ee8c2b]'
                                }`}
                            onClick={() => setCategoryFilter(cat)}
                        >
                            {cat}{cat !== 'Tất cả' && ` (${menuItems.filter(i => i.category === cat).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                {filteredItems.map(item => (
                    <div key={item.id} className={`bg-white rounded-2xl overflow-hidden border-2 border-[#e7dbcf] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#ee8c2b] transition-all ${!item.inStock ? 'opacity-70' : ''}`}>
                        <div className="relative w-full h-[200px] overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold text-white ${item.inStock ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                {item.inStock ? '✓ Còn món' : '✗ Hết món'}
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start gap-3 mb-2">
                                <h3 className="text-lg font-bold text-[#1b140d] leading-snug">{item.name}</h3>
                                <div className="px-2.5 py-1 bg-[#f3ede7] rounded-md text-[11px] font-semibold text-[#9a734c] whitespace-nowrap">{item.category}</div>
                            </div>
                            <p className="text-[13px] text-[#9a734c] leading-relaxed mb-4">{item.description}</p>
                            <div className="flex justify-between items-center gap-3">
                                <div className="text-xl font-extrabold text-[#ee8c2b]">{item.price.toLocaleString('vi-VN')}đ</div>
                                <button
                                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-sm font-bold border-2 transition-all ${item.inStock
                                            ? 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                                            : 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                                        }`}
                                    onClick={() => toggleStock(item.id)}
                                >
                                    {item.inStock ? <><XCircle className="w-[18px] h-[18px]" /> Đặt hết món</> : <><CheckCircle className="w-[18px] h-[18px]" /> Bật lại món</>}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-16 text-[#9a734c]">
                    <p className="text-lg font-semibold">Không tìm thấy món ăn nào</p>
                </div>
            )}
        </div>
    );
}
