export interface IProperty {
  title: string;
  description: string;

  address: string;
  city: string;
  area?: string;
  zipCode?: string;

  rent: number;
  bedrooms: number;
  bathrooms: number;
  size?: number;

  amenities: string[];
  images: string[];

  categoryId: string;
}
