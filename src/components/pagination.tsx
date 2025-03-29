import { PaginationMeta } from '@/types/types';
import { numberOfFloor } from '@/utils/numberOfFloor';
import { Pagination as PaginantionShadcn, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from './ui/pagination'

type Props = {
  filtersQuery?: any,
  total_pages: number,
  current_page: number,
  meta: PaginationMeta,
  fetchPage: ({ filters, page_number }:{filters: any, page_number: number}) => Promise<void>,
}

export const Pagination = ({ fetchPage, current_page, total_pages, filtersQuery={}, meta }: Props) => {

  const getPaginationItems = (currentPage: number, totalPages: number): (number | "ellipsis")[] => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages: (number | "ellipsis")[] = [1, 2, 3];
    
    if (currentPage > 4) {
        pages.push("ellipsis");
    }
    
    if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
    }
    
    if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
    }
    
    pages.push(totalPages - 2, totalPages - 1, totalPages);
    
    return [...new Set(pages.filter((page) => typeof page === "string" || (typeof page === "number" && page > 0 && page <= totalPages)))];
  };
      
  const pages = getPaginationItems(current_page, numberOfFloor(total_pages, meta.per_page));
    
  return (
    <PaginantionShadcn>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => fetchPage({ filters: filtersQuery, page_number: current_page - 1})} className={current_page === 1 ? "pointer-events-none opacity-50" : ""} />
        </PaginationItem>
        
        {/* page numbers */}
        {pages.map((page, index) => (
          <PaginationItem key={index}>
            {page === "ellipsis" ? <PaginationEllipsis /> : <PaginationLink isActive={page === current_page} onClick={() => fetchPage({ filters: filtersQuery, page_number: page}) }>{page}</PaginationLink>}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext onClick={() => fetchPage({ filters: filtersQuery, page_number: current_page + 1}) } className={(current_page === meta.last_page)  ? "pointer-events-none opacity-50" : ""} />
        </PaginationItem>
      </PaginationContent>
    </PaginantionShadcn>
  )
}