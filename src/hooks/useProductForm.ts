import { useState, useCallback } from "react";
import productService from "@/services/product.service";
import type { Product } from "@/types/product";

// ---- Constants ----

export const CATEGORIES = [
  "Món chính",
  "Khai vị",
  "Đồ uống",
  "Tráng miệng",
  "Đồ ăn nhanh",
  "Salad",
];

export const HEALTH_TAG_OPTIONS = [
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

// ---- Types ----

export interface RecipeItem {
  name: string;
  quantity: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category: string;
  restaurant: string;
  time: string;
  health_warning: string;
  health_tags: string[];
  tags: string[];
  recipe: RecipeItem[];
}

const DEFAULT_FORM: ProductFormData = {
  name: "",
  description: "",
  price: "",
  category: CATEGORIES[0],
  restaurant: "FoodieDash Central",
  time: "20-30 min",
  health_warning: "",
  health_tags: [],
  tags: [],
  recipe: [],
};

/**
 * Chuyển Product (từ API) thành ProductFormData (cho form).
 * Dùng khi mode === 'edit' để pre-fill.
 */
const productToFormData = (product: Product): ProductFormData => ({
  name: product.name,
  description: product.description,
  price: String(product.price),
  category: product.category,
  restaurant: product.restaurant,
  time: product.time,
  health_warning: product.health_warning ?? "",
  health_tags: product.health_tags ?? [],
  tags: product.tags ?? [],
  recipe: product.recipe ?? [],
});

// ---- Hook ----

interface UseProductFormParams {
  mode: "add" | "edit";
  product?: Product | null;
  onSuccess: () => void;
  onClose: () => void;
}

export const useProductForm = ({
  mode,
  product,
  onSuccess,
  onClose,
}: UseProductFormParams) => {
  const [formData, setFormData] = useState<ProductFormData>(
    mode === "edit" && product ? productToFormData(product) : DEFAULT_FORM,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    // Khi edit, hiển thị ảnh hiện tại nếu có
    mode === "edit" && product
      ? typeof product.image === "object"
        ? product.image.secure_url
        : ""
      : "",
  );

  // ---- Field Handlers ----

  const updateField = useCallback(
    <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    [],
  );

  const toggleHealthTag = useCallback((label: string) => {
    setFormData((prev) => ({
      ...prev,
      health_tags: prev.health_tags.includes(label)
        ? prev.health_tags.filter((t) => t !== label)
        : [...prev.health_tags, label],
    }));
  }, []);

  // ---- Recipe Handlers ----

  const addRecipeItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      recipe: [...prev.recipe, { name: "", quantity: "" }],
    }));
  }, []);

  const updateRecipeItem = useCallback(
    (index: number, field: keyof RecipeItem, value: string) => {
      setFormData((prev) => {
        const updated = [...prev.recipe];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, recipe: updated };
      });
    },
    [],
  );

  const removeRecipeItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      recipe: prev.recipe.filter((_, i) => i !== index),
    }));
  }, []);

  // ---- Submit ----

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        // Lọc recipe items rỗng
        const cleanRecipe = formData.recipe.filter(
          (r) => r.name.trim() && r.quantity.trim(),
        );

        const payload: Record<string, any> = {
          ...formData,
          price: Number(formData.price),
          recipe: cleanRecipe,
        };

        // Nếu có ảnh mới → upload trước
        if (imageFile) {
          const uploadRes = await productService.uploadImage(imageFile);
          payload.image = uploadRes._id; // MongoDB ObjectId từ FileModel
        }

        if (mode === "add") {
          await productService.createProduct(payload);
        } else if (mode === "edit" && product) {
          await productService.updateProduct(product._id, payload);
        }

        onSuccess();
        onClose();
        resetForm();
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          `Lỗi khi ${mode === "add" ? "thêm" : "cập nhật"} sản phẩm`;
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [formData, imageFile, mode, product, onSuccess, onClose],
  );

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM);
    setImageFile(null);
    setImagePreview("");
    setError("");
  }, []);

  return {
    formData,
    loading,
    error,
    imagePreview,
    updateField,
    handleImageChange,
    toggleHealthTag,
    addRecipeItem,
    updateRecipeItem,
    removeRecipeItem,
    handleSubmit,
    resetForm,
  };
};
