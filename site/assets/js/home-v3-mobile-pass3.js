(() => {
  if (!document.body.classList.contains('page-home-main')) return;
  const mobile = window.matchMedia('(max-width: 47.99rem)');
  const button = document.querySelector('.home-back-to-top');
  if (!button) return;

  const sync = () => {
    if (!mobile.matches) return;
    const threshold = Math.max(1050, window.innerHeight * 1.45);
    if (window.scrollY < threshold) button.classList.remove('is-visible');
  };

  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  mobile.addEventListener?.('change', sync);
  sync();
})();
