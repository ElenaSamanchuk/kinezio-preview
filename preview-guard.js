window.kinezioPreview = {"base": "/kinezio-preview", "routes": ["/", "/about", "/blog", "/coach-encyclopedia", "/course_foundation", "/data-consent", "/kinesio_help", "/kinesiologia", "/kinezio-club", "/learning_guide", "/mailing-consent", "/main", "/module-zero", "/muscle-testing", "/oferta", "/part_oferta", "/personaldata", "/results", "/specialist"]};
(() => {
  const { base, routes } = window.kinezioPreview;
  const allowed = routes && new Set(routes);
  const checkoutHosts = new Set([
    'lk.kineziofitness.online', 'kineziofitness.platformax.pro', 'lk.kineziofitness.tech',
    'sbsite.pro', 'checkout.tbank.ru', 'securepay.tinkoff.ru',
  ]);
  const notices = {
    link: 'Покупка, вход в ЛК и переход в бот отключены в превью.',
    route: 'Эта страница не входит в публичное превью.',
    form: 'В превью заявки не отправляются.',
  };

  function reason(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return '';
    let url;
    try { url = new URL(href, location.href); } catch { return ''; }
    if (checkoutHosts.has(url.hostname) || /^(?:\/kineziofitnesscourse_bot|\/payments\/)/i.test(url.pathname)) return 'link';
    if (allowed && url.origin === location.origin && url.pathname.startsWith(base + '/')) {
      const path = url.pathname.slice(base.length).replace(/\/$/, '') || '/';
      if (!allowed.has(path) && !/\.(?:pdf|png|jpe?g|webp|mp[34]|svg)$/i.test(path)) return 'route';
    }
    return '';
  }

  function notice(type) {
    let banner = document.getElementById('preview-notice');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'preview-notice';
      banner.setAttribute('role', 'status');
      banner.style.cssText = 'position:fixed;bottom:12px;left:12px;max-width:calc(100vw - 24px);z-index:2147483647;padding:10px 14px;background:#242424;color:white;border-radius:8px';
      document.body.append(banner);
    }
    banner.textContent = notices[type];
    clearTimeout(notice.timer);
    notice.timer = setTimeout(() => banner.remove(), 3200);
  }

  function disable(link) {
    const type = reason(link);
    if (type) {
      link.dataset.previewDisabled = type;
      link.setAttribute('href', '#preview-disabled');
      link.removeAttribute('target');
    }
  }

  function intercept(event) {
    const link = event.target.closest?.('a[href]');
    const type = link && (reason(link) || (link.getAttribute('href') === '#preview-disabled' && link.dataset.previewDisabled));
    if (!type) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    notice(type);
  }

  document.addEventListener('click', intercept, true);
  document.addEventListener('auxclick', intercept, true);
  document.addEventListener('submit', event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    notice('form');
  }, true);
  const scan = () => document.querySelectorAll('a[href]').forEach(disable);
  document.addEventListener('DOMContentLoaded', () => {
    scan();
    new MutationObserver(scan).observe(document.body, {
      subtree: true, childList: true, attributes: true, attributeFilter: ['href'],
    });
  }, { once: true });
})();
