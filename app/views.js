// Views for Japan in Numbers. Each function returns the HTML for one hash
// route. All state lives in main.js and is passed in; every control the
// views render is wired up there, so nothing here runs code on its own.

import {
  AGE_BANDS,
  AGE_SHARES,
  ATTAINMENT,
  CPI_BY_YEAR,
  CPI_CATEGORIES,
  EMPLOYMENT,
  EMPLOYMENT_SECTORS,
  GDP_SECTORS,
  HEALTH,
  INDICATORS,
  KEY_FACTS,
  PARTICIPATION,
  PREFECTURES,
  PYRAMID,
  REGIONS,
  RELEASES,
  SERIES,
  TOP_EXPORTS,
  TRADE,
  TRADE_YEARS,
  URBAN_SHARE,
  WAGES,
  YEARS,
} from './data.js';
import { barChart, donutChart, lineChart, pyramidChart } from './charts.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const fmtInt = (v) => v.toLocaleString('en-US');
const money = (v) => `$${fmtInt(v)}`;
const pct1 = (v) => `${v.toFixed(1)}%`;

/** One KPI card linking to its section. */
function kpiCard(ind) {
  return `<a class="kpi-card" href="${ind.route}">
  <span class="kpi-value">${esc(ind.value)}</span>
  <span class="kpi-label">${esc(ind.label)}</span>
  <span class="kpi-year">${ind.year} · rounded estimate</span>
</a>`;
}

function sectionHead(title, sub) {
  return `<div class="page-head"><h1>${esc(title)}</h1><p>${esc(sub)}</p></div>`;
}

function card(title, inner, extra = '') {
  return `<section class="card ${extra}"><h2>${esc(title)}</h2>${inner}</section>`;
}

/** A simple two-column definition table. */
function factsTable(rows) {
  return `<table class="facts"><tbody>${rows
    .map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`)
    .join('')}</tbody></table>`;
}

// ---------------------------------------------------------------- overview

export function viewOverview(state) {
  const kpis = ['population', 'gdp', 'gdpPerCapita', 'unemployment', 'cpi', 'lifeExpectancy'].map(
    (key) => INDICATORS.find((i) => i.key === key),
  );
  const q = (state.search || '').trim().toLowerCase();
  const found = INDICATORS.filter((i) => !q || i.label.toLowerCase().includes(q) || i.key.toLowerCase().includes(q));
  const finder = found.length
    ? `<ul class="finder-list">${found
        .map(
          (i) =>
            `<li><a href="${i.route}">${esc(i.label)}</a><span>${esc(i.value)} · ${i.year}</span></li>`,
        )
        .join('')}</ul>`
    : `<p class="empty">No indicator matches “${esc(state.search)}”. Try “GDP”, “prices” or “jobs”.</p>`;
  return `${sectionHead('Japan in Numbers', 'Headline statistics for Japan, 2015–2024 — rounded public estimates, free to explore.')}
<div class="kpi-grid">${kpis.map(kpiCard).join('')}</div>
<div class="grid-2">
${card(
  'Population trend',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.population.values, format: (v) => `${v.toFixed(1)}m`, label: 'Population 2015 to 2024, millions' })}</div>
  <p class="note">Population fell from 127.1m in 2015 to 124.0m in 2024 — about 300,000 fewer people a year.</p>`,
)}
${card(
  'Nominal GDP trend',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.gdp.values, format: (v) => `$${v.toFixed(2)}tn`, color: '#0e7c7b', label: 'Nominal GDP 2015 to 2024, US dollars trillion' })}</div>
  <p class="note">Nominal GDP was $4.03tn in 2024. The yen's slide since 2022 pulls the dollar figure down even as yen GDP grew.</p>`,
)}
</div>
${card(
  'Find an indicator',
  `<label class="search-label" for="finder">Search the indicators on this site</label>
  <input id="finder" class="search" type="search" placeholder="Try “unemployment” or “life expectancy”…" value="${esc(state.search || '')}" data-action="finder" autocomplete="off">
  ${finder}`,
)}
<div class="grid-2">
${card(
  'Latest releases',
  `<ul class="releases">${RELEASES.map(
    (r) =>
      `<li><a href="${r.route}">${esc(r.title)}</a><span class="release-date">${esc(r.date)}</span><p>${esc(r.text)}</p></li>`,
  ).join('')}</ul>`,
)}
${card('Key facts', factsTable(KEY_FACTS.map((f) => [f.label, f.value])))}
</div>
<p class="fineprint">Figures are rounded estimates. See <a href="#/about">About &amp; methods</a> for how they were compiled.</p>`;
}

// ---------------------------------------------------------------- population

export function viewPopulation(state) {
  const year = state.pyramidYear;
  const shares = AGE_SHARES[year];
  return `${sectionHead('Population', '124.0 million people in 2024 — shrinking, and older every year.')}
