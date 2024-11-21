export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: Category;
  details?: Detail[];
  sizes?: Size[];
  colors?: Color[];
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Detail {
  title: string;
  content: string;
}
export type Size = string;

export interface Color {
  name: string;
  hex: string;
}

export type SelectedOptions = {
  size?: Size;
  color?: Color["name"];
};

export interface CartItem {
  id: number;
  product: Product;
  options: SelectedOptions;
  quantity: number;
}

export type Cart = CartItem[];
