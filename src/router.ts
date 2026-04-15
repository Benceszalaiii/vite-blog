import { renderDashboard } from './pages/dashboard';
import { renderHome } from './pages/home';
import { renderPost } from './pages/post';
import { renderTestPage } from './pages/test';

export const initRouter = (appElement: HTMLElement) => {
  const router = () => {
    const hash = window.location.hash || '#/';
    
    if (hash === '#/') {
      renderHome(appElement);
    } else if (hash === '#/login') {
      appElement.innerHTML = '<h2>Bejelentkezés hamarosan...</h2>';
    } else if (hash === '#/dashboard') {
      renderDashboard(appElement);
    } else if (hash.startsWith('#/blog/')) {
      const id = parseInt(hash.split('/')[2]);
      renderPost(appElement, id);
    } else if (hash.startsWith('#/test')) {
      renderTestPage(appElement);
    } else {
      appElement.innerHTML = '<div class="error">A keresett oldal nem található.</div>';
    }
  };

  window.addEventListener('hashchange', router);
  
  // Initial call
  router();
};
