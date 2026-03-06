let currentTheme = localStorage.getItem('theme') || 'dark';

function initializeTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  icon.className = currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
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
  navigator.clipboard?.writeText(discordUsername)
    .then(() => showNotification('Discord copiado: ' + discordUsername))
    .catch(() => showNotification('Discord: ' + discordUsername));
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
  n.style.cssText = 'position:fixed;top:6rem;right:2rem;z-index:9999;padding:1rem 1.3rem;border-radius:14px;background:linear-gradient(45deg,#06b6d4,#4f46e5);color:#fff;box-shadow:0 10px 25px rgba(0,0,0,.25);transform:translateX(130%);transition:transform .3s ease';
  document.body.appendChild(n);
  requestAnimationFrame(() => n.style.transform = 'translateX(0)');
  setTimeout(() => {
    n.style.transform = 'translateX(130%)';
    setTimeout(() => n.remove(), 300);
  }, 2200);
}

function initScrollTopButton() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('visible', window.pageYOffset > 250);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function animateCategoryLoad() {
  document.querySelectorAll('.category-page .section').forEach((section, i) => {
    section.classList.add('category-enter');
    section.style.animationDelay = `${i * 120}ms`;
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
  if (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    currentTheme = 'dark';
  }
  initializeTheme();
  setActiveNavByPage();
  initScrollTopButton();
  animateCategoryLoad();
  if (window.AOS) AOS.init({ duration: 700, easing: 'ease-in-out', once: true });
});
