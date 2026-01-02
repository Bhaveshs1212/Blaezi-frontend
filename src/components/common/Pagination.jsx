export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              page === currentPage ? "bg-black text-white" : ""
            }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}