${card(
  'Total population, 2015–2024',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.population.values, format: (v) => `${v.toFixed(1)}m`, label: 'Total population 2015 to 2024' })}</div>
  <p class="note">Nine straight years of decline: 127.1m in 2015 to 124.0m in 2024.</p>`,
)}
<div class="grid-2">
${card(
  `Age structure — ${year}`,
  `<div class="year-btns" role="group" aria-label="Pyramid year">${[2015, 2020, 2024]
    .map((y) => `<button class="btn${y === year ? ' active' : ''}" data-action="pyramid-year" data-year="${y}">${y}</button>`)
    .join('')}</div>
  <div class="chart">${pyramidChart({ bands: AGE_BANDS, values: PYRAMID[year], label: `Population by age group, ${year}` })}</div>
  <p class="note">Share of the total population in each 5-year band, ${year}.</p>`,
)}
${card(
  `Who lives here — ${year}`,
  `<div class="chart">${barChart({
    labels: ['Ages 0–14', 'Ages 15–64', 'Ages 65+'],
    values: [shares.young, shares.working, shares.senior],
    format: pct1,
    color: '#0e7c7b',
    label: `Age-group shares, ${year}`,
  })}</div>
  ${factsTable([
    ['Children (0–14)', `${shares.young.toFixed(1)}%`],
    ['Working age (15–64)', `${shares.working.toFixed(1)}%`],
    ['65 and over', `${shares.senior.toFixed(1)}%`],
  ])}
  <p class="note">Almost three in ten residents were 65 or older in 2024 — the highest share in the world.</p>`,
)}
</div>
<div class="grid-2">
${card(
  'Where people live',
  `<p class="lede"><strong>${URBAN_SHARE}%</strong> of residents live in urban areas; <strong>${(100 - URBAN_SHARE).toFixed(1)}%</strong> in rural areas.</p>
  <h3>Largest prefectures, 2024</h3>
  <table class="table"><thead><tr><th scope="col">Prefecture</th><th scope="col" class="num">Population</th></tr></thead>
  <tbody>${PREFECTURES.map((p) => `<tr><td>${esc(p.name)}</td><td class="num">${p.population.toFixed(1)}m</td></tr>`).join('')}</tbody></table>`,
)}
${card(
  'Births and deaths',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.births.values, format: (v) => `${v.toFixed(2)}m`, color: '#0e7c7b', label: 'Live births 2015 to 2024' })}</div>
  ${factsTable([
    ['Live births, 2024', '0.72m'],
    ['Deaths, 2024', '1.62m'],
    ['Natural change, 2024', '−0.90m'],
    ['Live births, 2015', '1.01m'],
  ])}
  <p class="note">Deaths have outnumbered births every year since 2007; the gap widened to about 900,000 in 2024.</p>`,
)}
</div>`;
}

// ---------------------------------------------------------------- economy

export function viewEconomy(state) {
  const year = state.tradeYear;
  const ti = TRADE_YEARS.indexOf(year);
  const balance = TRADE.exports[ti] - TRADE.imports[ti];
  return `${sectionHead('Economy', 'The world’s fourth-largest economy: $4.03 trillion in 2024.')}
