import { PropertyCategory, PropertyType } from "@/types/propertyPost";
import { PropertySearchDTO } from "@/types/SearchRequest";
import { FetchSearchResults } from "../actions";
import PropertiesList from "@/components/PropertiesList";
import SearchBar from "@/components/SearchBar";
import { PaginationRequest } from "@/types/PaginationRequest";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
export default async function SearchPage({ searchParams }: PageProps) {
  const searchParamsTyped: PropertySearchDTO = searchParams;
  const searchRequest: PropertySearchDTO = {
    city: searchParamsTyped.city ?? undefined,
    governorate: searchParamsTyped.governorate ?? undefined,
    street: searchParamsTyped.street ?? undefined,
    propertyType: searchParamsTyped.propertyType
      ? PropertyType[
          searchParamsTyped.propertyType as keyof typeof PropertyType
        ]
      : undefined,
    propertyCategory: searchParamsTyped.propertyCategory
      ? PropertyCategory[
          searchParamsTyped.propertyCategory as keyof typeof PropertyCategory
        ]
      : undefined,
    hasGarage: searchParams.hasGarage === "on" ? true : false,
    hasSwimmingPool: searchParams.hasSwimmingPool === "on" ? true : false,
    hasGarden: searchParams.hasGarden === "on" ? true : false,
    hasAirConditioning: searchParams.hasAirConditioning === "on" ? true : false,
    minPrice: searchParamsTyped.minPrice
      ? Number(searchParamsTyped.minPrice)
      : undefined,
    maxPrice: searchParamsTyped.maxPrice
      ? Number(searchParamsTyped.maxPrice)
      : undefined,
  };

  const pgRequest: PaginationRequest = {
    pageNumber: searchParams.pageNumber ? Number(searchParams.pageNumber) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
  };
  const response = await FetchSearchResults(searchRequest, pgRequest);

  return (
    <>
      <SearchBar className="mt-1" searchParams={searchRequest}></SearchBar>
      <h1 className="text-4xl font-bold w-full text-center mt-8">
        Search Results ({response.totalResults})
      </h1>
      <PropertiesList result={response} />;
    </>
  );
}
