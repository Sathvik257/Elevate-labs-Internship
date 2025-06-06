// Theme toggle functionality

(() => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && userPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleIcon.className = 'bi bi-sun-fill';
    themeToggleBtn.setAttribute('aria-pressed', 'true');
  } else {
    themeToggleIcon.className = 'bi bi-moon-fill';
    themeToggleBtn.setAttribute('aria-pressed', 'false');
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      themeToggleIcon.className = 'bi bi-moon-fill';
      themeToggleBtn.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      themeToggleIcon.className = 'bi bi-sun-fill';
      themeToggleBtn.setAttribute('aria-pressed', 'true');
    }
  });
})();

// Intersection Observer for cards fade-in animation

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.classList.add('animate');
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observerSelf) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerSelf.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => observer.observe(card));

  // Newsletter form submission feedback

  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.checkValidity()) {
        // Show subtle success message
        showSubscriptionSuccess();
        newsletterForm.reset();
      } else {
        emailInput.reportValidity();
      }
    });
  }

  function showSubscriptionSuccess() {
    const container = document.createElement('div');
    container.textContent = 'Thank you for subscribing!';
    container.setAttribute('role', 'alert');
    container.style.position = 'fixed';
    container.style.bottom = '1.5rem';
    container.style.right = '1.5rem';
    container.style.backgroundColor = 'var(--color-primary)';
    container.style.color = '#fff';
    container.style.padding = '0.75rem 1.25rem';
    container.style.borderRadius = '0.5rem';
    container.style.boxShadow = '0 0 12px rgba(13, 110, 253, 0.7)';
    container.style.zIndex = '9999';
    container.style.fontWeight = '600';
    container.style.userSelect = 'none';
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.5s ease-in-out';

    document.body.appendChild(container);

    requestAnimationFrame(() => {
      container.style.opacity = '1';
    });

    setTimeout(() => {
      container.style.opacity = '0';
      container.addEventListener('transitionend', () => {
        container.remove();
      });
    }, 3000);
  }
});

// Smooth scroll for internal links (if needed)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
