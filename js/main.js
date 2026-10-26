/**
 * Claudio Fauzia — Autobiografia & Business Digitale
 * Interazioni editoriali, animazioni di lettura, FAQ, Lightbox e generatore DM Instagram
 */

document.addEventListener('DOMContentLoaded', () => {
  const IG_PROFILE_URL = 'https://www.instagram.com/ilclaudianofz/';

  // 1. Dynamic Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Scroll Progress & Sticky Header & Floating CTA Visibility
  const scrollProgress = document.getElementById('scrollProgress');
  const siteHeader = document.getElementById('siteHeader');
  const floatingIgCta = document.getElementById('floatingIgCta');
  const collaboraSection = document.getElementById('collabora');

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (scrollProgress && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      scrollProgress.style.width = `${pct}%`;
    }

    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollTop > 24);
    }

    if (floatingIgCta && collaboraSection) {
      const rect = collaboraSection.getBoundingClientRect();
      const inFinalCta = rect.top < window.innerHeight * 0.75 && rect.bottom > 120;
      floatingIgCta.style.opacity = inFinalCta ? '0' : '1';
      floatingIgCta.style.pointerEvents = inFinalCta ? 'none' : 'auto';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Drawer
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  const closeMobileMenu = () => {
    if (!menuToggle || !mainNav) return;
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('open');
  };

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // 4. Scroll Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const currentAnswer = btn.nextElementSibling;

      // Collapse all other items
      faqQuestions.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          const otherAns = otherBtn.nextElementSibling;
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      // Toggle clicked item
      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (currentAnswer) {
        currentAnswer.style.maxHeight = !isExpanded ? `${currentAnswer.scrollHeight + 24}px` : null;
      }
    });
  });

  // 6. Interactive Icebreaker Message Selector & Copy + Open Instagram
  const icebreakerBtns = document.querySelectorAll('.icebreaker-btn');
  const dmMessagePreview = document.getElementById('dmMessagePreview');
  const copyAndOpenIgBtn = document.getElementById('copyAndOpenIgBtn');
  const copyFeedback = document.getElementById('copyFeedback');

  icebreakerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      icebreakerBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const presetMsg = btn.getAttribute('data-msg');
      if (dmMessagePreview && presetMsg) {
        dmMessagePreview.value = presetMsg;
      }
      if (copyFeedback) {
        copyFeedback.textContent = '';
      }
    });
  });

  const copyTextSafely = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else if (dmMessagePreview) {
      dmMessagePreview.select();
      try {
        document.execCommand('copy');
      } catch (_) {
        // Ignore fallback failure
      }
    }
  };

  if (copyAndOpenIgBtn && dmMessagePreview) {
    copyAndOpenIgBtn.addEventListener('click', () => {
      const message = dmMessagePreview.value.trim();
      if (message) {
        copyTextSafely(message);
      }
      if (copyFeedback) {
        copyFeedback.textContent = '✓ Messaggio copiato! Incollalo ora nella chat DM su @ilclaudianofz.';
      }
      window.open(IG_PROFILE_URL, '_blank', 'noopener,noreferrer');
    });
  }

  // 7. Lightbox Photo Viewer
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  let lastFocusedTrigger = null;

  const openLightbox = (imgEl) => {
    if (!lightboxModal || !lightboxImg) return;
    lastFocusedTrigger = imgEl;
    lightboxImg.src = imgEl.currentSrc || imgEl.src;
    lightboxImg.alt = imgEl.alt || 'Foto Claudio Fauzia';
    if (lightboxCaption) {
      lightboxCaption.textContent = imgEl.getAttribute('data-caption') || imgEl.alt || '';
    }
    lightboxModal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightboxModal || lightboxModal.hidden) return;
    lightboxModal.hidden = true;
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
    }
  };

  document.querySelectorAll('.lightbox-trigger').forEach((imgEl) => {
    imgEl.addEventListener('click', () => openLightbox(imgEl));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
      closeMobileMenu();
    }
  });
});
