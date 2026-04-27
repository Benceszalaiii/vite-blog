export type ToastType = 'success' | 'error' | 'info';

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000, dispose: (() => void) = (() => {})) {
  // 1. Check if the container exists, otherwise create it
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // 2. Create the toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // 3. Append toast to the container
  container.appendChild(toast);

  // 4. Set timeout to remove the toast after `duration`
  setTimeout(() => {
    // Add a class to animate it out smoothly
    toast.classList.add('fade-out');
    
    // Wait for the fade-out animation to finish before removing from DOM
    setTimeout(() => {
      toast.remove();
      // Clean up the container if it's empty
      if (container && container.childNodes.length === 0) {
        container.remove();
        dispose();
      }
    }, 300); // Matches the CSS transition duration
  }, duration);
}