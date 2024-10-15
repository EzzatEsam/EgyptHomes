import { PaginationRequest } from "@/types/PaginationRequest";
import { FetchFavourites } from "../actions";
import PropertiesList from "@/components/PropertiesList";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const session = await getAuth();
  if (! session) {
    redirect("/login");
  }
  const pgRequest: PaginationRequest = {
    pageNumber: searchParams.pageNumber ? Number(searchParams.pageNumber) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
  };

  const response = await FetchFavourites(pgRequest);
  return (
    <>
      <h1 className="text-4xl font-bold w-full text-center mt-8">
        Favourites ({response.totalResults})
      </h1>
      <PropertiesList result={response} />;
    </>
  );
}
