(() => {
  const refreshStyles = document.createElement('link');
  refreshStyles.rel = 'stylesheet';
  refreshStyles.href = '/assets/styles/refresh.css';
  document.head.appendChild(refreshStyles);

  const one = (selector) => document.querySelector(selector);
  const all = (selector) => Array.from(document.querySelectorAll(selector));

  const menuToggle = one('[data-menu-toggle]');
  const mobileNav = one('[data-mobile-nav]');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    all('[data-mobile-nav] a').forEach((link) => link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.classList.remove('nav-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    }));
  }

  const chatPanel = one('[data-chat-panel]');
  const chatOpeners = all('[data-chat-open]');
  const chatCloser = one('[data-chat-close]');
  const setChatOpen = (open) => {
    if (!chatPanel) return;
    chatPanel.hidden = !open;
    chatOpeners.forEach((button) => button.setAttribute('aria-expanded', String(open)));
    if (open) one('[data-chat-form] textarea')?.focus();
  };
  chatOpeners.forEach((button) => button.addEventListener('click', () => setChatOpen(true)));
  chatCloser?.addEventListener('click', () => setChatOpen(false));
  all('[data-chat-options] button').forEach((button) => button.addEventListener('click', () => {
    if (button.hasAttribute('data-provider-route')) {
      window.location.href = '/providers/#apply';
      return;
    }
    all('[data-chat-options] button').forEach((option) => option.classList.remove('selected'));
    button.classList.add('selected');
  }));
  one('[data-chat-form]')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const content = one('[data-chat-content]');
    if (!content) return;
    content.innerHTML = '<div class="chat-confirm"><strong>This is a conversation preview.</strong><p>Your note was not sent or stored. A staffed Holdfast contact path will replace this preview before founding enrollment opens.</p><button type="button" data-chat-restart>Return to the preview</button></div>';
    one('[data-chat-restart]')?.addEventListener('click', () => window.location.reload());
  });

  const providerForm = one('[data-provider-form]');
  const providerNotice = one('[data-provider-notice]');
  const providerReturn = one('[data-provider-return]');
  providerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    providerForm.hidden = true;
    if (providerNotice) providerNotice.hidden = false;
  });
  providerReturn?.addEventListener('click', () => {
    if (providerForm) providerForm.hidden = false;
    if (providerNotice) providerNotice.hidden = true;
  });

  const portalSwitches = all('[data-portal-switch]');
  if (portalSwitches.length) {
    const ownerSummary = one('[data-owner-summary]');
    const partnerSummary = one('[data-partner-summary]');
    const ownerList = one('[data-owner-list]');
    const partnerList = one('[data-partner-list]');
    const roleKicker = one('[data-role-kicker]');
    const roleDescription = one('[data-role-description]');
    const greeting = one('[data-dashboard-greeting]');
    const company = one('[data-dashboard-company]');
    const avatar = one('[data-dashboard-avatar]');
    const dashLabel = one('[data-dash-label]');
    const setRole = (role) => {
      document.body.dataset.portalRole = role;
      portalSwitches.forEach((button) => {
        const active = button.dataset.portalSwitch === role;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      const isPartner = role === 'partner';
      if (ownerSummary) ownerSummary.hidden = isPartner;
      if (partnerSummary) partnerSummary.hidden = !isPartner;
      if (ownerList) ownerList.hidden = isPartner;
      if (partnerList) partnerList.hidden = !isPartner;
      if (roleKicker) roleKicker.textContent = isPartner ? 'Provider view' : 'Member view';
      if (roleDescription) roleDescription.textContent = isPartner
        ? 'See assigned companies, service commitments, reporting, and group opportunities.'
        : 'See shared departments, negotiated value, renewals, and open implementation work.';
      if (greeting) greeting.textContent = isPartner ? 'Provider preview' : 'Member preview';
      if (company) company.textContent = isPartner ? 'Example Department Provider' : 'Example Independent Company';
      if (avatar) avatar.textContent = 'EX';
      if (dashLabel) dashLabel.textContent = isPartner ? 'Provider activity' : 'Shared departments';
      window.history.replaceState({}, '', isPartner ? '/portal/?role=partner' : '/portal/');
    };
    const initialRole = new URLSearchParams(window.location.search).get('role') === 'partner' ? 'partner' : 'owner';
    setRole(initialRole);
    portalSwitches.forEach((button) => button.addEventListener('click', () => setRole(button.dataset.portalSwitch)));

    const portalForm = one('[data-portal-form]');
    const portalNotice = one('[data-portal-notice]');
    const portalRequesters = all('[data-portal-request]');
    const portalReturn = one('[data-portal-return]');
    const showPortalNotice = () => {
      if (portalForm) portalForm.hidden = true;
      if (portalNotice) portalNotice.hidden = false;
    };
    portalForm?.addEventListener('submit', (event) => { event.preventDefault(); showPortalNotice(); });
    portalRequesters.forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); showPortalNotice(); }));
    portalReturn?.addEventListener('click', () => {
      if (portalForm) portalForm.hidden = false;
      if (portalNotice) portalNotice.hidden = true;
    });
  }
})();
