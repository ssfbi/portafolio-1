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
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(discordUsername)
      .then(() => showNotification('Discord copiado: ' + discordUsername))
      .catch(() => showNotification('Discord: ' + discordUsername));
    return;
  }

  const ta = document.createElement('textarea');
  ta.value = discordUsername;
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
  n.style.cssText = 'position:fixed;top:6rem;right:1.2rem;z-index:9999;padding:.9rem 1.1rem;border-radius:12px;background:linear-gradient(45deg,#06b6d4,#4f46e5);color:#fff;box-shadow:0 10px 20px rgba(0,0,0,.22);transform:translateX(120%);transition:transform .25s ease;font-family:Poppins,sans-serif';
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


function animateMiniStats() {
  document.querySelectorAll('.mini-progress-fill[data-value]').forEach((bar, i) => {
    const value = bar.getAttribute('data-value') || '0';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = `${value}%`;
    }, 100 + i * 80);
  });
}

function animateSkillBars() {
  const bars = document.querySelectorAll('.progress-bar-fill[data-value]');
  bars.forEach((bar, i) => {
    const value = bar.getAttribute('data-value') || '0';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.width = `${value}%`;
    }, 120 + i * 70);
  });
}

function createServerItem(server) {
  const item = document.createElement('div');
  item.className = 'server-item';

  const icon = document.createElement('div');
  icon.className = 'server-icon custom';

  const img = document.createElement('img');
  const rawIcon = String(server.icon || '').trim();
  const iconCandidates = [];

  if (rawIcon) {
    iconCandidates.push(rawIcon);
    if (!rawIcon.includes('/')) {
      iconCandidates.push(`servers-icons/${rawIcon}`);
    }
  }

  img.alt = `${server.name} logo`;
  img.loading = 'lazy';

  const fallback = document.createElement('span');
  fallback.className = 'server-icon-fallback';
  fallback.textContent = server.fallback || server.name.charAt(0).toUpperCase();

  let candidateIndex = 0;
  const setNextCandidate = () => {
    if (candidateIndex >= iconCandidates.length) {
      img.style.display = 'none';
      fallback.style.display = 'inline-flex';
      return;
    }
    img.src = iconCandidates[candidateIndex];
    candidateIndex += 1;
  };

  img.addEventListener('error', setNextCandidate);
  setNextCandidate();

  icon.appendChild(img);
  icon.appendChild(fallback);

  const info = document.createElement('div');
  info.className = 'server-info';
  info.innerHTML = `<h3>${server.name}</h3><span>${server.role}</span>`;

  item.appendChild(icon);
  item.appendChild(info);
  return item;
}

function renderServersFromConfig() {
  if (document.body.dataset.page !== 'servers') return;
  const hostingList = document.getElementById('hosting-list-dynamic');
  const serverList = document.getElementById('server-list-dynamic');
  if (!window.SERVERS_CONFIG || !hostingList || !serverList) return;

  const hostings = Array.isArray(window.SERVERS_CONFIG.hostings) ? window.SERVERS_CONFIG.hostings : [];
  const servers = Array.isArray(window.SERVERS_CONFIG.servers) ? window.SERVERS_CONFIG.servers : [];

  hostingList.innerHTML = '';
  serverList.innerHTML = '';

  hostings.forEach((h) => hostingList.appendChild(createServerItem(h)));
  servers.forEach((s) => serverList.appendChild(createServerItem(s)));

  const hostingCount = document.getElementById('hosting-count');
  const serverCount = document.getElementById('server-count');
  if (hostingCount) hostingCount.textContent = String(hostings.length);
  if (serverCount) serverCount.textContent = String(servers.length);
}

function updateExperienceTimer() {
  const el = document.getElementById('experience-timer');
  if (!el) return;

  const startDate = new Date(el.dataset.startDate || '2021-01-01T00:00:00');

  const tick = () => {
    const now = new Date();
    let diff = Math.max(0, now - startDate);

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    diff -= years * (1000 * 60 * 60 * 24 * 365.25);
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    diff -= months * (1000 * 60 * 60 * 24 * 30.44);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);

    el.textContent = `${years} Años ${months} Meses ${days} Días ${hours} Horas ${minutes} Minutos ${seconds} Segundos`;
  };

  tick();
  setInterval(tick, 1000);
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
  renderServersFromConfig();
  animateSkillBars();
  animateMiniStats();
  updateExperienceTimer();

  if (window.AOS) {
    AOS.init({ duration: 450, easing: 'ease-out-cubic', once: true, offset: 30 });
  }
});
