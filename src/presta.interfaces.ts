export interface PrestaConfiguration {
  apiKey: string;
  imageApiKey?: string;
  shopUrl: string;
}
export interface Query {
  resource?: string;
  display?: string;
  filter?: any;
  sort?: string;
  limit?: string;
  search?: string;
  imageSizes?: any;
}
export enum ImageSize {
  cart_default,
  small_default,
  medium_default,
  large_default,
  thickbox_default,
  home_default,
  category_default
}
