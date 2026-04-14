export const renderPagination = (currentPage: number, totalPages: number): string => {
  if (totalPages <= 1) return '';

  let html = '<div class="pagination">';
  
  if (currentPage > 1) {
    html += `<button class="page-btn" data-page="${currentPage - 1}">Előző</button>`;
  } else {
    html += `<button class="page-btn disabled" disabled>Előző</button>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    html += `<button class="page-btn ${activeClass}" data-page="${i}">${i}</button>`;
  }

  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">Következő</button>`;
  } else {
    html += `<button class="page-btn disabled" disabled>Következő</button>`;
  }

  html += '</div>';

  return html;
};
