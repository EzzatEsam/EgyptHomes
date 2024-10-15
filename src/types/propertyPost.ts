import LocationAdress from "@/types/locationAdress";
import { UserDTO } from "./user";

export interface PropertyPost {
  id: number;
  title: string;
  description: string;
  price: number;
  location: LocationAdress;
  propertyType?: PropertyType;
  contactPhone?: string;
  contactEmail?: string;
  category?: PropertyCategory;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  images?: string[];
  area: number;
  hasGarage?: boolean;
  hasSwimmingPool?: boolean;
  hasGarden?: boolean;
  hasAirConditioning?: boolean;
  createdAt: Date;
  user: UserDTO;
  isFavorited?: boolean;
}

export enum PropertyType {
  Rent = "Rent",
  Buy = "Buy",
}

export const PropertyTypeList = Object.values(PropertyType).map((value) => {
  return value;
});
export enum PropertyCategory {
  House = "House",
  DetachedHouse = "DetachedHouse",
  SemiDetachedHouse = "SemiDetachedHouse",
  Townhouse = "Townhouse",
  Bungalow = "Bungalow",

  Flat = "Flat",
  StudioFlat = "StudioFlat",
  Penthouse = "Penthouse",
  Duplex = "Duplex",

  Office = "Office",
  SharedOffice = "SharedOffice",
  PrivateOffice = "PrivateOffice",
  CoWorkingSpace = "CoWorkingSpace",

  Shop = "Shop",
  RetailStore = "RetailStore",
  Supermarket = "Supermarket",
  Boutique = "Boutique",

  Villa = "Villa",
  BeachVilla = "BeachVilla",
  MountainVilla = "MountainVilla",

  Pharmacy = "Pharmacy",
  Clinic = "Clinic",
}

export const PropertyCategoryList = Object.values(PropertyCategory).map(
  (value) => {
    return value;
  }
);
