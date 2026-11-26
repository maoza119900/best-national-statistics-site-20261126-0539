// Japan in Numbers — router and interactions.
//
// One page, nine hash routes. The router renders the view for the current
// hash into #app; every control on a view is wired up here by delegation,
// so a view's HTML never carries inline handlers. All state lives in this
// file and is passed to the views.

import { SERIES, YEARS, GDP_SECTORS } from './data.js';
import {
  viewAbout,
  viewEconomy,
  viewEducationHealth,
  viewExplorer,
  viewJobs,
  viewOverview,
  viewPopulation,
  viewPrices,
  viewRegions,
} from './views.js';

const ROUTES = {
  '/': viewOverview,
  '/population': viewPopulation,
  '/economy': viewEconomy,
  '/jobs': viewJobs,
  '/prices': viewPrices,
  '/education-health': viewEducationHealth,
  '/regions': viewRegions,
  '/explorer': viewExplorer,
  '/about': viewAbout,
};

const TITLES = {
  '/': 'Japan in Numbers — Overview',
  '/population': 'Population — Japan in Numbers',
  '/economy': 'Economy — Japan in Numbers',
  '/jobs': 'Employment & income — Japan in Numbers',
  '/prices': 'Prices & inflation — Japan in Numbers',
  '/education-health': 'Education & health — Japan in Numbers',
  '/regions': 'Regions compared — Japan in Numbers',
  '/explorer': 'Data explorer — Japan in Numbers',
  '/about': 'About & methods — Japan in Numbers',
};

const state = {
  search: '',
  pyramidYear: 2024,
  tradeYear: 2024,
  jobsTab: 'all',
  cpiYear: 2024,
  attainmentGroup: 'All ages 25–64',
  regionFilter: '',
  regionSort: { key: 'population', dir: -1 },
  regionSelected: null,
  explorer: { indicator: 'population', from: 2015, to: 2024, type: 'line' },
};

const app = document.getElementById('app');
const nav = document.getElementById('nav');
const menuButton = document.getElementById('menu-button');

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return Object.hasOwn(ROUTES, hash) ? hash : '/';
}

function render() {
  const route = currentRoute();
  const view = ROUTES[route];
  app.innerHTML = view(state);
  document.title = TITLES[route];
  for (const link of nav.querySelectorAll('a')) {
    const href = link.getAttribute('href');
    if (href === `#${route}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

function rerenderKeepFocus() {
  const active = document.activeElement;
  const id = active && active.id ? active.id : null;
  const value = active && 'value' in active ? active.value : null;
  const start = active && typeof active.selectionStart === 'number' ? active.selectionStart : null;
  render();
  if (id) {
    const next = document.getElementById(id);
    if (next) {
      next.focus();
      if (value !== null && 'value' in next) next.value = value;
      if (start !== null && typeof next.setSelectionRange === 'function') {
        try {
          next.setSelectionRange(start, start);
        } catch {
          // A select has no caret to restore; the value above is enough.
        }
      }
    }
  }
}

function downloadCsv() {
  const ex = state.explorer;
  const ind = SERIES[ex.indicator];
  const from = Math.min(ex.from, ex.to);
  const to = Math.max(ex.from, ex.to);
  const lines = [`Year,${ind.label} (${ind.unit})`];
  for (const y of YEARS) {
    if (y < from || y > to) continue;
    lines.push(`${y},${ind.values[YEARS.indexOf(y)]}`);
  }
  const blob = new Blob([`${lines.join('\n')}\n`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `japan-${ex.indicator}-${from}-${to}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sectorNote(name) {
  const item = GDP_SECTORS.find((s) => s.name === name);
  if (!item) return;
  const detail = document.getElementById('sector-detail');
  if (detail) detail.textContent = `${item.name} — ${item.share.toFixed(1)}% of GDP. ${item.note}`;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'pyramid-year') {
    state.pyramidYear = Number(target.dataset.year);
    render();
  } else if (action === 'trade-year') {
    state.tradeYear = Number(target.dataset.year);
    render();
  } else if (action === 'jobs-tab') {
    state.jobsTab = target.dataset.tab;
    render();
  } else if (action === 'cpi-year') {
    state.cpiYear = Number(target.dataset.year);
    render();
  } else if (action === 'attainment-group') {
    state.attainmentGroup = target.dataset.group;
    render();
  } else if (action === 'region-sort') {
    const key = target.dataset.key;
    if (state.regionSort.key === key) state.regionSort.dir *= -1;
    else state.regionSort = { key, dir: key === 'name' ? 1 : -1 };
    render();
  } else if (action === 'region-row') {
    state.regionSelected = target.dataset.region;
    render();
    const detail = document.querySelector('.region-detail');
    if (detail) detail.scrollIntoView({ block: 'nearest' });
  } else if (action === 'explorer-type') {
    state.explorer.type = target.dataset.type;
    render();
  } else if (action === 'explorer-csv') {
    downloadCsv();
  }
});

app.addEventListener('input', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'finder') {
    state.search = target.value;
    rerenderKeepFocus();
  } else if (action === 'region-filter') {
    state.regionFilter = target.value;
    rerenderKeepFocus();
  }
});

app.addEventListener('change', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  if (action === 'explorer-indicator') {
    state.explorer.indicator = target.value;
    render();
  } else if (action === 'explorer-from') {
    state.explorer.from = Number(target.value);
    render();
  } else if (action === 'explorer-to') {
    state.explorer.to = Number(target.value);
    render();
  }
});

app.addEventListener('mouseover', (event) => {
  const seg = event.target.closest('.donut-seg, .donut-legend');
  if (seg) sectorNote(seg.dataset.name);
});

app.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest('[data-action="region-row"]');
  if (row) {
    event.preventDefault();
    state.regionSelected = row.dataset.region;
    render();
  }
});

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

window.addEventListener('hashchange', () => {
  render();
  window.scrollTo(0, 0);
});

render();
