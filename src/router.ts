import { renderHome } from './pages/home';
import { renderPost } from './pages/post';

export const initRouter = (appElement: HTMLElement) => {
  const router = () => {
    const hash = window.location.hash || '#/';
    
    if (hash === '#/') {
      renderHome(appElement);
    } else if (hash === '#/login') {
      appElement.innerHTML = '<h2>Bejelentkezés hamarosan...</h2>';
    } else if (hash === '#/dashboard') {
      appElement.innerHTML = '<h2>Vezérlőpult hamarosan...</h2>';
    } else if (hash.startsWith('#/blog/')) {
      const id = parseInt(hash.split('/')[2]);
      renderPost(appElement, id);
    } else {
      appElement.innerHTML = '<div class="error">A keresett oldal nem található.</div>';
    }
  };

  window.addEventListener('hashchange', router);
  
  // Initial call
  router();
};
