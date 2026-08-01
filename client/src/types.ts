export interface Paste {
  id: string;
  title: string;
  content?: string;
  language: string;
  views: number;
  is_private: boolean;
  burn_after_reading: boolean;
  is_password_protected: boolean;
  expires_at: string | null;
  created_at: string;
  char_count?: number;
  delete_token?: string;
  url?: string;
  raw_url?: string;
}

export interface CreatePastePayload {
  title: string;
  content: string;
  language: string;
  is_private: boolean;
  burn_after_reading: boolean;
  password?: string;
  ttl: string;
  custom_id?: string;
}