<div class="grid-2">
${card(
  'Nominal GDP, 2015–2024',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.gdp.values, format: (v) => `$${v.toFixed(2)}tn`, label: 'Nominal GDP 2015 to 2024' })}</div>
  <p class="note">GDP per capita was $32,500 in 2024 — down in dollars from $40,810 in 2019 as the yen weakened.</p>`,
)}
${card(
  'Real growth, % year on year',
  `<div class="chart">${barChart({ labels: YEARS.map(String), values: SERIES.realGrowth.values, format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`, color: '#2456a6', label: 'Real GDP growth 2015 to 2024' })}</div>
  <p class="note">The pandemic year, 2020, took real GDP down 4.2%; 2024 slipped 0.1% as consumption stayed soft.</p>`,
)}
</div>
<div class="grid-2">
${card(
  'What makes up GDP — 2024',
  `<div class="chart">${donutChart({ items: GDP_SECTORS, label: 'GDP by sector, 2024' })}</div>
  <p class="note" id="sector-detail">Hover or tap a slice to read about it. Services — wholesale and retail, health, education, finance, transport and other services — make up 69.0% of GDP.</p>`,
)}
${card(
  'Trade in goods',
  `<div class="year-btns" role="group" aria-label="Trade year">${TRADE_YEARS.map(
    (y) => `<button class="btn${y === year ? ' active' : ''}" data-action="trade-year" data-year="${y}">${y}</button>`,
  ).join('')}</div>
  ${factsTable([
    [`Exports, ${year}`, money(TRADE.exports[ti]) + 'bn'],
    [`Imports, ${year}`, money(TRADE.imports[ti]) + 'bn'],
    [
      `Balance, ${year}`,
      `${balance >= 0 ? '+' : '−'}$${fmtInt(Math.abs(balance))}bn ${balance >= 0 ? 'surplus' : 'deficit'}`,
    ],
  ])}
  <p class="note">Japan has run a goods deficit every year since 2021, driven by energy imports and the weak yen.</p>`,
)}
</div>
${card(
  'Top export industries, 2024',
  `<table class="table"><thead><tr><th scope="col">Industry</th><th scope="col" class="num">Exports</th><th scope="col" class="num">Share of exports</th></tr></thead>
  <tbody>${TOP_EXPORTS.map(
    (t) => `<tr><td>${esc(t.industry)}</td><td class="num">$${t.value}bn</td><td class="num">${t.share.toFixed(1)}%</td></tr>`,
  ).join('')}</tbody></table>
  <p class="note">Cars and parts alone are about a fifth of everything Japan sells abroad.</p>`,
)}`;
}

// ---------------------------------------------------------------- jobs

export function viewJobs(state) {
  const tab = state.jobsTab;
  const tabs = [
    ['all', 'All workers'],
    ['men', 'Men'],
    ['women', 'Women'],
  ];
  return `${sectionHead('Employment & income', '2.5% unemployment in 2024 — near a three-decade low — with 69.3 million people in the labour force.')}
<div class="grid-2">
${card(
  'Unemployment rate, 2015–2024',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.unemployment.values, format: pct1, color: '#0e7c7b', label: 'Unemployment rate 2015 to 2024' })}</div>
  <p class="note">Unemployment fell from 3.4% in 2015 to 2.4% before the pandemic, then settled near 2.5%.</p>`,
)}
${card(
  'Labour force at a glance',
  factsTable([
    ['Labour force, 2024', '69.3m people'],
    ['Employed, 2024', '67.6m people'],
    ['Unemployed, 2024', '1.7m people'],
    ['Labour force, 2015', '66.0m people'],
  ]) +
    `<p class="note">The labour force grew by 3.3 million since 2015, mostly as more women and older workers joined.</p>`,
)}
</div>
<div class="grid-2">
${card(
  'Employment by sector, 2024',
  `<div class="year-btns" role="group" aria-label="Employment by sex">${tabs
    .map((t) => `<button class="btn${t[0] === tab ? ' active' : ''}" data-action="jobs-tab" data-tab="${t[0]}">${t[1]}</button>`)
    .join('')}</div>
  <div class="chart">${barChart({
    labels: EMPLOYMENT_SECTORS,
    values: EMPLOYMENT[tab],
    format: (v) => `${v.toFixed(1)}m`,
    color: '#2456a6',
    label: `Employment by sector, ${tabs.find((t) => t[0] === tab)[1].toLowerCase()}, 2024`,
  })}</div>
  <p class="note">Services employ 48.3m of the 67.6m workers — more than seven in ten jobs.</p>`,
)}
${card(
  'Who works, by age — 2024',
  `<div class="chart">${barChart({
    labels: PARTICIPATION.map((p) => p.group),
    values: PARTICIPATION.map((p) => p.rate),
    format: pct1,
    color: '#0e7c7b',
    label: 'Labour-force participation by age group, 2024',
  })}</div>
  <p class="note">Participation peaks at 88% in the late 20s to mid 40s; one in four people over 65 still works.</p>`,
)}
</div>
${card(
  'Average monthly pay by industry, 2024',
  `<table class="table"><thead><tr><th scope="col">Industry</th><th scope="col" class="num">Monthly pay</th></tr></thead>
  <tbody>${WAGES.map((w) => `<tr><td>${esc(w.industry)}</td><td class="num">¥${fmtInt(w.wage)}</td></tr>`).join('')}</tbody></table>
  <p class="note">Cash earnings before tax and social insurance, rounded to the nearest ¥10,000. Finance pays about twice what food services do.</p>`,
)}`;
}

