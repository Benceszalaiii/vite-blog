import { fetchPosts, fetchCategories } from '../api';
import { renderNavbar, attachNavbarEvents } from '../components/navbar';
import { renderPagination } from '../components/pagination';
import { Post, Category } from '../types';

let currentPage = 1;
const limit = 6;
let currentSearch = '';
let currentCategory = '';
let categoriesMap: Map<number, Category> = new Map();

export const renderHome = async (container: HTMLElement) => {
  container.innerHTML = `
    ${renderNavbar()}
    <header class="hero">
      <div class="hero-content">
    <h1>Üdvözlünk a <span>Vite Blogon</span></h1>
        <p>Fedezd fel a legfrissebb cikkeket technológia, tudomány és kultúra témában, és merülj el a jövő ígéreteiben.</p>
      </div>
    </header>
    <main class="home-main">
      <section class="filters-section">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="search-input" placeholder="Keresés cím alapján..." value="${currentSearch}">
        </div>
        <div class="filter-box">
          <select id="category-select">
            <option value="">Összes kategória</option>
          </select>
        </div>
      </section>
      
      <section id="posts-container" class="posts-grid">
        <div class="loader"></div>
      </section>

      <section id="pagination-container"></section>
    </main>
  `;

  attachNavbarEvents();

  // Load categories
  try {
    const categories = await fetchCategories();
    categories.forEach(cat => categoriesMap.set(cat.id, cat));
    
    const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id.toString();
      option.textContent = cat.name;
      if (currentCategory === cat.id.toString()) option.selected = true;
      categorySelect.appendChild(option);
    });

    // Attach filter events
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    searchInput.addEventListener('input', (e) => {
      currentSearch = (e.target as HTMLInputElement).value;
      currentPage = 1; // Reset to first page
      loadAndRenderPosts();
    });

    categorySelect.addEventListener('change', (e) => {
      currentCategory = (e.target as HTMLSelectElement).value;
      currentPage = 1; // Reset to first page
      loadAndRenderPosts();
    });

    // Initial load
    await loadAndRenderPosts();

  } catch (error) {
    document.getElementById('posts-container')!.innerHTML = '<div class="error">Hiba történt az adatok betöltésekor. Kérjük, indítsd el a backendet!</div>';
  }
};

const loadAndRenderPosts = async () => {
  const postsContainer = document.getElementById('posts-container');
  const paginationContainer = document.getElementById('pagination-container');
  if (!postsContainer || !paginationContainer) return;

  postsContainer.innerHTML = '<div class="loader"></div>';

  try {
    const { posts, totalCount } = await fetchPosts(currentPage, limit, currentSearch, currentCategory);
    
    if (posts.length === 0) {
      postsContainer.innerHTML = '<div class="empty-state">Nincs a feltételeknek megfelelő bejegyzés.</div>';
      paginationContainer.innerHTML = '';
      return;
    }

    postsContainer.innerHTML = posts.map(post => {
      const categoryName = categoriesMap.get(post.categoryId)?.name || 'Ismeretlen';
      const defaultImg = 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&q=80&w=800&h=450';
      
      return `
        <article class="post-card">
          <div class="post-image">
            <img src="${post.boritekep || defaultImg}" alt="${post.cim}" loading="lazy" />
            <span class="post-category">${categoryName}</span>
          </div>
          <div class="post-content">
            <h2 class="post-title"><a href="#/blog/${post.id}">${post.cim}</a></h2>
            <p class="post-excerpt">${post.kivonat}</p>
            <div class="post-meta">
              <div class="post-author">
                <div class="author-avatar">${post.szerzo.charAt(0)}</div>
                <span>${post.szerzo}</span>
              </div>
              <time class="post-date">${new Date(post.datum).toLocaleDateString('hu-HU')}</time>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Update Pagination
    const totalPages = Math.ceil(totalCount / limit);
    paginationContainer.innerHTML = renderPagination(currentPage, totalPages);

    // Attach pagination events
    const pageBtns = paginationContainer.querySelectorAll('.page-btn:not(.disabled):not(.active)');
    pageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt((e.target as HTMLElement).dataset.page || '1', 10);
        currentPage = page;
        window.scrollTo({ top: 300, behavior: 'smooth' });
        loadAndRenderPosts();
      });
    });

  } catch (error) {
    postsContainer.innerHTML = '<div class="error">Nem sikerült betölteni a bejegyzéseket.</div>';
  }
};
