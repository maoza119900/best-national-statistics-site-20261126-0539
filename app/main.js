// Japan in Numbers — router and interaction.
//
// Hash routes, one per section. The page re-renders on every hash change, and
// a single delegated listener handles every control: year buttons, tabs, the
// sortable regions table, the finder, and the data explorer. No control is
// decorative — each one updates state and re-renders its part of the page.

(function () {
  'use strict';

  var V = window.JINViews;
  var D = window.JIN;

  var state = {
    pyramidYear: 2024,
    tradeYear: 2024,
    sectorIndex: 0,
    jobsTab: 'all',
    cpiYear: 2024,
    eduMode: 'age',
    regionFilter: '',
    regionSort: { key: 'pop', dir: -1 },
    regionSelected: 'Kanto',
    exIndicator: 'population',
    exFrom: 2015,
    exTo: 2024,
    exType: 'line',
  };

  var ROUTES = {
    '': 'overview',
    '/': 'overview',
    '/population': 'population',
    '/economy': 'economy',
    '/jobs': 'jobs',
    '/prices': 'prices',
    '/education-health': 'eduHealth',
    '/regions': 'regions',
    '/explorer': 'explorer',
    '/about': 'about',
  };

  var NAV = [
    ['#/', 'Overview'],
    ['#/population', 'Population'],
    ['#/economy', 'Economy'],
    ['#/jobs', 'Jobs'],
    ['#/prices', 'Prices'],
    ['#/education-health', 'Education & health'],
    ['#/regions', 'Regions'],
    ['#/explorer', 'Explorer'],
    ['#/about', 'About'],
  ];

  function routeName() {
    var hash = window.location.hash || '#/';
    var path = hash.slice(1);
    return ROUTES[path] || 'overview';
  }

  function render() {
    var name = routeName();
    var view = document.getElementById('view');
    view.innerHTML = V[name](state);
    document.title = 'Japan in Numbers — ' + name.charAt(0).toUpperCase() + name.slice(1);
    var nav = document.getElementById('nav');
    var links = nav.querySelectorAll('a');
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      var path = href.slice(1);
      a.classList.toggle('current', (ROUTES[path] || 'overview') === name);
      if ((ROUTES[path] || 'overview') === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    nav.classList.remove('open');
    var menuBtn = document.querySelector('[data-action="menu"]');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    window.scrollTo(0, 0);
  }

  function rerenderPanel() {
    var panel = document.getElementById('ex-panel');
    if (panel) panel.innerHTML = V.explorerPanel(state);
  }

  function finderFilter(query) {
    var list = document.getElementById('finder-list');
    if (!list) return;
    var q = query.trim().toLowerCase();
    list.querySelectorAll('li').forEach(function (li) {
      li.style.display = !q || li.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
    });
  }

  function regionRefresh() {
    var body = document.getElementById('region-body');
    if (body) body.innerHTML = V.regionRows(state);
    var detail = document.getElementById('region-detail');
    if (detail) detail.innerHTML = V.regionDetail(state);
  }

  function downloadCsv() {
    var s = D.SERIES[state.exIndicator];
    var from = Math.min(state.exFrom, state.exTo);
    var to = Math.max(state.exFrom, state.exTo);
    var lines = ['year,' + s.label.replace(/,/g, '') + ' (' + s.unit + ')'];
    D.YEARS.forEach(function (y, i) {
      if (y >= from && y <= to) lines.push(y + ',' + s.values[i]);
    });
    var blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'japan-' + state.exIndicator + '-' + from + '-' + to + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function onClick(event) {
    var el = event.target.closest('[data-action]');
    if (!el) return;
    var action = el.getAttribute('data-action');
    if (action === 'pyramid-year') {
      state.pyramidYear = Number(el.getAttribute('data-year'));
      render();
    } else if (action === 'trade-year') {
      state.tradeYear = Number(el.getAttribute('data-year'));
      render();
    } else if (action === 'sector-pick') {
      state.sectorIndex = Number(el.getAttribute('data-sector'));
      render();
    } else if (action === 'jobs-tab') {
      state.jobsTab = el.getAttribute('data-tab');
      render();
    } else if (action === 'cpi-year') {
      state.cpiYear = Number(el.getAttribute('data-year'));
      render();
    } else if (action === 'edu-mode') {
      state.eduMode = el.getAttribute('data-mode');
      render();
    } else if (action === 'region-sort') {
      var key = el.getAttribute('data-key');
      if (state.regionSort.key === key) state.regionSort.dir = -state.regionSort.dir;
      else state.regionSort = { key: key, dir: key === 'name' ? 1 : -1 };
      render();
      var input = document.getElementById('region-filter');
      if (input) input.focus();
    } else if (action === 'region-row') {
      state.regionSelected = el.getAttribute('data-name');
      var detail = document.getElementById('region-detail');
      if (detail) {
        detail.innerHTML = V.regionDetail(state);
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      document.querySelectorAll('#region-body tr').forEach(function (tr) {
        tr.classList.toggle('selected', tr.getAttribute('data-name') === state.regionSelected);
      });
    } else if (action === 'ex-type') {
      state.exType = el.getAttribute('data-type');
      render();
    } else if (action === 'ex-csv') {
      downloadCsv();
    } else if (action === 'menu') {
      var navEl = document.getElementById('nav');
      navEl.classList.toggle('open');
      el.setAttribute('aria-expanded', navEl.classList.contains('open') ? 'true' : 'false');
    } else if (action === 'top') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function onMouseOver(event) {
    var seg = event.target.closest('[data-sector]');
    if (!seg) return;
    var note = document.getElementById('sector-note');
    if (!note) return;
    var s = D.GDP_SECTORS[Number(seg.getAttribute('data-sector'))];
    note.innerHTML = '<strong>' + s.name + ' — ' + s.share.toFixed(1) + '% of GDP.</strong> ' + s.note;
  }

  function onChange(event) {
    var id = event.target.id;
    if (id === 'ex-indicator') {
      state.exIndicator = event.target.value;
      rerenderPanel();
    } else if (id === 'ex-from') {
      state.exFrom = Number(event.target.value);
      rerenderPanel();
    } else if (id === 'ex-to') {
      state.exTo = Number(event.target.value);
      rerenderPanel();
    }
  }

  function onInput(event) {
    var id = event.target.id;
    if (id === 'finder') finderFilter(event.target.value);
    else if (id === 'region-filter') {
      state.regionFilter = event.target.value;
      var body = document.getElementById('region-body');
      if (body) body.innerHTML = V.regionRows(state);
    }
  }

  function onKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    var el = event.target.closest('[data-action="region-sort"], [data-action="region-row"]');
    if (!el) return;
    event.preventDefault();
    el.click();
  }

  function buildNav() {
    var nav = document.getElementById('nav');
    nav.innerHTML = NAV.map(function (pair) {
      return '<a href="' + pair[0] + '">' + pair[1] + '</a>';
    }).join('');
  }

  function init() {
    buildNav();
    document.addEventListener('click', onClick);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('change', onChange);
    document.addEventListener('input', onInput);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
