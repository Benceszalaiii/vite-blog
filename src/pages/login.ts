// src/pages/login.ts
import { isLoggedIn, saveUser } from '../store';
import { renderNavbar, attachNavbarEvents } from '../components/navbar';

export const renderLogin = (container: HTMLElement) => {
    // Ha a felhasználó már be van jelentkezve, a login oldal automatikusan a dashboardra irányít
    if (isLoggedIn()) {
        window.location.hash = '#/dashboard';
        return;
    }

    container.innerHTML = `
    ${renderNavbar()}
    <main style="max-width: 400px; margin: 8rem auto 4rem auto; padding: 2.5rem; background: var(--surface-color); border-radius: 16px; border: 1px solid var(--surface-border);">
      <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2rem;">Bejelentkezés</h2>
      <form id="login-form" style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="username" style="font-weight: 500;">Felhasználónév</label>
          <div style="position: relative; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="position: absolute; left: 1rem; width: 1.25rem; height: 1.25rem; color: #888;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <input type="text" id="username" required autocomplete="username" style="width: 100%;" />
          </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <label for="password" style="font-weight: 500;">Jelszó</label>
          <div style="position: relative; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="position: absolute; left: 1rem; width: 1.25rem; height: 1.25rem; color: #888;">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <input type="password" id="password" required autocomplete="current-password" style="width: 100%;" />
          </div>
          </div>
        
        <div id="login-error" class="error" style="display: none; margin: 0; padding: 1rem; font-size: 0.9rem;"></div>
        
        <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem; padding: 0.8rem;">Bejelentkezés</button>
      </form>
    </main>
  `;

    // A navbar gombjainak eseménykezelői
    attachNavbarEvents();

    // Form beküldés eseménykezelése
    const loginForm = document.getElementById('login-form') as HTMLFormElement;
    const errorDiv = document.getElementById('login-error') as HTMLDivElement;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';

        const usernameInput = document.getElementById('username') as HTMLInputElement;
        const passwordInput = document.getElementById('password') as HTMLInputElement;

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            // Login fetch request elküldése
            const response = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Hibás felhasználónév vagy jelszó!');
            }

            // Adatok mentése a localStorage-ba
            saveUser(data.user, data.token);

            // Sikeres bejelentkezés után átirányítás a dashboardra
            window.location.hash = '#/dashboard';

        } catch (error: any) {
            // Hibaüzenet megjelenítése a képernyőn
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });
};