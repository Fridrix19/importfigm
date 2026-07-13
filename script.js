const slides = Array.from(document.querySelectorAll('.slide'));
const deck = document.getElementById('deck');
const navTriggers = Array.from(document.querySelectorAll('[data-goto]'));
const navDots = Array.from(document.querySelectorAll('.nav-dot'));
const progressBar = document.getElementById('progressBar');
const currentSlideLabel = document.getElementById('currentSlide');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');
let activeIndex = 0;
let isAnimating = false;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getReadableSlideNumber(index) {
  return String(Math.max(0, index)).padStart(2, '0');
}

function setActiveSlide(nextIndex, options = {}) {
  const index = clamp(nextIndex, 0, slides.length - 1);
  if (index === activeIndex && !options.force) return;

  activeIndex = index;
  isAnimating = true;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === activeIndex;
    slide.classList.toggle('is-active', isActive);
    slide.removeAttribute('aria-hidden');
  });

  navDots.forEach((dot) => {
    const dotIndex = Number(dot.dataset.goto);
    dot.classList.toggle('is-active', dotIndex === activeIndex);
  });

  if (deck) {
    deck.style.transform = 'none';
  }

  if (!options.skipScroll) {
    slides[activeIndex].scrollIntoView({ behavior: options.instant ? 'auto' : 'smooth', block: 'start' });
  }

  if (progressBar) {
    const totalMainSlides = Math.max(1, slides.length - 1);
    const progress = activeIndex === 0 ? 0 : (activeIndex / totalMainSlides) * 100;
    progressBar.style.width = `${progress}%`;
  }

  if (currentSlideLabel) {
    currentSlideLabel.textContent = getReadableSlideNumber(activeIndex);
  }

  window.setTimeout(() => {
    isAnimating = false;
  }, 820);
}

function goNext() {
  setActiveSlide(activeIndex + 1);
}

function goPrev() {
  setActiveSlide(activeIndex - 1);
}

function bindNavigation() {
  navTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const index = Number(trigger.dataset.goto);
      if (Number.isFinite(index)) setActiveSlide(index);
    });
  });

  prevButton?.addEventListener('click', goPrev);
  nextButton?.addEventListener('click', goNext);

  window.addEventListener('keydown', (event) => {
    const tagName = document.activeElement?.tagName?.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
      event.preventDefault();
      goNext();
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      goPrev();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveSlide(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveSlide(slides.length - 1);
    }
  });

}

function bindCursorGlow() {
  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
    document.documentElement.style.setProperty('--my', `${event.clientY}px`);
  });
}

function bindInteractiveCards() {
  const cards = document.querySelectorAll('.system-card, .stack-tile, .point-card, .case-card, .shared-project-card, .impact-card, .profile-card, .map-center, .map-item, .final-cta');

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--card-x', `${x}%`);
      card.style.setProperty('--card-y', `${y}%`);
    });
  });
}

function fixHangingPrepositions() {
  const hangingWords = '(?:а|в|во|и|к|ко|о|об|от|до|для|из|на|но|по|с|со|у|за|не|или)';
  const pattern = new RegExp(`(^|[\\s(«„—-])(${hangingWords})\\s+`, 'giu');
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !pattern.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
      pattern.lastIndex = 0;
      const parent = node.parentElement;
      if (parent?.closest('script, style, a')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(pattern, '$1$2\u00a0');
  });
}

function duplicateMarqueeContent() {
  document.querySelectorAll('.case-lane').forEach((lane) => {
    if (lane.dataset.duplicated === 'true') return;
    lane.innerHTML += lane.innerHTML;
    lane.dataset.duplicated = 'true';
  });
}

function syncScrollState() {
  const viewportCenter = window.innerHeight / 2;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const rect = slide.getBoundingClientRect();
    const slideCenter = rect.top + rect.height / 2;
    const distance = Math.abs(slideCenter - viewportCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  if (closestIndex !== activeIndex) {
    setActiveSlide(closestIndex, { skipScroll: true });
  }
}

function bindResizeAndScroll() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (deck) {
        deck.style.transform = 'none';
      }
      setActiveSlide(activeIndex, { force: true, skipScroll: true });
    }, 120);
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      syncScrollState();
      ticking = false;
    });
  }, { passive: true });
}

function init() {
  fixHangingPrepositions();
  duplicateMarqueeContent();
  bindNavigation();
  bindCursorGlow();
  bindInteractiveCards();
  bindResizeAndScroll();
  setActiveSlide(0, { force: true, instant: true, skipScroll: true });
}

init();
