const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const timers = new Set();

function clearTimers() {
  timers.forEach(timer => clearInterval(timer));
  timers.clear();
}

function setupVisibility() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.18 });
  document.querySelectorAll('.collection-row, .brand-title, .product-card').forEach(node => observer.observe(node));
}

function setupSlideshows() {
  document.querySelectorAll('.slideshow').forEach(root => {
    let slides;
    try { slides = JSON.parse(root.dataset.slides || '[]'); } catch { slides = []; }
    if (slides.length < 2) return;
    const front = root.querySelector('.slide.is-active');
    const back = root.querySelector('.slide-next');
    const hero = root.closest('.hero-media');
    const counter = hero?.querySelector('.slide-count');
    const toggle = hero?.querySelector('.motion-toggle');
    let index = 0;
    let paused = reduceMotion.matches;
    let frontIsA = true;

    const render = nextIndex => {
      const target = frontIsA ? back : front;
      const previous = frontIsA ? front : back;
      const next = slides[nextIndex];
      target.src = next.src;
      target.style.setProperty('--object-position', next.position);
      target.onload = () => {
        target.classList.add('is-active');
        previous.classList.remove('is-active');
        frontIsA = !frontIsA;
      };
      index = nextIndex;
      if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };

    const timer = setInterval(() => {
      if (!paused && document.visibilityState === 'visible') render((index + 1) % slides.length);
    }, 4200);
    timers.add(timer);

    toggle?.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? '画像の自動切替を再開' : '画像の自動切替を一時停止');
      toggle.textContent = paused ? '▶' : 'Ⅱ';
    });
  });
}

function setupMenu() {
  const dialog = document.querySelector('.nav-dialog');
  const open = document.querySelector('.menu-toggle');
  const close = dialog?.querySelector('.menu-close');
  if (!dialog || !open || !close) return;
  let previousFocus = null;
  const closeMenu = () => {
    dialog.close();
    document.body.classList.remove('is-locked');
    open.setAttribute('aria-expanded', 'false');
    previousFocus?.focus();
  };
  open.addEventListener('click', () => {
    previousFocus = document.activeElement;
    dialog.showModal();
    document.body.classList.add('is-locked');
    open.setAttribute('aria-expanded', 'true');
    close.focus();
  });
  close.addEventListener('click', closeMenu);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeMenu();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeMenu();
  });
}

function setupLightbox() {
  const dialog = document.querySelector('.lightbox');
  if (!dialog) return;
  const image = dialog.querySelector('.lightbox-image');
  const caption = dialog.querySelector('figcaption p');
  const buy = dialog.querySelector('.lightbox-buy');
  const close = dialog.querySelector('.lightbox-close');
  let trigger = null;

  const closeLightbox = () => {
    dialog.close();
    document.body.classList.remove('is-locked');
    trigger?.focus();
  };
  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    trigger = button;
    image.src = button.dataset.lightbox;
    image.alt = button.dataset.caption || button.getAttribute('aria-label') || '';
    caption.textContent = button.dataset.caption || '';
    if (button.dataset.url) {
      buy.href = button.dataset.url;
      buy.hidden = false;
    } else {
      buy.removeAttribute('href');
      buy.hidden = true;
    }
    dialog.showModal();
    document.body.classList.add('is-locked');
    close.focus();
  }));
  close.addEventListener('click', closeLightbox);
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    closeLightbox();
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeLightbox();
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });
}

function setupProductPaging() {
  document.querySelectorAll('[data-product-grid]').forEach(grid => {
    const cards = [...grid.querySelectorAll('.product-card')];
    const pageSize = Number(grid.dataset.pageSize || 6);
    const button = grid.nextElementSibling?.classList.contains('load-more') ? grid.nextElementSibling : null;
    if (!button || cards.length <= pageSize) return;
    let visible = pageSize;
    const render = () => {
      cards.forEach((card, index) => { card.hidden = index >= visible; });
      if (visible >= cards.length) button.hidden = true;
      button.setAttribute('aria-label', `${Math.min(pageSize, cards.length - visible)}件の商品をさらに表示`);
    };
    button.addEventListener('click', () => {
      const firstNew = cards[visible];
      visible = Math.min(cards.length, visible + pageSize);
      render();
      firstNew?.querySelector('button, a')?.focus();
    });
    render();
  });
}

