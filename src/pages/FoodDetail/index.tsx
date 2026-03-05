import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import { useToast, ToastContainer } from "@/hooks/useToast";
import productAPI from "@/services/product.service";
import type { Product } from "@/types/product";
import VariantModal from "@/components/model/VariantModel";

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const { addItem } = useCart();
  const { toasts, toast, dismiss } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [openVariantModal, setOpenVariantModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await productAPI.getProductById(id);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast("Không tìm thấy sản phẩm", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const hasVariants = (product as any).variants?.length > 0;
    if (hasVariants) {
      setOpenVariantModal(true);
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      image:
        typeof product.image === "object"
          ? product.image.secure_url
          : product.image,
      price: Number(product?.price ?? 0),
      quantity,
    });

    toast(t("customer:foodCard.addToCart", "Đã thêm vào giỏ hàng!"), "success");
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-background-light font-display min-h-screen flex flex-col antialiased selection:bg-primary/20 relative">
      {/* Main Content */}
      <main className="grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6 md:py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-gray-500">
              Đang tải hương vị đặc sắc...
            </p>
          </div>
        ) : !product ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
              error
            </span>
            <h2 className="text-2xl font-bold">Không tìm thấy sản phẩm này</h2>
            <button
              onClick={() => navigate("/menu")}
              className="mt-4 text-primary font-bold underline"
            >
              Quay lại thực đơn
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
              {/* LEFT COLUMN: Sticky Hero Image */}
              <div className="relative lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-8rem)] flex flex-col">
                <div className="relative w-full h-full min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden shadow-lg group bg-gray-100">
                  <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${
                        typeof product.image === "object"
                          ? product.image.secure_url
                          : product.image
                      })`,
                    }}
                  ></div>
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-text-main dark:text-white shadow-sm">
                      <span className="material-symbols-outlined text-orange-500 text-[16px] fill">
                        local_fire_department
                      </span>
                      Phổ biến
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary shrink-0 bg-gray-100">
                    <img
                      src={
                        typeof product.image === "object"
                          ? product.image.secure_url
                          : product.image
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Details & Actions */}
              <div className="flex flex-col h-full pt-2">
                <nav className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                  <Link
                    className="text-[#9e6b47] hover:text-primary font-medium transition-colors"
                    to="/menu"
                  >
                    {t("customer:menu.title")}
                  </Link>
                  <span className="text-[#9e6b47]/60">/</span>
                  <span className="text-text-main dark:text-white font-semibold">
                    {product.name}
                  </span>
                </nav>

                <div className="mb-6">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-text-main dark:text-white tracking-tight leading-[1.1] mb-3">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl md:text-3xl font-bold text-primary">
                      {Number(product?.price ?? 0).toLocaleString("vi-VN")}đ
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-yellow-400 text-[20px] fill-1">
                        star
                      </span>
                      <span className="text-sm font-bold text-text-main dark:text-white">
                        {Number(product?.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({Number(product?.review_count ?? 0)}+ đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="p-3 bg-linear-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-[28px]">
                        verified_user
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-[#064e3b] dark:text-emerald-400 mb-2">
                        NutriAI™ Verified Healthy
                      </h3>
                      <p className="text-sm text-[#065f46]/80 dark:text-emerald-300/80 mb-4">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.health_tags?.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">
                    {t("customer:foodDetail.description")}
                  </h3>
                  <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {product.description ||
                      "Đang cập nhật giới thiệu cho món ăn tuyệt vời này..."}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 sticky bottom-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg pb-4 z-20 -mx-4 px-4 md:mx-0 md:rounded-2xl">
                  <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                    <div className="flex items-center justify-between bg-background-light dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-2 h-14 min-w-[140px]">
                      <button
                        onClick={handleDecrease}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">
                          remove
                        </span>
                      </button>
                      <span className="font-bold text-lg text-text-main dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrease}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-14 bg-primary text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all"
                    >
                      <span className="material-symbols-outlined">
                        shopping_bag
                      </span>
                      <span>
                        Thêm vào giỏ hàng •{" "}
                        {(
                          Number(product?.price ?? 0) * quantity
                        ).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEWS SECTION */}
            <section className="mb-16 max-w-5xl">
              <h2 className="text-2xl font-bold text-text-main dark:text-white mb-8">
                {t("customer:foodDetail.reviews")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 h-fit text-center">
                  <span className="text-5xl font-extrabold text-text-main dark:text-white mb-2">
                    {Number(product?.rating ?? 0).toFixed(1)}
                  </span>
                  <div className="flex justify-center gap-1 text-yellow-400 mb-2 mt-2">
                    <span className="material-symbols-outlined fill-1">
                      star
                    </span>
                    <span className="material-symbols-outlined fill-1">
                      star
                    </span>
                    <span className="material-symbols-outlined fill-1">
                      star
                    </span>
                    <span className="material-symbols-outlined fill-1">
                      star
                    </span>
                    <span className="material-symbols-outlined">star_half</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Dựa trên {Number(product?.review_count ?? 0)} đánh giá
                  </p>
                </div>
                <div className="md:col-span-2 space-y-4">
                  <p className="text-gray-500 italic">
                    Chưa có nhận xét chi tiết cho sản phẩm này.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
      <VariantModal
        open={openVariantModal}
        onClose={() => setOpenVariantModal(false)}
        productName={product?.name ?? ""}
        basePrice={Number(product?.price ?? 0)}
        variants={(product as any)?.variants ?? []}
        quantity={quantity}
        toastError={(msg) => toast(msg, "error")}
        onConfirm={({ variations, unitPrice }) => {
          if (!product) return;

          addItem({
            productId: product._id,
            name: product.name,
            image:
              typeof product.image === "object"
                ? product.image.secure_url
                : product.image,
            price: unitPrice,
            quantity,
            variations,
          });

          toast(
            t("customer:foodCard.addToCart", "Đã thêm vào giỏ hàng!"),
            "success",
          );
        }}
      />
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
};

export default FoodDetailPage;
