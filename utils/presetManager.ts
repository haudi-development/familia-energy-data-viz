import { ChartPreset } from '@/types';

const PRESET_STORAGE_KEY = 'chart-presets';

export const savePreset = (preset: ChartPreset): void => {
  if (typeof window === 'undefined') return;

  const existingPresets = getPresets();
  const updatedPresets = existingPresets.filter(p => p.id !== preset.id);
  updatedPresets.push(preset);

  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(updatedPresets));
};

export const getPresets = (): ChartPreset[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(PRESET_STORAGE_KEY);
  if (!stored) return [];

  try {
    const presets = JSON.parse(stored);
    // Convert date strings back to Date objects
    return presets.map((p: ChartPreset & { createdAt: string | Date; updatedAt: string | Date; dateRange: { start: string | Date; end: string | Date } }) => ({
      ...p,
      dateRange: {
        start: new Date(p.dateRange.start),
        end: new Date(p.dateRange.end)
      },
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to parse presets:', error);
    return [];
  }
};

export const deletePreset = (id: string): void => {
  if (typeof window === 'undefined') return;

  const presets = getPresets();
  const updatedPresets = presets.filter(p => p.id !== id);

  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(updatedPresets));
};

export const getPresetById = (id: string): ChartPreset | null => {
  const presets = getPresets();
  return presets.find(p => p.id === id) || null;
};

export const updatePreset = (id: string, updates: Partial<ChartPreset>): void => {
  const presets = getPresets();
  const index = presets.findIndex(p => p.id === id);

  if (index !== -1) {
    presets[index] = {
      ...presets[index],
      ...updates,
      updatedAt: new Date()
    };

    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(presets));
  }
};