import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import OrderService, { type Order } from "@/services/order.service";
import { apiClient } from "@/lib/api-client";

// ---- Types ----
interface CustomerAPI {
  _id: string;
  createdAt: string;
}

const REVENUE_DATA = [
  { day: "T2", revenue: 45200000, orders: 65 },
  { day: "T3", revenue: 62800000, orders: 80 },
  { day: "T4", revenue: 71500000, orders: 95 },
  { day: "T5", revenue: 58300000, orders: 70 },
  { day: "T6", revenue: 52100000, orders: 60 },
  { day: "T7", revenue: 48900000, orders: 45 },
  { day: "CN", revenue: 38600000, orders: 30 },
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, customersRes] = await Promise.all([
          OrderService.getAllOrders({ limit: 1000 }), // Get a large enough sample for basic stats
          apiClient.get("/admin/customers", { params: { limit: 1000 } }),
        ]);

        if (ordersRes.success) {
          setOrders(ordersRes.data);
        }

        const customerData = customersRes.data;
        let rawCustomers: CustomerAPI[] = [];
        if (Array.isArray(customerData.data)) {
          rawCustomers = customerData.data;
        } else if (customerData.data?.customers) {
          rawCustomers = customerData.data.customers;
        } else if (customerData.customers) {
          rawCustomers = customerData.customers;
        }
        setCustomers(rawCustomers);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + o.total_price, 0);

  const totalOrdersCount = orders.length;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const newCustomersCount = customers.filter((c) => {
    const d = new Date(c.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const recentOrdersForList = orders.slice(0, 5).map(o => ({
    code: o.code,
    customer: o.user_id?.username || "Ẩn danh",
    time: new Date(o.createdAt).toLocaleDateString("vi-VN"),
    items: o.items.length,
    total: `${o.total_price.toLocaleString("vi-VN")}₫`,
    status: o.status.toUpperCase(),
    statusClass: o.status === 'completed' ? "bg-green-100 text-green-700" : "bg-[#ee8c2b]/20 text-[#ee8c2b]"
  }));

  const POPULAR_ITEMS = [
    { name: "Burger Nấm Truffle", orders: 142, price: "592.000₫", trend: "+8%" },
    { name: "Salad Caesar", orders: 98, price: "384.000₫", trend: "+3%" },
    { name: "Pizza Margherita", orders: 85, price: "672.000₫", trend: "-2%" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      {/* Page Heading */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
            Chào buổi sáng, Babyyy
          </h2>
          <p className="text-[#9a734c] mt-1">
            Tình hình nhà hàng của bạn hôm nay.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e7dbcf] rounded-lg text-sm font-bold text-[#1b140d] hover:bg-[#f3ede7]"
          >
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            12 - 19 Th10
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-[#e7dbcf] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
              <span className="material-symbols-outlined text-[#ee8c2b]">payments</span>
            </div>
            <span className="text-[#07880e] text-sm font-bold flex items-center">
              +12.5% <span className="material-symbols-outlined text-sm ml-1">trending_up</span>
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9a734c]">Doanh thu tổng</p>
            <h3 className="text-3xl font-bold mt-1 text-[#1b140d]">
              {loading ? "..." : `${totalRevenue.toLocaleString("vi-VN")}₫`}
            </h3>
          </div>
          <div className="h-12 w-full flex items-end gap-1">
            {[40, 60, 55, 70, 85, 75, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-[#ee8c2b]/20"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e7dbcf] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="material-symbols-outlined text-blue-600">receipt_long</span>
            </div>
            <span className="text-[#07880e] text-sm font-bold flex items-center">
              +5.2% <span className="material-symbols-outlined text-sm ml-1">trending_up</span>
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9a734c]">Tổng đơn hàng</p>
            <h3 className="text-3xl font-bold mt-1 text-[#1b140d]">
              {loading ? "..." : totalOrdersCount}
            </h3>
          </div>
          <div className="h-12 w-full flex items-end gap-1">
            {[50, 45, 65, 80, 60, 90, 75].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-blue-200"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e7dbcf] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="material-symbols-outlined text-purple-600">person_add</span>
            </div>
            <span className="text-[#9a734c] text-sm font-bold flex items-center">
              0% <span className="material-symbols-outlined text-sm ml-1">horizontal_rule</span>
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#9a734c]">Khách hàng mới</p>
            <h3 className="text-3xl font-bold mt-1 text-[#1b140d]">
              {loading ? "..." : newCustomersCount}
            </h3>
          </div>
          <div className="h-12 w-full flex items-end gap-1">
            {[30, 40, 60, 55, 50, 45, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-purple-200"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-[#e7dbcf] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-bold text-[#1b140d]">Doanh thu theo tuần</h4>
              <p className="text-sm text-[#9a734c]">7 ngày gần nhất</p>
            </div>
            <select className="bg-[#f3ede7] border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-[#ee8c2b] text-[#1b140d]">
              <option>Tuần này</option>
              <option>Tuần trước</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e7dbcf" />
              <XAxis
                dataKey="day"
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
                  fontSize: "12px",
                }}
                formatter={(value: number | undefined) => {
                  if (value === undefined) return ["", ""];
                  return [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"];
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="revenue"
                stroke="#ee8c2b"
                strokeWidth={3}
                dot={{ fill: "#ee8c2b", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-1 bg-white border border-[#e7dbcf] rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#e7dbcf] flex items-center justify-between">
            <h4 className="text-lg font-bold text-[#1b140d]">Đơn hàng gần đây</h4>
            <Link to="/admin/orders" className="text-xs font-bold text-[#ee8c2b] hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            <div className="divide-y divide-[#e7dbcf]">
              {recentOrdersForList.map((order) => (
                <div
                  key={order.code}
                  className="p-4 hover:bg-[#f3ede7] transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-[#1b140d]">{order.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.statusClass}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-[#1b140d]">{order.customer}</p>
                      <p className="text-xs text-[#9a734c]">{order.time} • {order.items} món</p>
                    </div>
                    <span className="text-sm font-bold text-[#1b140d]">{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Items + Restaurant Health */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
          <h4 className="text-lg font-bold mb-6 text-[#1b140d]">Món bán chạy</h4>
          <div className="space-y-4">
            {POPULAR_ITEMS.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="size-12 rounded-lg bg-[#f3ede7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#9a734c]">restaurant</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1b140d]">{item.name}</p>
                  <p className="text-xs text-[#9a734c]">{item.orders} đơn trong tuần</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1b140d]">{item.price}</p>
                  <p className={`text-[10px] font-bold ${item.trend.startsWith("+") ? "text-[#07880e]" : "text-red-500"}`}>
                    {item.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-[#1b140d]">Sức khỏe nhà hàng</h4>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full">
              TỐT
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 text-[#1b140d]">
                <span>Thời gian chuẩn bị TB</span>
                <span className="text-[#ee8c2b]">14 phút</span>
              </div>
              <div className="w-full bg-[#f3ede7] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ee8c2b] h-full w-[85%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 text-[#1b140d]">
                <span>Độ chính xác đơn</span>
                <span className="text-[#ee8c2b]">98.4%</span>
              </div>
              <div className="w-full bg-[#f3ede7] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ee8c2b] h-full w-[98%] rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2 text-[#1b140d]">
                <span>Hài lòng khách hàng</span>
                <span className="text-[#ee8c2b]">4.8 / 5.0</span>
              </div>
              <div className="w-full bg-[#f3ede7] h-2 rounded-full overflow-hidden">
                <div className="bg-[#ee8c2b] h-full w-[92%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
