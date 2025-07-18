export interface PrayerRequest {
  id: string;
  text: string;
  name?: string; // Nome opcional (null = anônimo)
  category: 'saude' | 'familia' | 'trabalho' | 'financeiro' | 'espiritual' | 'outros';
  user_id?: string;
  prayer_count: number;
  created_at: string;
  updated_at: string;
}

export interface PrayerInteraction {
  id: string;
  prayer_request_id: string;
  user_id: string;
  created_at: string;
}

export interface Profile {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export const PRAYER_CATEGORIES = {
  saude: '🙏 Saúde',
  familia: '👨‍👩‍👧‍👦 Família',
  trabalho: '💼 Trabalho',
  financeiro: '💰 Financeiro',
  espiritual: '✨ Espiritual',
  outros: '💝 Outros'
} as const;

export type PrayerCategory = keyof typeof PRAYER_CATEGORIES;