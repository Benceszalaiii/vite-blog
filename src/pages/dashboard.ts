// src/pages/dashboard.ts
import { fetchPosts } from '../api';
import { BlogList } from '../components/bloglist';
import { renderNavbar, attachNavbarEvents } from '../components/navbar';
import { clearUser, getUser, isLoggedIn } from '../store';

export const renderDashboard = async(container: HTMLElement) => {
    // Ha a felhasználó nincs bejelentkezve, átirányítás a login oldalra
    if (!isLoggedIn()) {
        window.location.hash = '#/login';
        return;
    }

    const user = getUser();
    if (!user || (user?.role !== "admin" && user?.role !== "adminisztrator")){
        window.location.hash = '#/';
        return;
    }
    const posts = await fetchPosts();
    container.innerHTML = `
    ${renderNavbar()}
    <main class="w-full mx-auto flex flex-col gap-16 items-center justify-center">
    <div class="w-full max-w-5xl mx-auto flex justify-between items-center mb-2.5">
        <div>
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Vezérlőpult</h2>
          <p style="color: var(--text-muted);">Üdvözöllek, <span style="color: var(--primary-color); font-weight: 600;">${user?.nev}</span>!</p>
        </div>
      </div>
    <section class="w-full max-w-5xl mx-auto flex flex-row flex-nowrap justify-between items-center mb-2.5">  
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
        <div class="card" style="padding: 2rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Statisztikák</h3>
          <p style="font-size: 2.5rem; font-weight: 700;">${posts.totalCount}</p>
          <p style="color: var(--text-muted);">Összes poszt</p>
        </div>
        
        <div class="card" style="padding: 2rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
          <h3 style="margin-bottom: 1rem; color: var(--primary-color);">Statisztikák</h3>
          <p style="font-size: 2.5rem; font-weight: 700;">${posts.posts.filter(post => post.szerzo === user?.nev).length}</p>
          <p style="color: var(--text-muted);">Saját posztok</p>
        </div>
        </div>
        </section>


        ${BlogList(posts.posts)}
    </main>
  `;

    // A navbar gombjainak eseménykezelői
    attachNavbarEvents();

    // Kijelentkezés gomb eseménykezelése
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Felhasználó kijelentkeztetése
            clearUser();
            // Átirányítás a főoldalra
            window.location.hash = '#/';
        });
    }
};