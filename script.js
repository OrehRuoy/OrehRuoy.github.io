(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Filter chips ── */
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.app-card');

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      chips.forEach((c) => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
      });

      cards.forEach((card) => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ── Magnetic hover on app cards ── */
  if (!prefersReducedMotion) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `translate(${x * 0.06}px, ${y * 0.06}px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Carousels ── */
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    const scrollAmount = () => Math.min(track.clientWidth * 0.7, 280);

    prev?.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    next?.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount(), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Lightbox ── */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox-img');
  const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  let lastFocus = null;

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'App screenshot';
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.hidden = false;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
    lastFocus?.focus();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.shot[data-lightbox]');
    if (!btn) return;
    openLightbox(btn.dataset.lightbox, btn.dataset.caption);
  });

  lightboxClose?.addEventListener('click', closeLightbox);

  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ── YouTube click-to-play ── */
  document.querySelectorAll('.video-card[data-yt]').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-playing')) return;
      const id = card.dataset.yt;
      const title = card.dataset.title || 'App video';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = title;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.setAttribute('loading', 'lazy');
      card.classList.add('is-playing');
      card.appendChild(iframe);
    });
  });

  /* ── Smooth scroll offset for sticky nav ── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  });

  /* ── Live App Store screenshots ── */
  function itunesHiRes(url) {
    return String(url).replace(/\/\d+x\d+bb\.(jpg|png|webp)/i, '/1242x2688bb.$1');
  }

  function captionFromStoreUrl(url) {
    const parts = String(url).split('/');
    const file = decodeURIComponent(parts[parts.length - 2] || '');
    return file.replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/^\d+-/, '').replace(/-/g, ' ');
  }

  function fillStoreCarousel(carousel, urls) {
    const track = carousel.querySelector('.carousel-track');
    if (!track || !urls.length) return;
    track.innerHTML = '';
    urls.forEach((url) => {
      const caption = captionFromStoreUrl(url);
      const btn = document.createElement('button');
      btn.className = 'shot';
      btn.type = 'button';
      btn.dataset.lightbox = url;
      btn.dataset.caption = caption;
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Taptico — ' + caption;
      img.loading = 'lazy';
      btn.appendChild(img);
      track.appendChild(btn);
    });
  }

  function loadItunesApp(appId) {
    return new Promise((resolve, reject) => {
      const cb = 'orehItunesCb' + appId;
      const script = document.createElement('script');
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('timeout'));
      }, 8000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[cb]; } catch (err) { window[cb] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[cb] = (data) => {
        cleanup();
        const app = data && data.results && data.results[0];
        if (!app) reject(new Error('no result'));
        else resolve(app);
      };

      script.src = 'https://itunes.apple.com/lookup?id=' + encodeURIComponent(appId) + '&callback=' + cb;
      script.onerror = () => {
        cleanup();
        reject(new Error('script'));
      };
      document.head.appendChild(script);
    });
  }

  document.querySelectorAll('[data-store-screenshots]').forEach((carousel) => {
    const spec = carousel.getAttribute('data-store-screenshots') || '';
    const match = spec.match(/^itunes:(\d+)$/);
    if (!match) return;
    loadItunesApp(match[1]).then((app) => {
      const urls = (app.screenshotUrls || []).map(itunesHiRes);
      if (urls.length) fillStoreCarousel(carousel, urls);
    }).catch(() => {
      /* Keep the local App Store copies already in the page. */
    });
  });
})();
