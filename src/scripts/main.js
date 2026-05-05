(() => {
  'use strict';

  const ready = (fn) => {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  };

  const initFadeIn = () => {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el) => observer.observe(el));
  };

  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  };

  const initNavToggle = () => {
    const nav = document.querySelector('[data-nav]');
    const toggle = document.querySelector('[data-nav-toggle]');
    if (!nav || !toggle) return;

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  };

  const initContactForm = () => {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const status = form.querySelector('[data-contact-status]');
    const submit = form.querySelector('[data-contact-submit]');
    const endpoint = form.dataset.endpoint || '/api/contact';

    const setStatus = (message, variant) => {
      if (!status) return;
      status.textContent = message;
      status.classList.remove('contact__status--success', 'contact__status--error');
      if (variant) status.classList.add(`contact__status--${variant}`);
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = Object.fromEntries(new FormData(form).entries());
      setStatus('Wysyłanie…');
      if (submit) submit.disabled = true;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        setStatus('Dziękujemy. Skontaktujemy się wkrótce.', 'success');
        form.reset();
      } catch (error) {
        setStatus('Nie udało się wysłać. Spróbuj ponownie lub napisz bezpośrednio.', 'error');
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  };

  ready(() => {
    initFadeIn();
    initSmoothScroll();
    initNavToggle();
    initContactForm();
  });
})();
