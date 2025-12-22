// Temporary toast implementation until sonner is installed
// Replace this with sonner's toast after running: npm install
// This is a client-side only implementation

let toastContainer: HTMLDivElement | null = null;

const createToastContainer = () => {
  if (typeof window === 'undefined') return null;
  if (toastContainer) return toastContainer;
  
  toastContainer = document.createElement('div');
  toastContainer.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);
  return toastContainer;
};

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window === 'undefined') {
    // Server-side: just log to console
    console.log(`[${type.toUpperCase()}] ${message}`);
    return;
  }
  
  const container = createToastContainer();
  if (!container) return;
  
  const toast = document.createElement('div');
  
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };
  
  toast.className = `${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg mb-2 transition-all`;
  toast.textContent = message;
  toast.style.cssText += 'pointer-events: auto; opacity: 1; transform: translateY(0);';
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
};

export const toast = {
  success: (message: string) => showToast(message, 'success'),
  error: (message: string) => showToast(message, 'error'),
  info: (message: string) => showToast(message, 'info'),
};

