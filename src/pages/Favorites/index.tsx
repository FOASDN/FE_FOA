import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "healthy", label: "Lành mạnh" },
  { id: "main", label: "Món chính" },
  { id: "drinks", label: "Đồ uống" },
];

const FAVORITE_ITEMS = [
  {
    id: "1",
    name: "Bánh mì bơ",
    restaurant: "Healthy Cafe",
    price: 299000,
    rating: 4.8,
    reviews: 120,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzMse1yC8bsbhfXmehIrI9KHb9BjZtG4K5Cndw9oBGhhZvkD1JQ-tDlyEj7kjhOxggcLVANlEbGifTg9BaHh76Fx4zfFQURs0dS68idwmwoPo8bPAYc5SZFVxdTPLF6pEWg0iM8htxWpV95YkoWu79xMgCsZaWhROdId-bs5T-QfF7t73nKP5-e8GJxJJG_7I617d_fHAfboE-7V5Ul6enJ7ioZXKCxDgH5E4SLtahg4txV0K-wXoeiIZrykZesYm5hoPLaqIScVU",
  },
  {
    id: "2",
    name: "Bát Quinoa Power",
    restaurant: "Green Kitchen",
    price: 345000,
    rating: 4.9,
    reviews: 80,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuClGY1HvQs3ntCYvpcPCrRx4dieXd7H3-t-UcfLjZHWKisd7lCQbXiunlxlLKLnKMnIAOb3NZNtjoWMfyT5U_dtBJlRcBWQnpWS77GxeAYobOPDM1d3e2QKdGFxLJmrCDomtMA6-PqIgs6f-oBKU3PRemWKAkehm83F4dRW8tuGrTZQddfIPlxQCUgQ-EU6nyLr53M3fqvCEI-9qqpbq27-M9Q6Yn8Dx9hpPSH8ZKBBQSPHBTdsvp8f0xSCQtexgWehbBH3Dt8ke0Q",
  },
  {
    id: "3",
    name: "Cá hồi Đại Tây Dương nướng",
    restaurant: "Ocean Grill",
    price: 520000,
    rating: 4.7,
    reviews: 200,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCt2xZ9u5KkhPGg0ffU8GbyGk31Mj08xq-r2idHGlQiSaSKjvZHYejnJGCjB44a8jE3fPEZWZ4UQoXQO-9Vgi9coPqD_W919KuebiwGyn27hIHbgq2lrpPM8sOEDixqceWEiLl5IGuLquva8DzZHBnlbR_Cz0eUcD-nW2yXr5gPhuPqZI3J2xE3t7H5IoFcPOwX1TWG7KXdvcADCRhTxlh4j9T9xoowNb2GRKdCh6DZXqXeUZ2KqxB1k1nOCEMkFpqANeE6ZH-W9KY",
  },
  {
    id: "4",
    name: "Sinh tố Detox xanh",
    restaurant: "Vitality Bar",
    price: 85000,
    rating: 4.9,
    reviews: 45,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDrVA-LS95Atl-FXrTyG0nBDn8SJOhCvPIAMQtVh3xO_xFkOoTPMjOuI1wMCgYcX3o3rOuoMgijwWLp2PU6utltdyhWYMvODrN1gtvZHmaZCa144sqhNEPo_1CF5xKOqPOM42CpqEcW4O_dGvqhMZE-ezOKq1rOxljOo7OTo21iNBLtvvAFxBuOiyGVNAVMvv5cS01GLwKLkYQGRPUORwJaTVDhnHJlSkMZWYv0mBfWvhFjMurztlyYRsRvMrW-2k2qDDycBH2BLAM",
  },
];

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['customer', 'common']);
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <>
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">
          {t('customer:favorites.title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          {t('customer:favorites.subtitle')}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="pb-8 overflow-x-auto">
        <div className="flex border-b border-border px-2 gap-8 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center border-b-[3px] pb-4 pt-2 px-1 transition-all ${activeCategory === cat.id
                ? "border-b-primary text-foreground font-extrabold"
                : "border-b-transparent text-muted-foreground hover:text-primary font-bold"
                }`}
            >
              <span className="text-sm leading-normal tracking-[0.015em]">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Food Card Grid */}
      {FAVORITE_ITEMS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FAVORITE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30"
            >
              {/* Image Section - Smaller aspect ratio */}
              <div className="relative w-full aspect-[16/10] overflow-hidden">
                <div
                  className="w-full h-full bg-center bg-no-repeat bg-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                {/* Favorite Heart Button */}
                <button
                  type="button"
                  className="absolute top-3 right-3 bg-white/95 dark:bg-card/95 size-9 rounded-full shadow-md cursor-pointer transform hover:scale-110 transition-all flex items-center justify-center"
                >
                  <span
                    className="material-symbols-outlined text-lg text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </button>
                {/* AI Badge - Smaller */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  AI xác nhận tươi
                </div>
              </div>

              {/* Content Section - More compact */}
              <div
                className="p-4 flex flex-col gap-2 cursor-pointer flex-1"
                onClick={() => navigate(`/food/${item.id}`)}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground text-base font-bold line-clamp-1 mb-0.5">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm font-medium line-clamp-1">
                      {item.restaurant}
                    </p>
                  </div>
                  <p className="text-primary font-extrabold text-base shrink-0">
                    {item.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="material-symbols-outlined text-yellow-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {item.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.reviews}+)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
          <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-primary/40">
              heart_broken
            </span>
          </div>
          <div className="flex flex-col gap-2 max-w-sm">
            <h2 className="text-foreground text-2xl font-bold">
              {t('customer:favorites.emptyTitle')}
            </h2>
            <p className="text-muted-foreground text-base font-medium">
              {t('customer:favorites.emptyDesc')}
            </p>
          </div>
          <Link
            to="/menu"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-10 rounded-xl transition-all shadow-md active:scale-95"
          >
            {t('customer:favorites.exploreMenu')}
          </Link>
        </div>
      )}
    </>
  );
};

export default FavoritesPage;
