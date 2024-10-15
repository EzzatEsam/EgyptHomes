import LocationAdress from "./locationAdress";
import { PropertyCategory, PropertyType } from "./propertyPost";

export interface PropertyCreateRequest {
  title: string;
  description: string;
  price: number;
  location: LocationAdress;
  propertyType: PropertyType;
  contactPhone?: string;
  contactEmail?: string;
  category?: PropertyCategory;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  area: number;
  hasGarage?: boolean;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
  images: string[];
}
