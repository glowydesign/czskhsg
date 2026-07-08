/* ============================================================
   CZECH & SLOVAK UNION — HSG St. Gallen — Main JavaScript
   ============================================================ */

/* ---- Nav scroll + mobile toggle ---- */
(function () {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    const closeBtn = links.querySelector('.nav-close');
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.dataset.page === page) el.classList.add('active');
  });
})();

/* ---- Top notice height (pushes nav down to sit below the banner) ---- */
(function () {
  const notice = document.getElementById('top-notice');
  if (!notice) return;

  const setHeight = () => {
    document.documentElement.style.setProperty('--notice-h', notice.offsetHeight + 'px');
  };
  setHeight();
  window.addEventListener('resize', setHeight);
})();

/* ---- Scroll reveal ---- */
(function () {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();

/* ---- Animated counters ---- */
(function () {
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function runCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runCounter(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => obs.observe(el));
})();

/* ---- Stagger reveal for grids ---- */
(function () {
  const grids = document.querySelectorAll('.event-grid, .product-grid');
  grids.forEach(grid => {
    const children = Array.from(grid.children);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
      child.classList.add('reveal');
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.event-grid .reveal, .product-grid .reveal').forEach(el => obs.observe(el));
})();

/* ---- Board (season switcher + tabs) ---- */
(function () {

  const SEASONS = {
    '26-27': {
      label: '2026 / 27',
      note: 'Founding Board',
      members: [
        { role: 'President', name: 'Tomáš Dvořák', program: 'M.A. Strategy and International Management', icon: '🎓', badge: 'Founding President', quote: 'Dva jazyky, jeden domov, a jedna velká rodina na HSG.' },
        { role: 'Vice President', name: 'Barbora Kováčová', program: 'B.A. Law', icon: '🤝', badge: '', quote: 'Spájame Prahu, Bratislavu a St. Gallen, jedna akcia za druhou.' },
        { role: 'Head of Finance', name: 'Matúš Horváth', program: 'M.A. Banking and Finance', icon: '📊', badge: '', quote: 'Čísla musia sedieť, ale na komunite záleží najviac.' },
        { role: 'Head of Events', name: 'Eliška Procházková', program: 'B.A. Business Administration', icon: '🎉', badge: '', quote: 'Od Mikuláše po letní grilování, domov je všude, kde se sejdeme.' },
        { role: 'Head of Marketing', name: 'Adam Krejčí', program: 'B.A. Computer Science', icon: '📣', badge: '', quote: 'Vyprávíme náš příběh, aby se každý nový student cítil vítán.' },
      ],
    },
  };

  const tabs        = document.querySelectorAll('.tab-btn');
  const seasonBtns  = document.querySelectorAll('.season-btn');
  const boardGrid   = document.querySelector('.board-grid');
  const seasonLabel = document.getElementById('season-hero-label');
  if (!boardGrid) return;

  let currentSeason = Object.keys(SEASONS)[0];

  function renderBoard() {
    const { members } = SEASONS[currentSeason];
    boardGrid.innerHTML = members.map((m, i) => `
      <div class="board-card reveal" style="transition-delay:${i * 0.07}s;">
        <div class="board-avatar">${m.icon}</div>
        <div class="board-name">${m.name}</div>
        <div class="board-role">${m.role}</div>
        <div class="board-program">${m.program}</div>
        ${m.badge ? `<div class="board-badge">${m.badge}</div>` : ''}
        <div class="board-quote">&ldquo;${m.quote}&rdquo;</div>
      </div>
    `).join('');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        boardGrid.querySelectorAll('.board-card').forEach(c => c.classList.add('visible'));
      });
    });
  }

  seasonBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.season === currentSeason || !SEASONS[btn.dataset.season]) return;
      seasonBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSeason = btn.dataset.season;
      if (seasonLabel) seasonLabel.textContent = SEASONS[currentSeason].label + ' Board';
      renderBoard();
    });
  });

  renderBoard();
})();

/* ---- Events calendar filter ---- */
(function () {
  const btns = document.querySelectorAll('.cal-filter-btn');
  const rows = document.querySelectorAll('.cal-row');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      rows.forEach(row => {
        if (filter === 'all') { row.style.display = ''; return; }
        row.style.display = row.dataset.type === filter ? '' : 'none';
      });
    });
  });
})();

/* ---- Contact form (Formspree) ---- */
(function () {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('success-msg');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    // If the Formspree endpoint has not been configured yet, keep the demo
    // experience working instead of letting the browser navigate away.
    if (form.action.includes('YOUR_FORM_ID')) {
      e.preventDefault();
      form.style.transition = 'opacity 0.4s';
      form.style.opacity = '0';
      setTimeout(() => {
        form.style.display = 'none';
        if (success) {
          success.style.display = 'block';
          requestAnimationFrame(() => { success.style.opacity = '1'; });
        }
      }, 400);
    }
  });
})();

/* ---- Shop interest form ---- */
(function () {
  const form    = document.getElementById('shop-form');
  const content = document.getElementById('shop-form-content');
  const success = document.getElementById('shop-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    content.style.transition = 'opacity 0.4s';
    content.style.opacity = '0';
    setTimeout(() => {
      content.style.display = 'none';
      success.style.display = 'block';
      requestAnimationFrame(() => { success.style.opacity = '1'; });
    }, 400);
  });
})();
