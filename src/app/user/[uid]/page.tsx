import { FetchALlForUser } from "@/app/actions";
import PropertiesList from "@/components/PropertiesList";
import { PaginationRequest } from "@/types/PaginationRequest";

interface PageProps {
  params: { uid: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ params, searchParams }: PageProps) {
  const uid = params.uid;
  const pgRequest: PaginationRequest = {
    pageNumber: searchParams.pageNumber ? Number(searchParams.pageNumber) : 1,
    pageSize: searchParams.pageSize ? Number(searchParams.pageSize) : 10,
  };

  const result = await FetchALlForUser(uid, pgRequest);
  return (
    <>
      <h1 className="text-4xl font-bold w-full text-center mt-8">
        Posted ({result.totalResults})
      </h1>
      <PropertiesList result={result} />;
    </>
  );
}
