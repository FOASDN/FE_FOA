import { useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Mock revenue data
const REVENUE_DATA = [
    { date: "01/01", revenue: 12500000, orders: 45 },
    { date: "02/01", revenue: 15800000, orders: 58 },
    { date: "03/01", revenue: 11200000, orders: 42 },
    { date: "04/01", revenue: 18900000, orders: 67 },
    { date: "05/01", revenue: 22400000, orders: 78 },
    { date: "06/01", revenue: 19600000, orders: 71 },
    { date: "07/01", revenue: 25100000, orders: 89 },
    { date: "08/01", revenue: 21800000, orders: 76 },
    { date: "09/01", revenue: 24500000, orders: 85 },
    { date: "10/01", revenue: 27200000, orders: 94 },
    { date: "11/01", revenue: 23900000, orders: 82 },
    { date: "12/01", revenue: 26800000, orders: 91 },
    { date: "13/01", revenue: 29500000, orders: 102 },
    { date: "14/01", revenue: 25600000, orders: 88 },
];

// Sales by category
const CATEGORY_DATA = [
    { name: "Món chính", value: 45, color: "#ee8c2b" },
    { name: "Đồ uống", value: 25, color: "#3b82f6" },
    { name: "Khai vị", value: 18, color: "#10b981" },
    { name: "Tráng miệng", value: 12, color: "#f59e0b" },
];

// Top dishes
const TOP_DISHES_DATA = [
    { name: "Burger Nấm Truffle", sales: 142, revenue: 84064000 },
    { name: "Pizza Margherita", sales: 128, revenue: 86016000 },
    { name: "Salad Caesar", sales: 98, revenue: 37632000 },
    { name: "Phở Bò Wagyu", sales: 87, revenue: 60900000 },
    { name: "Pasta Carbonara", sales: 76, revenue: 45600000 },
];

// Peak hours heatmap data
const HEATMAP_DATA = [
    { hour: "6h", Mon: 12, Tue: 15, Wed: 10, Thu: 18, Fri: 25, Sat: 42, Sun: 38 },
    { hour: "9h", Mon: 35, Tue: 38, Wed: 32, Thu: 40, Fri: 45, Sat: 52, Sun: 48 },
    { hour: "12h", Mon: 78, Tue: 82, Wed: 75, Thu: 88, Fri: 95, Sat: 105, Sun: 98 },
    { hour: "15h", Mon: 45, Tue: 48, Wed: 42, Thu: 52, Fri: 58, Sat: 65, Sun: 62 },
    { hour: "18h", Mon: 92, Tue: 95, Wed: 88, Thu: 102, Fri: 115, Sat: 125, Sun: 118 },
    { hour: "21h", Mon: 65, Tue: 68, Wed: 62, Thu: 72, Fri: 88, Sat: 95, Sun: 85 },
];

const AdminAnalytics = () => {
    const [dateRange, setDateRange] = useState("14days");

    // Calculate metrics
    const totalRevenue = REVENUE_DATA.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = REVENUE_DATA.reduce((sum, d) => sum + d.orders, 0);
    const avgOrderValue = totalRevenue / totalOrders;
    const growth = 12.5; // Mock growth percentage

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
                        Báo cáo & Phân tích
                    </h2>
                    <p className="text-[#9a734c] mt-1">
                        Insights và trends doanh nghiệp của bạn.
                    </p>
                </div>
                <div className="flex gap-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 bg-white border border-[#e7dbcf] rounded-lg text-sm font-medium text-[#1b140d] focus:ring-2 focus:ring-[#ee8c2b]/50"
                    >
                        <option value="7days">7 ngày qua</option>
                        <option value="14days">14 ngày qua</option>
                        <option value="30days">30 ngày qua</option>
                        <option value="90days">90 ngày qua</option>
                    </select>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#d87c24]"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#ee8c2b]">
                                payments
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +{growth}%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Tổng doanh thu</p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {totalRevenue.toLocaleString("vi-VN")}₫
                    </h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">
                                receipt_long
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +8.2%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Tổng đơn hàng</p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{totalOrders}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600">
                                shopping_cart
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Giá trị TB/đơn</p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {avgOrderValue.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}₫
                    </h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600">
                                local_fire_department
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +15.3%
                        </span>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Tăng trưởng</p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{growth}%</h3>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h4 className="text-lg font-bold text-[#1b140d]">
                                Doanh thu theo ngày
                            </h4>
                            <p className="text-sm text-[#9a734c]">14 ngày gần nhất</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e7dbcf" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: "#9a734c" }}
                                stroke="#e7dbcf"
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: "#9a734c" }}
                                stroke="#e7dbcf"
                                tickFormatter={(value) =>
                                    `${(value / 1000000).toFixed(0)}M`
                                }
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e7dbcf",
                                    borderRadius: "8px",
                                }}
                                formatter={(value: number | undefined) =>
                                    value !== undefined ? `${value.toLocaleString("vi-VN")}₫` : ""
                                }
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                name="Doanh thu"
                                stroke="#ee8c2b"
                                strokeWidth={3}
                                dot={{ fill: "#ee8c2b", r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1b140d] mb-6">
                        Doanh số theo danh mục
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={CATEGORY_DATA}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) =>
                                    `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                                }
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {CATEGORY_DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Top Dishes */}
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1b140d] mb-6">
                        Top 5 món bán chạy
                    </h4>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={TOP_DISHES_DATA} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e7dbcf" />
                            <XAxis type="number" tick={{ fontSize: 12, fill: "#9a734c" }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                tick={{ fontSize: 12, fill: "#9a734c" }}
                                width={120}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e7dbcf",
                                    borderRadius: "8px",
                                }}
                            />
                            <Bar dataKey="sales" fill="#ee8c2b" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Peak Hours */}
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <h4 className="text-lg font-bold text-[#1b140d] mb-6">
                        Giờ cao điểm trong tuần
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-bold text-[#9a734c] pb-3">
                                        Giờ
                                    </th>
                                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
                                        <th
                                            key={day}
                                            className="text-center text-xs font-bold text-[#9a734c] pb-3"
                                        >
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HEATMAP_DATA.map((row) => (
                                    <tr key={row.hour}>
                                        <td className="text-sm font-medium text-[#1b140d] py-2">
                                            {row.hour}
                                        </td>
                                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                                            (day) => {
                                                const value = row[day as keyof typeof row] as number;
                                                const intensity = Math.min(value / 125, 1);
                                                return (
                                                    <td key={day} className="text-center py-2">
                                                        <div
                                                            className="inline-flex items-center justify-center w-10 h-10 rounded text-xs font-bold"
                                                            style={{
                                                                backgroundColor: `rgba(238, 140, 43, ${intensity})`,
                                                                color: intensity > 0.5 ? "white" : "#1b140d",
                                                            }}
                                                        >
                                                            {value}
                                                        </div>
                                                    </td>
                                                );
                                            }
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Orders over time */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="text-lg font-bold text-[#1b140d]">
                            Số đơn hàng theo ngày
                        </h4>
                        <p className="text-sm text-[#9a734c]">14 ngày gần nhất</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={REVENUE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e7dbcf" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: "#9a734c" }}
                            stroke="#e7dbcf"
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "#9a734c" }}
                            stroke="#e7dbcf"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e7dbcf",
                                borderRadius: "8px",
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="orders"
                            name="Số đơn hàng"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminAnalytics;
