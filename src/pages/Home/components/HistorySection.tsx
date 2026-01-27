import React from "react";
import { History, Plus, ArrowRight } from "lucide-react";

const HistorySection = () => {
    return (
        <section>
            <div className="flex items-center gap-3 mb-6 opacity-80">
                <History className="w-5 h-5 text-orange-600" />
                <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Đặt lại đơn cũ</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Burger King", date: "Hôm qua", items: "2 món", price: 89000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
                    { name: "Cơm Tấm Cali", date: "2 ngày trước", items: "1 món", price: 55000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" },
                    { name: "Pizza Palace", date: "Tuần trước", items: "1 món", price: 159000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" },
                ].map((order, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer group">
                        <img src={order.image} alt={order.name} className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{order.name}</h4>
                            <p className="text-xs text-gray-400">{order.date} • {order.items}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-orange-600">{order.price.toLocaleString()}đ</p>
                            <div className="mt-1 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <Plus className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HistorySection;
