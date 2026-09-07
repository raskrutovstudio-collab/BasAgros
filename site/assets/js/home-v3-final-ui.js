(() => {
  if (!document.body.classList.contains('page-home-main')) return;

  /* Keep desktop and mobile navigation complete. The generated source currently
     owns the commercial destinations; this layer restores Home and adds a direct
     Contacts destination, then turns the burger into a proper full navigation. */
  const nav = document.querySelector('.home-header .home-nav');
  const navList = nav?.querySelector(':scope > ul');
  if (navList) {
    const links = [...navList.querySelectorAll(':scope > li > a')];

    if (!links.some((a) => a.textContent.trim() === 'Главная')) {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = '/';
      anchor.textContent = 'Главная';
      if (location.pathname === '/' || /\/preview\/home-v3\/?$/.test(location.pathname)) {
        anchor.setAttribute('aria-current', 'page');
      }
      item.append(anchor);
      navList.prepend(item);
    }

    if (![...navList.querySelectorAll(':scope > li > a')].some((a) => a.textContent.trim() === 'Контакты')) {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = '#contacts';
      anchor.textContent = 'Контакты';
      item.append(anchor);
      navList.append(item);
    }

    if (!nav.querySelector('.home-mobile-nav-head')) {
      const head = document.createElement('div');
      head.className = 'home-mobile-nav-head';
      head.innerHTML = '<span>Навигация</span><strong>Меню BAS Agros</strong><small>Каталог, решения и информация для закупки семян</small>';
      navList.before(head);
    }

    const actions = nav.querySelector('.home-nav-actions');
    if (actions && !nav.querySelector('.home-mobile-nav-meta')) {
      const meta = document.createElement('div');
      meta.className = 'home-mobile-nav-meta';
      meta.innerHTML = '<span>Поставка по Казахстану</span><b>+7 705 960 89 87</b>';
      actions.after(meta);
    }
  }

  /* Full burger menu: same navigation as desktop, but with a deliberate mobile
     hierarchy instead of a plain list. Covers phones and tablets below desktop. */
  if (!document.getElementById('home-mobile-menu-full-style')) {
    const style = document.createElement('style');
    style.id = 'home-mobile-menu-full-style';
    style.textContent = `
      .home-mobile-nav-head,.home-mobile-nav-meta{display:none}

      @media (max-width:63.99rem){
        .page-home-main.menu-open{overflow:hidden!important}
        .page-home-main .home-header{z-index:13000!important}
        .page-home-main .home-menu-toggle{z-index:3!important}
        .page-home-main .home-nav{
          position:fixed!important;
          top:4.5rem!important;
          right:0!important;
          bottom:0!important;
          left:0!important;
          display:none!important;
          grid-template-rows:auto auto auto auto!important;
          align-content:start!important;
          width:100%!important;
          max-width:none!important;
          margin:0!important;
          padding:clamp(1rem,3.5vw,1.5rem) clamp(1rem,4vw,1.75rem) calc(1.25rem + env(safe-area-inset-bottom))!important;
          overflow-y:auto!important;
          overscroll-behavior:contain!important;
          background:
            radial-gradient(circle at 88% 2%,rgba(217,171,62,.17),transparent 18rem),
            radial-gradient(circle at 8% 88%,rgba(126,101,43,.08),transparent 20rem),
            linear-gradient(180deg,rgba(8,9,8,.995),rgba(4,5,4,.998))!important;
          border:0!important;
          box-shadow:inset 0 1px rgba(232,197,109,.13)!important;
        }
        .page-home-main .home-nav.is-open{display:grid!important}

        .page-home-main .home-mobile-nav-head{
          display:grid!important;
          gap:.28rem!important;
          margin:0 0 1rem!important;
          padding:0 0 1rem!important;
          border-bottom:1px solid rgba(232,197,109,.2)!important;
        }
        .page-home-main .home-mobile-nav-head>span{
          color:#d9ad42!important;
          font-size:.61rem!important;
          font-weight:800!important;
          line-height:1.2!important;
          letter-spacing:.16em!important;
          text-transform:uppercase!important;
        }
        .page-home-main .home-mobile-nav-head>strong{
          color:#fff8e9!important;
          font-size:clamp(1.65rem,6.6vw,2.15rem)!important;
          font-weight:750!important;
          line-height:1!important;
          letter-spacing:-.04em!important;
        }
        .page-home-main .home-mobile-nav-head>small{
          max-width:31rem!important;
          color:rgba(244,239,227,.52)!important;
          font-size:.74rem!important;
          line-height:1.42!important;
        }

        .page-home-main .home-nav>ul{
          display:grid!important;
          grid-template-columns:repeat(2,minmax(0,1fr))!important;
          gap:.48rem!important;
          width:100%!important;
          margin:0!important;
          padding:0!important;
          border:0!important;
          list-style:none!important;
          counter-reset:mobile-menu!important;
        }
        .page-home-main .home-nav>ul>li{
          position:relative!important;
          min-width:0!important;
          margin:0!important;
          padding:0!important;
          overflow:hidden!important;
          border:1px solid rgba(232,197,109,.15)!important;
          border-radius:.85rem!important;
          background:linear-gradient(145deg,rgba(255,255,255,.032),rgba(255,255,255,.012))!important;
          counter-increment:mobile-menu!important;
        }
        .page-home-main .home-nav>ul>li::before{
          content:counter(mobile-menu,decimal-leading-zero)!important;
          position:absolute!important;
          top:.55rem!important;
          left:.65rem!important;
          z-index:2!important;
          color:rgba(232,197,109,.55)!important;
          font-size:.5rem!important;
          font-weight:800!important;
          line-height:1!important;
          letter-spacing:.08em!important;
          pointer-events:none!important;
        }
        .page-home-main .home-nav>ul>li>a{
          position:relative!important;
          display:flex!important;
          min-height:4.25rem!important;
          align-items:flex-end!important;
          justify-content:flex-start!important;
          width:100%!important;
          padding:1.15rem 2rem .65rem .65rem!important;
          color:#f3eee2!important;
          font-size:.86rem!important;
          font-weight:750!important;
          line-height:1.15!important;
          letter-spacing:-.015em!important;
          text-decoration:none!important;
          white-space:normal!important;
        }
        .page-home-main .home-nav>ul>li>a::after{
          content:'↗'!important;
          position:absolute!important;
          right:.65rem!important;
          bottom:.62rem!important;
          color:#d9ad42!important;
          font-size:.82rem!important;
          font-weight:500!important;
          transition:transform .35s ease,color .35s ease!important;
        }
        .page-home-main .home-nav>ul>li>a[aria-current='page']{
          background:linear-gradient(135deg,rgba(188,138,35,.2),rgba(232,197,109,.05))!important;
          color:#fffaf0!important;
        }
        .page-home-main .home-nav>ul>li:focus-within,
        .page-home-main .home-nav>ul>li:active{
          border-color:rgba(239,201,101,.55)!important;
          background:linear-gradient(135deg,rgba(180,127,25,.18),rgba(255,255,255,.025))!important;
        }
        .page-home-main .home-nav>ul>li:focus-within>a::after,
        .page-home-main .home-nav>ul>li:active>a::after{
          color:#f2cf75!important;
          transform:translate(.12rem,-.12rem)!important;
        }

        .page-home-main .home-nav-actions{
          display:grid!important;
          grid-template-columns:1fr 1fr!important;
          gap:.5rem!important;
          width:100%!important;
          margin:1rem 0 0!important;
          padding:1rem 0 0!important;
          border-top:1px solid rgba(232,197,109,.18)!important;
        }
        .page-home-main .home-nav-actions .home-btn{
          width:100%!important;
          min-height:3.25rem!important;
          margin:0!important;
          padding:.65rem .7rem!important;
          border-radius:.82rem!important;
          font-size:.72rem!important;
          line-height:1.2!important;
          white-space:normal!important;
        }
        .page-home-main .home-nav-actions>a[href^='tel:']{
          border:1px solid rgba(232,197,109,.72)!important;
          background:linear-gradient(118deg,#8f641a 0%,#c8942f 30%,#e7c45f 54%,#a87520 100%)!important;
          color:#080908!important;
        }
        .page-home-main .home-nav-actions>a[href^='tel:'] svg{color:#080908!important}
        .page-home-main .home-nav-actions>.home-btn-primary{
          border:1px solid rgba(232,197,109,.34)!important;
          background:rgba(255,255,255,.02)!important;
          color:#f3eee2!important;
        }

        .page-home-main .home-mobile-nav-meta{
          display:flex!important;
          align-items:center!important;
          justify-content:space-between!important;
          gap:.75rem!important;
          margin-top:.75rem!important;
          padding:.72rem .1rem 0!important;
          color:rgba(244,239,227,.48)!important;
          font-size:.62rem!important;
          line-height:1.3!important;
        }
        .page-home-main .home-mobile-nav-meta>b{
          color:#e4c160!important;
          font-size:.68rem!important;
          font-weight:750!important;
          white-space:nowrap!important;
        }
      }

      @media (max-width:47.99rem){
        .page-home-main .home-nav{top:4.25rem!important}
      }

      @media (max-width:22.99rem){
        .page-home-main .home-nav>ul{grid-template-columns:1fr!important}
        .page-home-main .home-nav>ul>li>a{min-height:3.55rem!important}
        .page-home-main .home-nav-actions{grid-template-columns:1fr!important}
        .page-home-main .home-mobile-nav-meta{align-items:flex-start!important;flex-direction:column!important;gap:.25rem!important}
      }
    `;
    document.head.append(style);
  }

  /* Remove the legacy pictograms from every B2B scenario card. The imagery and
     typography are strong enough on their own and now carry the hierarchy. */
  document.querySelectorAll([
    '#audience .audience-scene-icon',
    '#audience .audience-scene-eyebrow .home-icon',
    '#audience .audience-scene-features .home-icon'
  ].join(',')).forEach((node) => node.remove());

  /* Remove the old circular arrow badges from catalogue cards. The text CTA is
     retained, matching the cleaner Popular crops interaction language. */
  document.querySelectorAll('.home-catalog .home-category-arrow').forEach((node) => node.remove());

  /* Bring catalogue silhouettes closer to Popular crops: the photo continues
     almost to the bottom and the copy floats over a dark readability gradient. */
  const terrainPaths = [
    'M0 10 C14 7 28 6 42 9 C58 13 74 16 100 13 L100 94 C82 92 68 95 54 97 C38 98 19 94 0 95 Z',
    'M0 13 C16 10 31 12 48 8 C65 4 81 5 100 8 L100 95 C82 97 67 98 52 96 C35 94 18 93 0 95 Z',
    'M0 8 C15 5 31 6 47 10 C63 14 80 15 100 12 L100 95 C82 93 68 95 53 97 C36 98 18 95 0 94 Z',
    'M0 12 C16 9 32 10 48 7 C65 4 82 5 100 9 L100 95 C82 97 67 98 52 97 C35 96 18 94 0 96 Z'
  ];
  const normalizedPath = (path) => path.replace(/-?\d*\.?\d+/g, (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? String(Number((number / 100).toFixed(4))) : value;
  });
  terrainPaths.forEach((path, index) => {
    document.querySelector(`#home-catalog-terrain-clip-${index} path`)?.setAttribute('d', normalizedPath(path));
    document.querySelector(`.home-category-${index + 1} .home-catalog-media-outline-line`)?.setAttribute('d', path);
  });
})();
