// js/utils.js - Helper functions (optional, can be merged into quiz.js)

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Simple analytics (optional - for learning)
function trackEvent(category, action, label) {
  // Placeholder for future analytics integration
  console.log(`[Analytics] ${category}:${action}:${label}`);
}

// Reserved for lightweight startup work if needed later.
function preloadAssets() {}

document.addEventListener('DOMContentLoaded', preloadAssets);

// Export for use in quiz.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { debounce, formatDate, trackEvent };
}
