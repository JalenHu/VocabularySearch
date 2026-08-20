import "./Pagination.css";

/**
 * Bottom pagination bar: 前一頁/後一頁 buttons plus a dropdown to jump to
 * any page. Only rendered by the caller when there's more than one page.
 */
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="分頁">
      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ‹ 前一頁
      </button>

      <label className="pagination__jump">
        <span className="pagination__jump-label">第</span>
        <select
          className="pagination__select"
          value={currentPage}
          onChange={(e) => onPageChange(Number(e.target.value))}
        >
          {pageNumbers.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span className="pagination__jump-label">頁，共 {totalPages} 頁</span>
      </label>

      <button
        type="button"
        className="pagination__button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        後一頁 ›
      </button>
    </nav>
  );
}
