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
  { id: 'heart_healthy', label: 'Tốt cho tim mạch', icon: 'favorite' },
  { id: 'low_sugar', label: 'Ít đường', icon: 'opacity' },
  { id: 'low_fat', label: 'Ít béo', icon: 'fitness_center' },
  { id: 'high_protein', label: 'Nhiều đạm', icon: 'bolt' },
  { id: 'keto', label: 'Keto', icon: 'local_fire_department' },
  { id: 'vegan', label: 'Món chay', icon: 'eco' },
  { id: 'warning_sodium', label: 'Cảnh báo: Cao Natri', icon: 'warning' },
  { id: 'warning_sugar', label: 'Cảnh báo: Nhiều đường', icon: 'warning' },
];

// ALLERGY_OPTIONS removed - now fetched dynamically from backend ingredients

export const HEALTH_GOALS: HealthGoalOption[] = [
  { id: 'weight-loss', label: 'Giảm cân', icon: 'monitoring', desc: 'Kiểm soát calo & chất béo' },
  { id: 'muscle-gain', label: 'Tăng cơ', icon: 'fitness_center', desc: 'Tăng khẩu phần protein' },
  { id: 'energy', label: 'Năng lượng', icon: 'bolt', desc: 'Duy trì sức bền cả ngày' },
  { id: 'digestion', label: 'Tiêu hóa tốt', icon: 'favorite', desc: 'Nhiều chất xơ & men vi sinh' },
  { id: 'heart-health', label: 'Tim mạch', icon: 'cardiology', desc: 'Ít muối, ít chất béo bão hòa' },
  { id: 'balance', label: 'Dinh dưỡng cân bằng', icon: 'balance', desc: 'Đầy đủ dưỡng chất mỗi ngày' },
];

/** Key for saving pending onboarding prefs to localStorage (before login). */
export const PENDING_PREFS_KEY = 'pending_onboarding_prefs';

export interface PendingPreferences {
  dietary: string[];
  allergies: string[];
  health_goals: string[];
}