// ---------------------------------------------------------------- prices

export function viewPrices(state) {
  const year = state.cpiYear;
  return `${sectionHead('Prices & inflation', 'Consumer prices rose 2.7% in 2024 — the third straight year above 2%.')}
<div class="grid-2">
${card(
  'CPI inflation, 2015–2024',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.cpi.values, format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`, label: 'Consumer price inflation 2015 to 2024' })}</div>
  <p class="note">Prices were flat or falling from 2015 to 2021, then jumped with the post-pandemic energy and food shock.</p>`,
)}
${card(
  `CPI by category — ${year}`,
  `<div class="year-btns" role="group" aria-label="CPI year">${[2022, 2023, 2024]
    .map((y) => `<button class="btn${y === year ? ' active' : ''}" data-action="cpi-year" data-year="${y}">${y}</button>`)
    .join('')}</div>
  <div class="chart">${barChart({
    labels: CPI_CATEGORIES,
    values: CPI_BY_YEAR[year],
    format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
    color: '#c47f17',
    label: `CPI by category, ${year}`,
  })}</div>
  <p class="note">Food drove ${year} inflation${year === 2022 ? ' alongside a 15.2% jump in energy prices' : year === 2023 ? ' at 7.5%' : ' at 4.2%'}; housing barely moved in all three years.</p>`,
)}
</div>
${card(
  'Food, energy and housing',
  factsTable([
    ['Food, 2024', '+4.2% on the year'],
    ['Energy, 2024', '+3.1% on the year'],
    ['Housing, 2024', '+0.9% on the year'],
    ['CPI excluding fresh food, 2024', '+2.7% on the year'],
  ]) +
    `<p class="note">The GDP deflator — the price of everything Japan produces — rose 3.2% in 2024, its fastest in decades, as import costs fed through.</p>`,
)}`;
}

// ---------------------------------------------------------------- education & health

export function viewEducationHealth(state) {
  const group = state.attainmentGroup;
  const groups = Object.keys(ATTAINMENT);
  return `${sectionHead('Education & health', '84.0 years of life expectancy — among the longest in the world — and over half of working-age adults hold a tertiary degree.')}
<div class="grid-2">
${card(
  'Educational attainment',
  `<div class="year-btns" role="group" aria-label="Age group">${groups
    .map((g) => `<button class="btn${g === group ? ' active' : ''}" data-action="attainment-group" data-group="${esc(g)}">${esc(g)}</button>`)
    .join('')}</div>
  <div class="chart">${barChart({
    labels: ATTAINMENT[group].map((a) => a.level),
    values: ATTAINMENT[group].map((a) => a.share),
    format: pct1,
    color: '#2456a6',
    label: `Educational attainment, ${group}`,
  })}</div>
  <p class="note">Younger cohorts are far more likely to hold a degree: 62% of 25–34 year olds, against 42% of 55–64 year olds.</p>`,
)}
${card(
  'Life expectancy at birth',
  `<div class="chart">${lineChart({ labels: YEARS.map(String), values: SERIES.lifeExpectancy.values, format: (v) => `${v.toFixed(1)}`, label: 'Life expectancy 2015 to 2024' })}</div>
  <p class="note">Life expectancy peaked at 84.6 years in 2020, then eased to 84.0 — still near the top of the world table.</p>`,
)}
</div>
<div class="grid-2">
${card(
  'Health system, 2024',
  factsTable([
    ['Health spending', `${HEALTH.spendingShare.toFixed(1)}% of GDP`],
    ['Hospital beds', `${HEALTH.bedsPer1000} per 1,000 people`],
    ['Physicians', `${HEALTH.physiciansPer1000} per 1,000 people`],
    ['Hospitals', `about ${fmtInt(HEALTH.hospitals)}`],
    ['Clinics', `about ${fmtInt(HEALTH.clinics)}`],
  ]) +
    `<p class="note">Japan has more hospital beds per person than any other large economy, and universal health insurance since 1961.</p>`,
)}
${card(
  'School facts',
  factsTable([
    ['Compulsory schooling', '9 years (ages 6–15)'],
    ['Upper-secondary enrolment', 'about 98%'],
    ['University enrolment', 'about 57% of school leavers'],
    ['Pupils per teacher, primary', 'about 15'],
  ]) +
    `<p class="note">Nearly every child finishes upper-secondary school, and over half go on to university or college.</p>`,
)}
</div>`;
}

