export interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  description: string;
}

export interface CartItem {
  id?: string;
  quantity: number;
  price?: number;
  image: string;
  name: string;
}