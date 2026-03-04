import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Danh mục khớp với giá trị trong DB (product.category).
 * Link đến /menu?category=<id> để MenuPage filter đúng.
 * Ảnh đại diện từ Unsplash, cố định cho từng loại.
 */
const CATEGORIES = [
  {
    id: "Món chính",
    name: "Món chính",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=500&fit=crop",
  },
  {
    id: "Khai vị",
    name: "Khai vị",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=500&fit=crop",
  },
  {
    id: "Đồ uống",
    name: "Đồ uống",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=500&fit=crop",
  },
  {
    id: "Tráng miệng",
    name: "Tráng miệng",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=500&fit=crop",
  },
  {
    id: "Đồ ăn nhanh",
    name: "Đồ ăn nhanh",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=500&fit=crop",
  },
  {
    id: "Salad",
    name: "Salad",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=500&fit=crop",
  },
];

const CategorySection = () => {
  const { t } = useTranslation("customer");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative w-full py-6">
      <div className="w-full">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">
            {t("home.featuredCategories")}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm"
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors shadow-sm"
              aria-label="Cuộn phải"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${encodeURIComponent(cat.id)}`}
              className="snap-start shrink-0 group cursor-pointer w-[140px] sm:w-[160px] md:w-[180px]"
            >
              <div className="relative w-full aspect-4/5 min-h-[160px] rounded-2xl overflow-hidden bg-slate-200 shadow-md hover:shadow-xl hover:shadow-orange-500/15 transition-all duration-300 hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="font-bold text-base text-white drop-shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
