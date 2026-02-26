import { BookOpen } from "lucide-react";

const CulinaryStorySection = () => {
    return (
        <section>
            <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-slate-700" />
                <h2 className="text-2xl font-black text-slate-900">Góc Bếp & Chuyện Nghề</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="group cursor-pointer">
                    <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-4 relative">
                        <img src="https://nhahangcontoc.com/wp-content/uploads/2023/02/ham-xuong.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <h3 className="text-white text-2xl font-bold leading-tight">Bí quyết nước dùng thanh ngọt từ xương hầm 24h</h3>
                        </div>
                    </div>
                    <p className="text-slate-500 line-clamp-2">Nước dùng phở được ninh từ xương ống bò tươi ngon trong suốt 24 giờ cùng các loại gia vị thảo mộc...</p>
                </div>
                <div className="group cursor-pointer">
                    <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-4 relative">
                        <img src="https://hoachatbinhdinh.vn/wp-content/uploads/2021/07/Cach-Lam-Bun-La-Ngon.jpeg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <h3 className="text-white text-2xl font-bold leading-tight">Hành trình làm ra sợi bún tươi thủ công</h3>
                        </div>
                    </div>
                    <p className="text-slate-500 line-clamp-2">Sợi bún tươi được làm thủ công mỗi ngày, không chất bảo quản, giữ trọn hương vị gạo mới...</p>
                </div>
            </div>
        </section>
    );
};

export default CulinaryStorySection;
