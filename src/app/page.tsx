import { FetchRecentProperties } from "./actions";
import SearchBar from "@/components/SearchBar";
import PropertiesList from "@/components/PropertiesList";
import { PaginationRequest } from "@/types/PaginationRequest";

// const propertyData: PropertyPost = {
//   id: 1,
//   title: "Luxury villa with 5 bedrooms",
//   price: 20000,
//   location: {
//     city: "6 October City",
//     governorate: "Giza",
//     street: "Badya Palm Hills",
//     latitude: 30.032,
//     longitude: 31.209,
//   }, // Assuming this structure
//   description: "Luxury villa in a prime location",
//   contactPhone: "+201234567890",
//   contactEmail: "info@example.com",
//   category: PropertyCategory.Villa,
//   numberOfBedrooms: 5,
//   numberOfBathrooms: 3,
//   images: [
//     "/5-1319p1.webp",
//     "/55949-1200.jpg",
//     "/the-destination-front-rendering_m.webp",
//   ],
//   area: 400,
//   hasGarage: true,
//   createdAt: new Date(),
//   propertyType: PropertyType.Buy,
// };
export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const pgRequest: PaginationRequest = {
    pageNumber: searchParams.pageNumber ? Number(searchParams.pageNumber) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
  };
  const result = await FetchRecentProperties(pgRequest);
  return (
    <>
      <SearchBar className="mt-1"></SearchBar>
      <h1 className="text-4xl font-bold w-full text-center mt-8">
        Recent ({result.totalResults})
      </h1>
      <PropertiesList result={result} />;
    </>
  );
}
