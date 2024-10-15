"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

export function PaginationBar({
  currentPage,
  totalPages,
  className,
}: {
  currentPage: number;
  totalPages: number;
  className?: string;
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const rightDiff = totalPages - currentPage;
  const leftDiff = currentPage - 1;
  let start = currentPage - 4;
  let end = currentPage + 5;
  if (leftDiff < 5) {
    end = 10;
  } else if (rightDiff < 5) {
    start = totalPages - 9;
    end = totalPages;
  }

  start = Math.max(1, start);
  end = Math.min(totalPages, end);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const onChangePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageNumber", page.toString());

    router.push(`${path}?${params.toString()}`);
  };
  const startFar = currentPage - 9 > 1;
  const endFar = currentPage + 9 < totalPages;
  return (
    <div className={cn("join m-4 bg-base-100  ", className)}>
      <a
        className={`join-item btn ${currentPage > 1 ? "" : "btn-disabled"}`}
        onClick={() => onChangePage(currentPage - 1)}
      >
        «
      </a>
      {startFar && (
        <>
          <a className="join-item btn" onClick={() => onChangePage(1)}>
            1
          </a>
          <a className="join-item btn btn-disabled">...</a>
        </>
      )}

      {pages.map((page) => (
        <a
          key={page}
          className={`join-item btn ${
            currentPage === page ? "btn-active" : ""
          }`}
          onClick={() => onChangePage(page)}
        >
          {page}
        </a>
      ))}

      {endFar && (
        <>
          <a className="join-item btn btn-disabled">...</a>
          <a className="join-item btn" onClick={() => onChangePage(totalPages)}>
            {totalPages}
          </a>
        </>
      )}
      <a
        className={`join-item btn ${
          currentPage === totalPages ? "btn-disabled" : ""
        }`}
        onClick={() => onChangePage(currentPage + 1)}
      >
        »
      </a>
    </div>
  );
}
