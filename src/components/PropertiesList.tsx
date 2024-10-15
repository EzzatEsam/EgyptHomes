"use server";

import { PaginatedResult } from "@/types/paginationResult";
import { PropertyPost } from "@/types/propertyPost";
import PropertyCard from "./PropertyCard";
import { PaginationBar } from "./PaginationBar";
import { cn } from "@/lib/utils";

export default async function PropertiesList({
  result,
  className,
}: {
  result: PaginatedResult<PropertyPost>;
  className?: string;
}) {
  const properties = result.results;
  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-4 items-center justify-items-center w-full ",
          className
        )}
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="flex items-center px-10">
        <PaginationBar
          currentPage={result.page}
          totalPages={result.totalPages}
          className="mx-auto"
        />
      </div>
    </>
  );
}
