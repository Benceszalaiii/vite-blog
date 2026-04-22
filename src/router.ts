import { renderDashboard } from './pages/dashboard';
import { renderEditPage } from './pages/edit';
import { renderHome } from './pages/home';
import { renderLogin } from './pages/login';
import { renderPost } from './pages/post';
import { renderTestPage } from './pages/test';

export const initRouter = (appElement: HTMLElement) => {
  const router = () => {
    const hash = window.location.hash || '#/';
    
    if (hash === '#/') {
      renderHome(appElement);
    } else if (hash === '#/login') {
      renderLogin(appElement);
    } else if (hash === '#/dashboard') {
      renderDashboard(appElement);
    } else if (hash.startsWith('#/blog/')) {
      const id = parseInt(hash.split('/')[2]);
      renderPost(appElement, id);
    } else if (hash.startsWith('#/test')) {
      renderTestPage(appElement);
    } else if (hash.startsWith('#/edit/')) {
      const id = hash.split('/')[2];
      renderEditPage(appElement, id);
    } else {
      appElement.innerHTML = '<div class="error">A keresett oldal nem található.</div>';
    }
  };

  window.addEventListener('hashchange', router);
  
  // Initial call
  router();
};
