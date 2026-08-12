// =========================================================
// ARTHUR BELMONTE — PORTFÓLIO
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- barra de progresso de scroll ---------- */
  const progressBar = document.getElementById('progressBar');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- scrollspy: destaca o link ativo do menu ---------- */
  const sections = document.querySelectorAll('main section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  sections.forEach((section) => spyObserver.observe(section));

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-visible'), index * 60);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- efeito de digitação no terminal do hero ---------- */
  const typedEl = document.getElementById('typedText');
  const commands = [
    'dagster asset materialize --select gold_layer',
    'databricks jobs run-now --job-id 4821',
    'pytest tests/ --cov=pipelines',
    'git push && gh workflow run deploy.yml'
  ];

  if (typedEl && !prefersReducedMotion) {
    let cmdIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const current = commands[cmdIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          cmdIndex = (cmdIndex + 1) % commands.length;
        }
      }
      setTimeout(typeLoop, deleting ? 25 : 45);
    }
    typeLoop();
  } else if (typedEl) {
    typedEl.textContent = commands[0];
  }

  /* ---------- copiar e-mail ---------- */
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyHint = document.getElementById('copyHint');

  if (copyBtn && copyHint) {
    const originalHint = copyHint.textContent;
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email');
      try {
        await navigator.clipboard.writeText(email);
        copyHint.textContent = 'copiado ✓';
      } catch (err) {
        copyHint.textContent = 'copie manualmente: ' + email;
      }
      setTimeout(() => { copyHint.textContent = originalHint; }, 2000);
    });
  }
});
