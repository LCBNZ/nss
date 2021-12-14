import {
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/solid";

import { PaginationBtn } from "./Button";
import { NavigatePageButton } from "./NavigatePageButton";

export function Pagination({
  state,
  pageOptions,
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
  setPageSize,
  gotoPage,
  pageCount,
}) {
  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex-1 flex justify-between sm:hidden">
        <PaginationBtn onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </PaginationBtn>
        <PaginationBtn onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </PaginationBtn>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div className="flex gap-x-2 items-baseline">
          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
            <span className="font-medium">{pageOptions.length}</span>
          </span>
        </div>
        <div>
          <nav className="z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <NavigatePageButton
              className="rounded-l-md"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">First</span>
              <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </NavigatePageButton>
            <NavigatePageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </NavigatePageButton>
            <NavigatePageButton onClick={() => nextPage()} disabled={!canNextPage}>
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </NavigatePageButton>
            <NavigatePageButton
              className="rounded-r-md"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Last</span>
              <ChevronDoubleRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </NavigatePageButton>
          </nav>
        </div>
      </div>
    </div>
  );
}
