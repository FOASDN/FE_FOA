/**
 * Shared preference constants used by both Onboarding and Profile Settings.
 * Single source of truth — never duplicate these lists.
 */

export interface DietOption {
  id: string;
  label: string;
  icon: string;
}

export interface AllergyOption {
  id: string;
  label: string;
  icon: string;
  colorClass: string;
}

export interface HealthGoalOption {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

export const DIET_OPTIONS: DietOption[] = [
  { id: 'vegetarian',           label: 'Ăn chay',               icon: 'eco' },
  { id: 'vegan',                label: 'Thuần chay',             icon: 'spa' },
  { id: 'keto',                 label: 'Keto',                   icon: 'local_fire_department' },
  { id: 'paleo',                label: 'Paleo',                  icon: 'forest' },
  { id: 'pescatarian',          label: 'Ăn cá',                  icon: 'phishing' },
  { id: 'low-carb',             label: 'Ít carb',                icon: 'grain' },
  { id: 'gluten-free',          label: 'Không gluten',           icon: 'no_food' },
  { id: 'mediterranean',        label: 'Địa Trung Hải',          icon: 'travel_explore' },
  { id: 'high-protein',         label: 'Nhiều protein',          icon: 'fitness_center' },
  { id: 'intermittent-fasting', label: 'Nhịn ăn gián đoạn',     icon: 'schedule' },
];

export const ALLERGY_OPTIONS: AllergyOption[] = [
  {
    id: 'peanuts',
    label: 'Đậu phộng',
    icon: 'spa',
    colorClass: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
  },
  {
    id: 'tree-nuts',
    label: 'Hạt cây',
    icon: 'forest',
    colorClass: 'bg-lime-100 dark:bg-lime-900/30 text-lime-700 dark:text-lime-400',
  },
  {
    id: 'shellfish',
    label: 'Hải sản có vỏ',
    icon: 'set_meal',
    colorClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'fish',
    label: 'Cá',
    icon: 'phishing',
    colorClass: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  },
  {
    id: 'eggs',
    label: 'Trứng',
    icon: 'egg',
    colorClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  },
  {
    id: 'dairy',
    label: 'Sữa & Lactose',
    icon: 'water_drop',
    colorClass: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  },
  {
    id: 'wheat',
    label: 'Lúa mì',
    icon: 'grain',
    colorClass: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'soy',
    label: 'Đậu nành',
    icon: 'grass',
    colorClass: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
  },
  {
    id: 'sesame',
    label: 'Mè / Vừng',
    icon: 'scatter_plot',
    colorClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-500 dark:text-yellow-400',
  },
  {
    id: 'gluten',
    label: 'Gluten',
    icon: 'bakery_dining',
    colorClass: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  },
];

export const HEALTH_GOALS: HealthGoalOption[] = [
  { id: 'weight-loss',  label: 'Giảm cân',              icon: 'monitoring',        desc: 'Kiểm soát calo & chất béo' },
  { id: 'muscle-gain',  label: 'Tăng cơ',               icon: 'fitness_center',    desc: 'Tăng khẩu phần protein' },
  { id: 'energy',       label: 'Năng lượng',             icon: 'bolt',              desc: 'Duy trì sức bền cả ngày' },
  { id: 'digestion',    label: 'Tiêu hóa tốt',           icon: 'favorite',          desc: 'Nhiều chất xơ & men vi sinh' },
  { id: 'heart-health', label: 'Tim mạch',               icon: 'cardiology',        desc: 'Ít muối, ít chất béo bão hòa' },
  { id: 'balance',      label: 'Dinh dưỡng cân bằng',   icon: 'balance',           desc: 'Đầy đủ dưỡng chất mỗi ngày' },
];

/** Key for saving pending onboarding prefs to localStorage (before login). */
export const PENDING_PREFS_KEY = 'pending_onboarding_prefs';

export interface PendingPreferences {
  dietary: string[];
  allergies: string[];
  health_goals: string[];
}