// ---------------------------------------------------------------- regions

function gdpPerCapita(r) {
  return Math.round((r.gdp * 1000) / r.population);
}

export function viewRegions(state) {
  const q = (state.regionFilter || '').trim().toLowerCase();
  const sortKey = state.regionSort.key;
  const dir = state.regionSort.dir;
  const cols = [
    ['name', 'Region'],
    ['population', 'Population'],
    ['gdp', 'GDP'],
    ['gdpPerCapita', 'GDP per capita'],
    ['unemployment', 'Unemployment'],
  ];
  const valueOf = (r, key) => (key === 'gdpPerCapita' ? gdpPerCapita(r) : r[key]);
  let rows = REGIONS.filter((r) => !q || r.name.toLowerCase().includes(q) || r.capital.toLowerCase().includes(q));
  rows = [...rows].sort((a, b) => {
    const va = valueOf(a, sortKey);
    const vb = valueOf(b, sortKey);
    if (typeof va === 'string') return dir * va.localeCompare(vb);
    return dir * (va - vb);
  });
  const arrow = dir === 1 ? ' ▲' : ' ▼';
  const body = rows.length
    ? rows
        .map(
          (r) =>
            `<tr data-action="region-row" data-region="${esc(r.name)}" tabindex="0"><td>${esc(r.name)}</td><td class="num">${r.population.toFixed(1)}m</td><td class="num">$${fmtInt(r.gdp)}bn</td><td class="num">$${fmtInt(gdpPerCapita(r))}</td><td class="num">${r.unemployment.toFixed(1)}%</td></tr>`,
        )
        .join('')
    : `<tr><td colspan="5" class="empty">No region matches “${esc(state.regionFilter)}”.</td></tr>`;
  const selected = state.regionSelected ? REGIONS.find((r) => r.name === state.regionSelected) : null;
  const detail = selected
    ? `<aside class="region-detail" aria-live="polite"><h3>${esc(selected.name)}</h3>
      ${factsTable([
        ['Capital', selected.capital],
        ['Population', `${selected.population.toFixed(1)} million`],
        ['GDP', `$${fmtInt(selected.gdp)} billion`],
        ['GDP per capita', `$${fmtInt(gdpPerCapita(selected))}`],
        ['Unemployment', `${selected.unemployment.toFixed(1)}%`],
        ['Land area', `${fmtInt(selected.area)} km²`],
      ])}
      <p>${esc(selected.note)}</p></aside>`
    : `<p class="note">Tap a row to see that region's detail card.</p>`;
  return `${sectionHead('Regions compared', 'Eight regions, one country: Kanto alone holds 44.1 million people — more than a third of Japan.')}
${card(
  'All regions, 2024',
  `<label class="search-label" for="region-filter">Filter regions</label>
  <input id="region-filter" class="search" type="search" placeholder="Try “Kinki” or “Sapporo”…" value="${esc(state.regionFilter || '')}" data-action="region-filter" autocomplete="off">
  <div class="table-scroll"><table class="table sortable"><thead><tr>${cols
    .map(
      ([key, label]) =>
        `<th scope="col" data-action="region-sort" data-key="${key}" class="${key === 'name' ? '' : 'num'}">${esc(label)}${key === sortKey ? arrow : ''}</th>`,
    )
    .join('')}</tr></thead>
  <tbody>${body}</tbody></table></div>
  <p class="note">Click a column header to sort; click again to reverse. Populations sum to 124.0m and GDP to $4,030bn.</p>`,
)}
${detail}`;
}

// ---------------------------------------------------------------- explorer

