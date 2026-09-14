export interface Book {
  id: number;
  title: string;
  author?: string;
  description?: string;
  google_books_id?: string;
  open_library_id?: string;
  cover_art_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Edition {
  id: number;
  book_id: number;
  title?: string;
  retailer: string;
  retailer_url?: string;
  price?: number;
  isbn?: string;
  cover_art_url?: string;
  has_sprayed_edges?: boolean;
  has_dust_jacket?: boolean;
  is_naked_book?: boolean;
  illustrations?: string;
  introductions?: string;
  special_features?: string[];
  availability?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  created_at: Date;
}

export interface CuratedList {
  id: number;
  title: string;
  slug: string;
  description?: string;
  created_at: Date;
}
