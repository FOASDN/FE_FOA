import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HEALTH_COLOR = "var(--health)";

const ACTIVE_FILTERS = [
  { id: "peanuts", label: "Không đậu phộng" },
  { id: "gluten", label: "Không gluten" },
  { id: "dairy", label: "Không sữa" },
];

const FOOD_ITEMS = [
  {
    id: "1",
    name: "Bát Quinoa Buddha",
    restaurant: "Green Leaf Organics",
    price: 345000,
    image: "https://tse1.mm.bing.net/th/id/OIP.G_eSX-TqgFy2S2Xt7J5jFgHaHa?pid=Api&P=0&h=220",
    protein: "12g",
    carbs: "45g",
    cals: "380",
  },
  {
    id: "2",
    name: "Salad Cá Hồi Nướng",
    restaurant: "The Sea Garden",
    price: 452000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuph-2Vqind7WeS8WaAa99JkaUVwhC5JisQGEa-NyFDukfNnBSooNrq9TCs6J2dxbz5qFCG2CJtaZ1LabvhDy5OKUTR70XuZllnDzxvfcrpAmLdFG62-HJAlgPMvRSDw7FqwTCRPHPheWYJcBDGs9PywPrwYRx5MwmTRcWs5zFTq4amLG1UfaeE5Y2PA8K8qfqYzp9jhg0eTI8FGQym0x7ZO3Fi54_xvOZ_qyxzhNLvJ83U5biR1rUtd9r0yl587jZ2MchGpKP_HY",
    protein: "34g",
    carbs: "8g",
    cals: "420",
  },
  {
    id: "3",
    name: "Súp Đậu Lăng Vàng",
    restaurant: "Root & Harvest",
    price: 298000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApGYpNY0K87AXfJXtOd8e0lKuZBOwVHvHC46aCDGcKcwHEx7B81re7kuWsKbAzvY0BerLsWHz21g_ZoUUExvuaR5wC4MnhTLfDzXbd4zW-2KGnA_JXVF5Xo-i8jQ2s1lBjBiYmS9qN0qWKUOHB94Yk-aEfdZQKDDs3lMjJfeT9dsyLXQ0ZMP7Tjnx6GxG406hBCqvPl7t3TN1R_BDW-rZEVJT1LhLYIP5jLa8dIsQTeASVSeV_T3VxR0Rn2f_5sdFMVabxC_1JyM8",
    protein: "18g",
    carbs: "52g",
    cals: "310",
  },
  {
    id: "4",
    name: "Đậu Hũ Teriyaki Xào",
    restaurant: "Zen Kitchen",
    price: 318000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuMTKlFfG6oz4F3gXzBEW5fosW5J8spG-cdDQkSiaNWc_vd4ohNMf-Pz9Ti4a3EBXhlt4TD2NjV2dBPA3vnOPcFCcGOg7Y4bMg--9ZYeciE5ZgvVKxsrG5KuhKRrmORuarof8vUmPnc71bKSLyA25-qIrTsAQ6zeUUQSRj3MVS1EfxhtYxO9FrTfe9fvKp09SSwZM-04Pn1cdOUgF44P-I5E1SbS1PmtsxRkNobIy0bumAnlcEqJla73yQSHYboGGIKb76tQCdTo4",
    protein: "22g",
    carbs: "38g",
    cals: "405",
  },
  {
    id: "5",
    name: "Cuốn Gà Bơ",
    restaurant: "Fresh Bites",
    price: 285000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAULCbTVtX3xYCseFr5TTMlGf79XMjf2GpXtcqshYWNaNMexkwKU9Ozn0iAJKb2yHbEftat-zcHOa1tOh6SgiWt0PF5pjz-5eL9l57ngAowP9ITQlPNti2C5Yk2ib3ZsIurEB4d_baYjidUrfM4jqT8gLedyO4PJ8T2zFhzQFlfOMHmJC_8yR1VMnlJt0K32Cfiof4xkKbwlY7S9Si0lYubpl0riny4IOVDqkun8joH_bGQBw45GD3SIAotKQ62QBWGL50jflPZnn8",
    protein: "28g",
    carbs: "32g",
    cals: "450",
  },
  {
    id: "6",
    name: "Salad Rau Nướng Cầu Vồng",
    restaurant: "Garden Pantry",
    price: 355000,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOaA2rATjXnXjf5dPFNvMOLC2na-dZ7SMx2J21SFwBKs71eknIp9Ps9YD5keXza0ujl_bddrRav84FCSS78CCWWwy5IsnjZxgKz9r8o5jrJaK7mha1e_yy5qYbfYEUyFQXv2x4CNncpzEPCntRqoHiMwDCf_DG2EI3SpBkEhSdYoUc0LVYUWg-SRbb3qFKntZd_aZt8PCu3zsljqoB7E3Fno0QeQV2vO3SptdukiOm9IIpN0NwUajaY3Z2W9lhT8IJfqJErGKkdl4",
    protein: "14g",
    carbs: "28g",
    cals: "340",
  },
];

const SafeAlternativesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['customer', 'common']);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen">
      <main className="flex-1 flex flex-col items-center py-10 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1200px] w-full flex flex-col gap-8">
          {/* Page Heading */}
          <div
            className="flex flex-col gap-4 border-l-4 pl-6 py-2"
            style={{ borderColor: HEALTH_COLOR }}
          >
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-4xl"
                style={{ color: HEALTH_COLOR }}
              >
                shield
              </span>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {t('customer:safeAlternatives.title')}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl leading-normal">
              Dựa trên dị ứng và hồ sơ sức khỏe của bạn, AI gợi ý những món an toàn và ngon miệng để thay thế lựa chọn trước đó.
            </p>
          </div>

          {/* Active Health Filters */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Bộ lọc sức khỏe đang bật
            </p>
            <div className="flex gap-3 flex-wrap">
              {ACTIVE_FILTERS.map((f) => (
                <div
                  key={f.id}
                  className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-4 border"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--health) 12%, transparent)",
                    borderColor: "color-mix(in srgb, var(--health) 35%, transparent)",
                    color: HEALTH_COLOR,
                  }}
                >
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span className="text-sm font-bold leading-normal">{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Food Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {FOOD_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-0 bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden">
                  <div
                    className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url("${item.image}")` }}
                  />
                  <div
                    className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white text-xs font-bold shadow-lg"
                    style={{ backgroundColor: HEALTH_COLOR }}
                  >
                    <span className="material-symbols-outlined text-sm">shield</span>
                    <span>GỢI Ý AN TOÀN AI</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">{item.restaurant}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {item.price.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex items-center gap-4 py-2 border-y border-border my-1">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Protein
                      </span>
                      <span className="text-xs font-bold">{item.protein}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Carb
                      </span>
                      <span className="text-xs font-bold">{item.carbs}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase font-bold">
                        Calo
                      </span>
                      <span className="text-xs font-bold">{item.cals}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-primary text-xs font-bold hover:underline mb-2 w-fit"
                  >
                    <span className="material-symbols-outlined text-sm">compare_arrows</span>
                    So sánh với món gốc
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/food/${item.id}`)}
                    className="w-full flex items-center justify-center rounded-lg h-11 px-4 bg-primary text-primary-foreground text-sm font-bold leading-normal hover:bg-primary/90 transition-colors"
                  >
                    <span className="material-symbols-outlined mr-2 text-lg">
                      add_shopping_cart
                    </span>
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <button
              type="button"
              className="px-8 py-3 bg-accent rounded-lg font-bold text-foreground hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              <span>Xem thêm gợi ý</span>
              <span className="material-symbols-outlined">expand_more</span>
            </button>
            <p className="text-muted-foreground text-sm italic">
              Các món được lọc theo hồ sơ &quot;Dị ứng đậu&quot; và &quot;Nhạy cảm gluten&quot; của bạn.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SafeAlternativesPage;
