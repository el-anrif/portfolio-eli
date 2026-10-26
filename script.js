/* ==========================================================================
   Portfolio — EL-Anrif · BTS SIO SISR
   Interactions : thème clair/sombre, navigation à encoches, reveal au scroll,
   modales, boutons magnétiques, parallaxe du hero, éclat sur les cartes.
   ========================================================================== */
(() => {
  'use strict';

  const reducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     0. THÈME CLAIR / SOMBRE
     ------------------------------------------------------------------------ */
  const themeToggles = Array.from(document.querySelectorAll('[data-theme-toggle]'));
  const themeColor = document.getElementById('theme-color');

  const applyTheme = (theme, persist = false) => {
    const light = theme === 'light';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.documentElement.style.colorScheme = light ? 'light' : 'dark';

    themeToggles.forEach((btn) => {
      btn.setAttribute(
        'aria-label',
        light ? 'Activer le mode sombre' : 'Activer le mode clair'
      );
    });

    themeColor?.setAttribute('content', light ? '#F4F7F2' : '#072B26');

    if (persist) {
      try {
        localStorage.setItem('eli-theme', light ? 'light' : 'dark');
      } catch (e) {}
    }
  };

  const initialTheme =
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  applyTheme(initialTheme);

  themeToggles.forEach((btn) =>
    btn.addEventListener('click', () => {
      const next =
        document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      applyTheme(next, true);
    })
  );

  // Synchronise le thème entre plusieurs onglets ouverts.
  window.addEventListener('storage', (e) => {
    if (e.key === 'eli-theme') {
      applyTheme(e.newValue === 'dark' ? 'dark' : 'light');
    }
  });

  /* ------------------------------------------------------------------------
     1. NAVIGATION — encoches, pilule active, menu compact
     ------------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const navPill = document.getElementById('nav-pill');
  const navTabs = Array.from(document.querySelectorAll('.notch-nav__tab'));
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const mobileNav = document.getElementById('notch-mobile');
  const mobileToggle = document.getElementById('notch-toggle');
  const mobileLabel = document.getElementById('notch-mobile-label');
  const mobileDropdown = document.getElementById('notch-dropdown');
  const navScrim = document.getElementById('notch-scrim');
  const sections = [
    document.getElementById('accueil'),
    document.getElementById('a-propos'),
    document.getElementById('projets'),
    document.getElementById('competences'),
    document.getElementById('contact'),
  ].filter(Boolean);

  let activeSectionId = '';

  const setScrolled = () =>
    nav.classList.toggle('is-scrolled', window.scrollY > 24);

  // La pilule active glisse sous l'onglet courant.
  const syncNavPill = () => {
    if (!navPill) return;
    const active = navTabs.find((tab) => tab.classList.contains('is-active'));
    if (!active) {
      navPill.style.opacity = '0';
      return;
    }
    navPill.style.width = `${active.offsetWidth}px`;
    navPill.style.transform = `translate(${active.offsetLeft}px, -50%)`;
    navPill.style.opacity = '1';
  };

  // Section active (onglets desktop + liens du menu mobile)
  const updateActive = () => {
    const pos = window.scrollY + window.innerHeight * 0.4;
    let current = sections[0].id;
    for (const s of sections) {
      if (s.offsetTop <= pos) current = s.id;
    }

    if (current !== activeSectionId) {
      activeSectionId = current;
      const activeLink = navLinks.find(
        (a) => a.getAttribute('href') === `#${current}`
      );

      navLinks.forEach((a) => {
        const active = a.getAttribute('href') === `#${current}`;
        a.classList.toggle('is-active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });

      if (activeLink && mobileLabel) {
        mobileLabel.textContent = activeLink.textContent.trim();
      }

      syncNavPill();
    }

    return current;
  };

  let scrollRaf = null;
  const onScroll = () => {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      setScrolled();
      updateActive();
      parallaxHero();
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  setScrolled();
  updateActive();
  requestAnimationFrame(syncNavPill);
  if (document.fonts?.ready) document.fonts.ready.then(syncNavPill);

  // Menu compact (tablette / mobile)
  const setMobileNav = (open) => {
    if (!mobileNav || !mobileToggle || !mobileDropdown) return;
    const expanded = Boolean(open);
    mobileNav.classList.toggle('is-open', expanded);
    mobileToggle.setAttribute('aria-expanded', String(expanded));
    mobileToggle.setAttribute(
      'aria-label',
      expanded ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'
    );
    mobileDropdown.setAttribute('aria-hidden', String(!expanded));
    document.body.classList.toggle('nav-open', expanded);
  };

  mobileToggle?.addEventListener('click', () =>
    setMobileNav(!mobileNav.classList.contains('is-open'))
  );

  // Ferme le menu compact depuis n'importe quel lien qu'il contient.
  mobileNav?.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => setMobileNav(false))
  );

  navScrim?.addEventListener('click', () => setMobileNav(false));

  // Le menu compact se referme dès que la page défile.
  window.addEventListener(
    'scroll',
    () => {
      if (mobileNav?.classList.contains('is-open')) setMobileNav(false);
    },
    { passive: true }
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) {
      setMobileNav(false);
      mobileToggle?.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (
      window.matchMedia('(min-width: 1280px)').matches &&
      mobileNav?.classList.contains('is-open')
    ) {
      setMobileNav(false);
    }
    syncNavPill();
  });

  /* ------------------------------------------------------------------------
     2. REVEAL AU SCROLL (fade + translateY + délai en cascade)
     ------------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');

  // La cascade utilise --delay (CSS) ; on la branche sur l'attribut data-delay
  revealEls.forEach((el) => {
    if (el.dataset.delay) el.style.setProperty('--delay', el.dataset.delay);
  });

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => revealIO.observe(el));
  }

  /* ------------------------------------------------------------------------
     3. HERO : parallaxe verticale légère du contenu au scroll.
     ------------------------------------------------------------------------ */
  const hero = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');

  const parallaxHero = () => {
    if (!heroContent || reducedMotion) return;
    const sy = window.scrollY;
    if (sy < hero.offsetHeight) {
      heroContent.style.transform = `translate3d(0, ${(sy * 0.22).toFixed(1)}px, 0)`;
    }
  };

  /* ------------------------------------------------------------------------
     4. ÉCLAT SUIVANT LE CURSEUR SUR LES CARTES PROJETS & COMPÉTENCES
     ------------------------------------------------------------------------ */
  if (!reducedMotion) {
    document.querySelectorAll('.proj-card, .skill').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. BOUTONS MAGNÉTIQUES (--mag-x / --mag-y consommés par le CSS)
     ------------------------------------------------------------------------ */
  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const max = 6;
        btn.style.setProperty('--mag-x', `${Math.max(-max, Math.min(max, x * 0.2)).toFixed(1)}px`);
        btn.style.setProperty('--mag-y', `${Math.max(-max, Math.min(max, y * 0.2)).toFixed(1)}px`);
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mag-x', '0px');
        btn.style.setProperty('--mag-y', '0px');
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. MODALES PROJETS (ouverture, fermeture, focus, Escape, verrou du body)
     ------------------------------------------------------------------------ */
  const modals = Array.from(document.querySelectorAll('.modal'));
  let lastFocused = null;

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const closeBtn = modal.querySelector('[data-close][aria-label="Fermer"], .modal__close');
    modal.querySelector('.modal__panel').scrollTop = 0;
    closeBtn?.focus();
  };

  const closeModal = (modal) => {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    lastFocused?.focus?.();
  };

  document.querySelectorAll('[data-modal]').forEach((btn) =>
    btn.addEventListener('click', () => openModal(btn.dataset.modal))
  );

  modals.forEach((modal) => {
    modal.querySelectorAll('[data-close]').forEach((el) =>
      el.addEventListener('click', () => closeModal(modal))
    );
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = modals.find((m) => !m.hidden);
    if (open) closeModal(open);
  });

  // Verrou du scroll quand une modale est ouverte
  document.head.insertAdjacentHTML(
    'beforeend',
    '<style>body.modal-open{overflow:hidden}</style>'
  );

  /* ------------------------------------------------------------------------
     7. LIENS PLACEHOLDERS (PDF à venir) — on neutralise le clic
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[data-placeholder-todo]').forEach((a) =>
    a.addEventListener('click', (e) => e.preventDefault())
  );

  /* ------------------------------------------------------------------------
     8. FORMULAIRE DE CONTACT — envoi via Formspree (AJAX)
     ------------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  const formOk = document.getElementById('form-ok');
  const formError = document.getElementById('form-error');

  if (form && formOk && formError) {
    const submitButton = form.querySelector('button[type="submit"]');
    const defaultSubmitText = submitButton?.textContent || 'Envoyer le message';
    const endpoint = form.getAttribute('action') || '';
    const isConfigured =
      endpoint.startsWith('https://formspree.io/f/') &&
      !endpoint.includes('VOTRE_ID');

    const showNotice = (element, message) => {
      formOk.hidden = true;
      formError.hidden = true;
      element.textContent = message;
      element.hidden = false;
      element.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
      });
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      formOk.hidden = true;
      formError.hidden = true;

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (!isConfigured) {
        showNotice(
          formError,
          "Le formulaire n'est pas encore configuré. Écrivez-moi à elanrifdaroueche37@gmail.com."
        );
        return;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours…';
      }
      form.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          form.reset();
          showNotice(
            formOk,
            'Merci ! Votre message a bien été envoyé. Je vous répondrai rapidement.'
          );
        } else {
          let message =
            "L'envoi a échoué. Réessayez ou écrivez-moi directement à elanrifdaroueche37@gmail.com.";
          try {
            const data = await response.json();
            if (Array.isArray(data.errors) && data.errors.length) {
              message = data.errors.map((error) => error.message).join(' ');
            }
          } catch (err) {}
          showNotice(formError, message);
        }
      } catch (err) {
        showNotice(
          formError,
          "Impossible de joindre le serveur. Vérifiez votre connexion ou écrivez-moi à elanrifdaroueche37@gmail.com."
        );
      } finally {
        form.removeAttribute('aria-busy');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultSubmitText;
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     9. ANNÉE DU FOOTER
     ------------------------------------------------------------------------ */
  const year = new Date().getFullYear();
  document.querySelectorAll('.footer [data-year]').forEach((el) => {
    el.textContent = year;
  });
})();