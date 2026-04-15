import './style.css';
import { initRouter } from './router';

document.addEventListener('DOMContentLoaded', () => {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.style.paddingTop = "8rem";
    initRouter(appElement);
  } else {
    console.error("Nem található az #app elem!");
  }
});
