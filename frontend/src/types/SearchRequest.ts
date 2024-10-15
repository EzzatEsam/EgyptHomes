import { PropertyCategory, PropertyType } from "./propertyPost";

export interface PropertySearchDTO {
  city?: string;
  governorate?: string;
  minBathrooms?: number;
  minBedrooms?: number;
  street?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  propertyCategory?: PropertyCategory;
  hasGarage?: boolean;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
