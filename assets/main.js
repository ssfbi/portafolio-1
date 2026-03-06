let currentTheme = localStorage.getItem('theme') || 'dark';

function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  localStorage.setItem('theme-manual-override', 'true');
  initializeTheme();
  showNotification(`Tema cambiado a: ${currentTheme === 'dark' ? 'Oscuro' : 'Claro'}`);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.toggle('active');
}

function setActiveNavByPage() {
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === page);
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openDiscord() {
  const discordUsername = '@srpatoac';
  const textToCopy = discordUsername;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => showNotification('Discord copiado: ' + discordUsername))
      .catch(() => showNotification('Discord: ' + discordUsername));
    return;
  }

  const ta = document.createElement('textarea');
  ta.value = textToCopy;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showNotification('Discord copiado: ' + discordUsername);
  } catch {
    showNotification('Discord: ' + discordUsername);
  }
  document.body.removeChild(ta);
}

function downloadCV() {
  window.print();
}

function showNotification(message) {
  const old = document.querySelector('.notification');
  if (old) old.remove();
  const n = document.createElement('div');
  n.className = 'notification';
  n.textContent = message;
  n.style.cssText = 'position:fixed;top:6rem;right:1.2rem;z-index:9999;padding:.9rem 1.1rem;border-radius:12px;background:linear-gradient(45deg,#06b6d4,#4f46e5);color:#fff;box-shadow:0 10px 20px rgba(0,0,0,.22);transform:translateX(120%);transition:transform .25s ease';
  document.body.appendChild(n);
  requestAnimationFrame(() => { n.style.transform = 'translateX(0)'; });
  setTimeout(() => {
    n.style.transform = 'translateX(120%)';
    setTimeout(() => n.remove(), 250);
  }, 1800);
}

function initScrollTopButton() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('visible', window.pageYOffset > 220);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function animateCategoryLoad() {
  document.querySelectorAll('.category-page .section').forEach((section, i) => {
    section.classList.add('category-enter');
    section.style.animationDelay = `${i * 90}ms`;
  });
}

function setupPageTransitions() {
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  document.body.appendChild(overlay);

  const isInternalHtml = (url) => {
    try {
      const u = new URL(url, window.location.href);
      return u.origin === window.location.origin && (u.pathname.endsWith('.html') || u.pathname === '/' || u.pathname.endsWith('/'));
    } catch {
      return false;
    }
  };

  document.querySelectorAll('a.nav-link, a.category-card').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || !isInternalHtml(href)) return;

      e.preventDefault();
      document.body.classList.add('page-leave');
      overlay.classList.add('active');
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  requestAnimationFrame(() => {
    document.body.classList.add('page-enter');
    setTimeout(() => overlay.classList.remove('active'), 350);
  });
}

document.addEventListener('click', (e) => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.querySelector('.mobile-toggle');
  if (!sidebar || !toggle || window.innerWidth > 968) return;
  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) sidebar.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 't') {
    e.preventDefault();
    toggleTheme();
  }
  if (e.key === 'Home') {
    e.preventDefault();
    scrollToTop();
  }
});

window.addEventListener('load', () => {
  if (!localStorage.getItem('theme')) {
    currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
  }
  initializeTheme();
  setActiveNavByPage();
  initScrollTopButton();
  animateCategoryLoad();
  setupPageTransitions();
  if (window.AOS) AOS.init({ duration: 500, easing: 'ease-out-cubic', once: true, offset: 35 });
});
