import React, { useState } from "react";
import { clsx } from "clsx";
import productService from "@/services/product.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const HEALTH_TAG_OPTIONS = [
  {
    id: "heart_healthy",
    label: "Tốt cho tim mạch",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    id: "low_sugar",
    label: "Ít đường",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "low_fat",
    label: "Ít béo",
    color: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  {
    id: "high_protein",
    label: "Nhiều đạm",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  {
    id: "keto",
    label: "Keto",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    id: "vegan",
    label: "Món chay",
    color: "bg-teal-100 text-teal-700 border-teal-200",
  },
  {
    id: "warning_sodium",
    label: "Cảnh báo: Cao Natri",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "warning_sugar",
    label: "Cảnh báo: Nhiều đường",
    color: "bg-rose-100 text-rose-700 border-rose-200",
  },
];

const CATEGORIES = [
  "Món chính",
  "Khai vị",
  "Đồ uống",
  "Tráng miệng",
  "Đồ ăn nhanh",
  "Salad",
];

const AddProductModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORIES[0],
    restaurant: "FoodieDash Central",
    time: "20-30 min",
    health_warning: "",
    health_tags: [] as string[],
    tags: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageId = "";
      if (imageFile) {
        const uploadRes = await productService.uploadImage(imageFile);
        imageId = uploadRes._id;
      }

      await productService.createProduct({
        ...formData,
        price: Number(formData.price),
        image: imageId,
      } as any);
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: CATEGORIES[0],
        restaurant: "FoodieDash Central",
        time: "20-30 min",
        health_warning: "",
        health_tags: [],
        tags: [],
      });
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Lỗi khi thêm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleHealthTag = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      health_tags: prev.health_tags.includes(label)
        ? prev.health_tags.filter((t) => t !== label)
        : [...prev.health_tags, label],
    }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Thêm món ăn mới
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar"
        >
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-2 rounded-r-lg">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Ảnh món ăn
            </label>
            <div
              onClick={() => document.getElementById("product-image")?.click()}
              className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-500 hover:bg-orange-50/30 transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-2 group"
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined">edit</span>{" "}
                      Thay đổi ảnh
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-100 group-hover:text-orange-500 transition-colors">
                    <span className="material-symbols-outlined text-3xl">
                      add_a_photo
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-700">
                      Nhấn để tải lên ảnh
                    </p>
                    <p className="text-xs text-gray-400">
                      Hỗ trợ JPG, PNG (Tối đa 5MB)
                    </p>
                  </div>
                </>
              )}
            </div>
            <input
              id="product-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Tên món ăn <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                placeholder="Ví dụ: Burger Gà Cay"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                placeholder="Ví dụ: 89000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              Mô tả món ăn <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
              placeholder="Mô tả thành phần, hương vị..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all appearance-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Thời gian chuẩn bị
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                placeholder="Ví dụ: 15-20 min"
              />
            </div>
          </div>

          <div className="space-y-3 pb-2 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-green-600">
                health_and_safety
              </span>
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Thẻ sức khỏe & Cảnh báo
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {HEALTH_TAG_OPTIONS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleHealthTag(tag.label)}
                  className={clsx(
                    "px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95",
                    formData.health_tags.includes(tag.label)
                      ? tag.color
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300",
                  )}
                >
                  {tag.label}
                  {formData.health_tags.includes(tag.label) && (
                    <span className="ml-1">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Cảnh báo sức khỏe cụ thể (Ghi chú thêm)
            </label>
            <input
              type="text"
              value={formData.health_warning}
              onChange={(e) =>
                setFormData({ ...formData, health_warning: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
              placeholder="Ví dụ: Không phù hợp cho người dị ứng lạc"
            />
          </div>

          <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100 flex gap-4 pt-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-2 h-12 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 shadow-lg shadow-orange-600/25 transition-all disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Lưu sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