export function viewExplorer(state) {
  const ex = state.explorer;
  const ind = SERIES[ex.indicator];
  const from = Math.min(ex.from, ex.to);
  const to = Math.max(ex.from, ex.to);
  const years = YEARS.filter((y) => y >= from && y <= to);
  const values = years.map((y) => ind.values[YEARS.indexOf(y)]);
  const chart =
    ex.type === 'bar'
      ? barChart({ labels: years.map(String), values, format: ind.format, color: '#0e7c7b', label: `${ind.label} ${from} to ${to}` })
      : lineChart({ labels: years.map(String), values, format: ind.format, color: '#2456a6', label: `${ind.label} ${from} to ${to}` });
  const rows = years
    .map((y, i) => `<tr><td>${y}</td><td class="num">${esc(ind.format(values[i]))}</td></tr>`)
    .join('');
  const options = Object.entries(SERIES)
    .filter(([key]) => ['population', 'gdp', 'gdpPerCapita', 'unemployment', 'cpi', 'lifeExpectancy'].includes(key))
    .map(([key, s]) => `<option value="${key}"${key === ex.indicator ? ' selected' : ''}>${esc(s.label)} (${esc(s.unit)})</option>`)
    .join('');
  const yearOptions = (sel) => YEARS.map((y) => `<option value="${y}"${y === sel ? ' selected' : ''}>${y}</option>`).join('');
  return `${sectionHead('Data explorer', 'Pick an indicator and a year range — the chart and the table follow.')}
${card(
  'Explore the data',
  `<div class="explorer-controls">
    <label>Indicator
      <select data-action="explorer-indicator">${options}</select>
    </label>
    <label>From
      <select data-action="explorer-from">${yearOptions(ex.from)}</select>
    </label>
    <label>To
      <select data-action="explorer-to">${yearOptions(ex.to)}</select>
    </label>
    <span class="chart-type" role="group" aria-label="Chart type">
      <button class="btn${ex.type === 'line' ? ' active' : ''}" data-action="explorer-type" data-type="line">Line</button>
      <button class="btn${ex.type === 'bar' ? ' active' : ''}" data-action="explorer-type" data-type="bar">Bars</button>
    </span>
    <button class="btn primary" data-action="explorer-csv">Download CSV</button>
  </div>
  <div class="chart">${chart}</div>
  <div class="table-scroll"><table class="table"><thead><tr><th scope="col">Year</th><th scope="col" class="num">${esc(ind.label)} (${esc(ind.unit)})</th></tr></thead>
  <tbody>${rows}</tbody></table></div>
  <p class="note">The CSV downloads straight from this page — no server, no network. Figures are rounded estimates.</p>`,
)}`;
}

// ---------------------------------------------------------------- about

export function viewAbout() {
  return `${sectionHead('About & methods', 'What these figures are, where they come from, and how to read them.')}
${card(
  'What this site is',
  `<p>Japan in Numbers is a single-page statistics site built for the make.fun “best national statistics site” bounty. It covers Japan's population, economy, jobs, prices, education, health and regions for 2015–2024, with a data explorer for the headline series. The whole site is static files: it runs offline in a browser, makes no network requests, and uses no external fonts, images or scripts.</p>`,
)}
${card(
  'Where the figures come from',
  `<p>Headline figures are rounded public estimates in the style of a national statistics bureau's releases and the IMF's World Economic Outlook: total population, nominal GDP, unemployment, consumer prices and life expectancy. Regional figures are rounded so the eight regions sum to the national totals. Figures are labelled as rounded estimates throughout because they are presented to one decimal place or the nearest whole unit, not because they are guesses — the underlying series are the published ones, simplified for a general reader.</p>
  <p>Nothing on this site is copied from any statistics agency's brand, text or images. The design, wording and charts are original.</p>`,
)}
${card(
  'How to read the charts',
  `<ul class="bullets">
    <li>Line charts show the trend over 2015–2024; hover a point for its exact value.</li>
    <li>Bar charts show one value per year or category; a bar below the zero line is a negative value, and its label sits below the bar.</li>
    <li>The donut on the economy page shows GDP by sector; hover or tap a slice for a note about it.</li>
    <li>The pyramid on the population page shows the share of the population in each 5-year age band.</li>
    <li>Every chart is drawn as SVG from the same data file the tables use, so a chart and its table can never disagree.</li>
  </ul>`,
)}
${card(
  'Rounding & updates',
  `<p>Percentages are rounded to one decimal place; where shares are shown they sum to 100 within rounding. Dollar figures are nominal US dollars at the year's average exchange rate, which is why the dollar GDP falls after 2021 even though yen GDP grew. The data run to 2024, the latest full year available when this site was built.</p>
  <p class="fineprint">Figures are rounded estimates. This site is not affiliated with any government or statistics agency.</p>`,
)}`;
}
