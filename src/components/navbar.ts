import { isLoggedIn, getUser, clearUser } from '../store';

export const renderNavbar = (): string => {
  const loggedIn = isLoggedIn();
  const user = getUser();

  return `
    <nav class="navbar">
      <div class="nav-container">
        <a href="#/" class="brand">Vite<span>Blog</span></a>
        <div class="nav-links">
          <a href="#/" class="${location.hash === '#/' || location.hash === '' ? 'active' : ''}">Főoldal</a>
          ${
            loggedIn
              ? `
              <a href="#/dashboard" class="${location.hash === '#/dashboard' ? 'active' : ''}">Vezérlőpult</a>
              <span class="user-greeting">Szia, ${user?.nev}!</span>
              <button id="logout-btn" class="btn btn-outline">Kijelentkezés</button>
            `
              : `
              <a href="#/login" class="btn btn-primary">Bejelentkezés</a>
            `
          }
        </div>
      </div>
    </nav>
  `;
};

export const attachNavbarEvents = (): void => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearUser();
      window.dispatchEvent(new Event('hashchange')); // re-trigger routing
      window.location.hash = '#/';
    });
  }
};
