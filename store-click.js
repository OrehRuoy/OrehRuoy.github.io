(function () {
  'use strict';

  var APP_BY_ID = {
    '6789962999': 'Circuit Sort',
    '6794008104': "What's 4 Dinner",
    '6794476571': 'Spectrum Sync',
    '6796806236': 'StimPad',
    '6803560086': 'Taptico',
    '6805591903': 'Oil Due',
    '6817437890': 'Clickety',
    '6830324321': 'SewLens'
  };

  var APP_BY_PACKAGE = {
    'com.circuitsort.screwpuzzle': 'Circuit Sort',
    'com.whats4dinner.whats4dinner': "What's 4 Dinner",
    'com.forkit.randomrestaurant': 'Fork It',
    'com.sensorfit.pushupcounter': 'SensorFit',
    'com.spectrumsync.keyboard': 'Spectrum Sync',
    'com.stimpad.soundboard': 'StimPad',
    'com.taptico.fidgettoys': 'Taptico'
  };

  function storeFromHost(host) {
    if (host === 'apps.apple.com') return 'app_store';
    if (host === 'play.google.com') return 'google_play';
    return '';
  }

  function appFromUrl(url) {
    var idMatch = url.pathname.match(/\/id(\d+)/);
    if (idMatch && APP_BY_ID[idMatch[1]]) return APP_BY_ID[idMatch[1]];
    var pkg = url.searchParams.get('id');
    if (pkg && APP_BY_PACKAGE[pkg]) return APP_BY_PACKAGE[pkg];
    return '';
  }

  function textName(anchor) {
    var text = (anchor.textContent || '').replace(/\s+/g, ' ').trim();
    if (text && !/^(app store|google play|download on the app store|get it on google play)$/i.test(text)) {
      return text;
    }
    return '';
  }

  function sectionName(anchor) {
    var section = anchor.closest('article.showcase, article, section');
    if (!section) return '';
    var heading = section.querySelector('header h2, header h1, h2, h1');
    if (!heading) return '';
    var name = (heading.textContent || '').replace(/\s+/g, ' ').trim();
    if (!name) return '';
    return name.replace(/\s*[:—–-].*$/, '').trim() || name;
  }

  function appName(anchor, url) {
    var fromUrl = appFromUrl(url);
    if (fromUrl) return fromUrl;
    var labeled = anchor.getAttribute('data-app');
    if (!labeled) {
      var host = anchor.closest('[data-app]');
      if (host) labeled = host.getAttribute('data-app');
    }
    if (labeled) return labeled.trim();
    return textName(anchor) || sectionName(anchor) || 'unknown';
  }

  function send(store, app, linkUrl) {
    if (typeof gtag !== 'function') return;
    gtag('event', 'store_click', {
      store: store,
      app: app,
      link_url: linkUrl,
      transport_type: 'beacon'
    });
  }

  function onActivate(event) {
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    var url;
    try {
      url = new URL(anchor.href, document.baseURI);
    } catch (err) {
      return;
    }
    var store = storeFromHost(url.hostname);
    if (!store) return;
    send(store, appName(anchor, url), url.href);
  }

  document.addEventListener('click', onActivate, true);
  document.addEventListener('auxclick', onActivate, true);
})();
