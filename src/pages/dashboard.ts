// src/pages/dashboard.ts
import { fetchPosts } from '../api';
import { BlogList } from '../components/bloglist';
import { renderNavbar, attachNavbarEvents } from '../components/navbar';
import { getUser, isLoggedIn } from '../store';

export const renderDashboard = async (container: HTMLElement) => {
  // Ha a felhasználó nincs bejelentkezve, átirányítás a login oldalra
  if (!isLoggedIn()) {
    window.location.hash = '#/login';
    return;
  }

  const user = getUser();
  if (!user || (user?.role !== "admin" && user?.role !== "adminisztrator")) {
    window.location.hash = '#/';
    return;
  }
  const posts = await fetchPosts({ limit: 20 });
  const blogList = BlogList(posts.posts);
  container.innerHTML = `
    ${renderNavbar()}
    <main class="w-full mx-auto flex flex-col gap-16 items-center justify-center">
    <div class="w-full max-w-5xl mx-auto flex justify-between items-center mb-2.5">
        <div>
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Vezérlőpult</h2>
          <p style="color: var(--text-muted);">Üdvözöllek, <span style="color: var(--primary-color); font-weight: 600;">${user?.nev}</span>!</p>
        </div>
      </div>
    <section class="w-full max-w-5xl mx-auto mb-2.5">  
      <div class="flex flex-row flex-wrap gap-4 justify-center items-center">
        <div class="card min-w-52 w-1/4" style="padding: 2rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Statisztikák</h3>
          <p style="font-size: 2.5rem; font-weight: 700;">${posts.totalCount}</p>
          <p style="color: var(--text-muted);">Összes poszt</p>
        </div>
        
        <div class="card min-w-52 w-1/4" style="padding: 2rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Statisztikák</h3>
          <p style="font-size: 2.5rem; font-weight: 700;">${posts.posts.filter(post => post.szerzo === user?.nev).length}</p>
          <p style="color: var(--text-muted);">Saját posztok</p>
        </div>
        <div class="card min-w-52 w-1/4" style="padding: 2rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Statisztikák</h3>
          <p style="font-size: 2.5rem; font-weight: 700;">${posts.posts.filter(post => post.szerzo === user?.nev).map(post => post.tartalom.split(" ").length).reduce((a, b) => a + b, 0)}</p>
          <p style="color: var(--text-muted);">Írt szavak</p>
        </div>
        </div>
        </section>


        ${blogList.content}
    </main>
  `;

  blogList.attachEvents();
  // A navbar gombjainak eseménykezelői
  attachNavbarEvents();
};