function setupTransitions() {
  let navigating = false;
  addEventListener('pageshow', () => { navigating = false; });
  document.documentElement.addEventListener('animationend', event => {
    if (event.animationName === 'veil-open') document.documentElement.classList.remove('wipe-enter');
  });
  document.querySelectorAll('[data-nav-reveal]').forEach(link => link.addEventListener('click', event => {
    if (reduceMotion.matches || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (navigating) return;
    navigating = true;
    const x = event.clientX || innerWidth / 2;
    const y = event.clientY || innerHeight / 2;
    try { sessionStorage.setItem('urt:wipe', JSON.stringify({ x, y, t: Date.now() })); } catch { /* private mode */ }
    const veil = document.createElement('div');
    veil.className = 'page-veil';
    document.body.append(veil);
    const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));
    veil.animate(
      [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${radius}px at ${x}px ${y}px)` }],
      { duration: 520, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' },
    ).finished.finally(() => location.assign(link.href));
  }));
}

function setupPointerEffects() {
  if (!finePointer.matches || reduceMotion.matches) return;
  document.body.classList.add('has-pointer');
  const mark = document.querySelector('.pointer-mark');
  const label = mark?.querySelector('span');
  const layer = document.querySelector('.fx-layer');
  if (!mark || !label || !layer) return;
  let lastTrail = 0;
  let lastX = 0;
  let lastY = 0;

  document.addEventListener('pointermove', event => {
    mark.style.left = `${event.clientX}px`;
    mark.style.top = `${event.clientY}px`;
    lastX = event.clientX;
    lastY = event.clientY;
    const target = event.target.closest('[data-cursor]');
    mark.classList.toggle('is-active', Boolean(target));
    label.textContent = target?.dataset.cursor || 'VIEW';

    if (target && performance.now() - lastTrail > 85) {
      lastTrail = performance.now();
      const dot = document.createElement('i');
      dot.className = 'ink-dot';
      dot.style.left = `${event.clientX - 6}px`;
      dot.style.top = `${event.clientY - 6}px`;
      layer.append(dot);
      dot.addEventListener('animationend', () => dot.remove(), { once: true });
    }

    document.querySelectorAll('.product-card.is-near').forEach(card => card.classList.remove('is-near'));
    const card = event.target.closest('.product-card');
    card?.classList.add('is-near');
  });

  document.addEventListener('pointerleave', () => mark.classList.remove('is-active'));
  document.addEventListener('click', event => {
    const wave = document.createElement('i');
    wave.className = 'shockwave';
    wave.style.left = `${event.clientX || lastX}px`;
    wave.style.top = `${event.clientY || lastY}px`;
    layer.append(wave);
    wave.addEventListener('animationend', () => wave.remove(), { once: true });
  });
}

function setupWobble() {
  document.querySelectorAll('[data-wobble]').forEach(button => {
    const wobble = () => {
      button.classList.remove('is-wobbling');
      void button.offsetWidth;
      button.classList.add('is-wobbling');
    };
    button.addEventListener('pointerenter', wobble);
    button.addEventListener('animationend', () => button.classList.remove('is-wobbling'));
  });
}

function setupImageErrors() {
  document.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
    image.hidden = true;
    image.closest('.slideshow, .product-image, .gallery-item')?.classList.add('has-image-error');
  }));
}

setupVisibility();
setupSlideshows();
setupMenu();
setupLightbox();
setupProductPaging();
setupTransitions();
setupPointerEffects();
setupWobble();
setupImageErrors();
window.addEventListener('pagehide', clearTimers, { once: true });
