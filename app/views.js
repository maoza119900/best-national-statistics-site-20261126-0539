// Japan in Numbers — views.
//
// One render function per hash route. Views are pure functions of the shared
// state (see main.js): they return HTML strings, and main.js wires the
// controls afterwards. Every number comes from JIN (data.js) and every chart
// from JINCharts (charts.js).

(function () {
  'use strict';

  var D = window.JIN;
  var C = window.JINCharts;

  function esc(s) { return C.esc(s); }

  function card(title, body, extra) {
    return '<section class="card' + (extra ? ' ' + extra : '') + '"><h2>' + esc(title) + '</h2>' + body + '</section>';
  }

  function kpi(value, label, sub, route) {
    return '<a class="kpi" href="' + route + '"><span class="kpi-value">' + esc(value) + '</span>' +
      '<span class="kpi-label">' + esc(label) + '</span>' +
      '<span class="kpi-sub">' + esc(sub) + '</span></a>';
  }

  function pageHead(title, intro) {
    return '<header class="page-head"><h1>' + esc(title) + '</h1><p>' + esc(intro) + '</p></header>';
  }

  function yearButtons(action, years, current) {
    return '<div class="btn-row" role="group" aria-label="Choose a year">' +
      years.map(function (y) {
        return '<button type="button" data-action="' + action + '" data-year="' + y + '"' +
          (y === current ? ' class="active" aria-pressed="true"' : '') + '>' + y + '</button>';
      }).join('') + '</div>';
  }

  // ---- Overview -----------------------------------------------------------

  function overview(state) {
    var pop = D.SERIES.population.values;
    var gdp = D.SERIES.gdp.values;
    var finderItems = D.INDICATORS.map(function (ind) {
      return '<li><a href="' + ind.route + '"><span>' + esc(ind.name) + '</span><strong>' + esc(ind.value) + '</strong></a></li>';
    }).join('');
    var releases = D.RELEASES.map(function (r) {
      return '<li><a href="' + r.route + '"><span class="rel-date">' + esc(r.date) + '</span><span>' + esc(r.title) + '</span></a></li>';
    }).join('');
    return pageHead('Japan in Numbers', 'Headline statistics for Japan, 2015–2024. Every figure is a rounded public estimate — explore the sections, sort the regions, or build your own chart in the data explorer.') +
      '<div class="kpi-grid">' +
      kpi('124.0m', 'Population', '2024 · down from 127.1m in 2015', '#/population') +
      kpi('$4.03tn', 'GDP, nominal', '2024 · $32,500 per person', '#/economy') +
      kpi('2.5%', 'Unemployment', '2024 · labour force 69.3m', '#/jobs') +
      kpi('+2.7%', 'Consumer prices', 'CPI, 2024 year on year', '#/prices') +
      kpi('84.0 years', 'Life expectancy', 'Men 81.1 · women 87.1', '#/education-health') +
      kpi('29.6%', 'Aged 65 and over', 'The oldest large population on earth', '#/population') +
      '</div>' +
      '<div class="grid-2">' +
      card('Population, 2015–2024', C.lineChart({ labels: D.YEARS, values: pop, title: 'Population trend', decimals: 1, suffix: 'm' }) + '<p class="note">Population has fallen every year since 2015 — about 3.1 million fewer people in a decade.</p>') +
      card('GDP, nominal, 2015–2024', C.lineChart({ labels: D.YEARS, values: gdp, title: 'GDP trend', decimals: 2, suffix: 'tn', color: C.colors.teal }) + '<p class="note">Nominal GDP in dollars moves with the yen; in yen terms the economy kept growing most years.</p>') +
      '</div>' +
      '<div class="grid-2">' +
      card('Latest releases', '<ul class="releases">' + releases + '</ul>') +
      card('Key facts', '<ul class="facts">' +
        '<li><strong>35.4%</strong> of the country lives in Kanto, the region around Tokyo.</li>' +
        '<li><strong>91.8%</strong> of people live in urban areas.</li>' +
        '<li><strong>69.3 million</strong> people are in the labour force; 67.6 million are employed.</li>' +
        '<li><strong>0.72 million</strong> babies were born in 2024; 1.62 million people died.</li>' +
        '</ul>') +
      '</div>' +
      card('Indicator finder', '<p class="note">Type to filter — every indicator links to its section.</p>' +
        '<label class="finder-label" for="finder">Search indicators</label>' +
        '<input id="finder" class="finder" type="search" placeholder="Try “unemployment”, “births” or “exports”… " autocomplete="off">' +
        '<ul class="finder-list" id="finder-list">' + finderItems + '</ul>');
  }

  // ---- Population ---------------------------------------------------------

  function population(state) {
    var year = state.pyramidYear;
    var shares = D.AGE_SHARES[year];
    var pyr = D.PYRAMID[year];
    var vital = D.VITAL[year];
    var natural = (vital.births - vital.deaths).toFixed(2);
    var prefRows = D.PREFECTURES.map(function (p) {
      return '<tr><td>' + esc(p.name) + '</td><td class="num">' + p.pop.toFixed(1) + 'm</td><td class="num">' + (p.pop / 124.0 * 100).toFixed(1) + '%</td></tr>';
    }).join('');
    var vitalRows = Object.keys(D.VITAL).map(function (y) {
      var v = D.VITAL[y];
      return '<tr><td>' + y + '</td><td class="num">' + v.births.toFixed(2) + 'm</td><td class="num">' + v.deaths.toFixed(2) + 'm</td><td class="num">' + (v.births - v.deaths).toFixed(2) + 'm</td></tr>';
    }).join('');
    return pageHead('Population', '124.0 million people in 2024, falling by roughly 0.5% a year. The age pyramid shows why: fewer children at the bottom, more retirees at the top.') +
      '<div class="grid-2">' +
      card('Total population, 2015–2024', C.lineChart({ labels: D.YEARS, values: D.SERIES.population.values, title: 'Population trend', decimals: 1, suffix: 'm' }) + '<p class="note">From 127.1m in 2015 to 124.0m in 2024 — a fall of 3.1 million.</p>') +
      card('Where people live', '<div class="stat-pair"><div><span class="big">91.8%</span><span class="cap">urban</span></div><div><span class="big">8.2%</span><span class="cap">rural</span></div></div><p class="note">Most of the country lives in a handful of coastal metropolitan areas; the countryside keeps emptying.</p>') +
      '</div>' +
      card('Age structure in ' + year, yearButtons('pyramid-year', [2015, 2020, 2024], year) +
        '<div class="grid-2">' +
        '<div>' + C.pyramidChart({ bands: D.PYRAMID_BANDS, men: pyr.men, women: pyr.women, title: 'Population pyramid ' + year }) + '</div>' +
        '<div>' + C.hbarChart({ title: 'Age-group shares ' + year, rows: [
          { name: 'Aged 0–14', value: shares.young },
          { name: 'Aged 15–64', value: shares.working },
          { name: 'Aged 65+', value: shares.older },
        ], suffix: '%' }) + '<p class="note">The three shares add to 100%. In ' + year + ', ' + shares.older.toFixed(1) + '% of the population was 65 or older.</p></div>' +
        '</div>') +
      '<div class="grid-2">' +
      card('Births and deaths', '<table class="tbl"><thead><tr><th>Year</th><th class="num">Births</th><th class="num">Deaths</th><th class="num">Natural change</th></tr></thead><tbody>' + vitalRows + '</tbody></table><p class="note">In ' + year + ': ' + vital.births.toFixed(2) + 'm births, ' + vital.deaths.toFixed(2) + 'm deaths — a natural fall of ' + Math.abs(natural) + 'm people.</p>') +
      card('Largest prefectures, 2024', '<table class="tbl"><thead><tr><th>Prefecture</th><th class="num">Population</th><th class="num">Share</th></tr></thead><tbody>' + prefRows + '</tbody></table><p class="note">Tokyo alone holds 14.1 million people — more than one in nine.</p>') +
      '</div>';
  }

  // ---- Economy ------------------------------------------------------------

  function economy(state) {
    var year = state.tradeYear;
    var t = D.TRADE[year];
    var balance = t.exports - t.imports;
    var sector = D.GDP_SECTORS[state.sectorIndex];
    var legend = D.GDP_SECTORS.map(function (s, i) {
      return '<li><button type="button" data-action="sector-pick" data-sector="' + i + '"' + (i === state.sectorIndex ? ' class="active"' : '') + '><span class="dot" style="background:' + ['#2563eb', '#0d9488', '#d97706', '#e11d48', '#7c3aed'][i] + '"></span>' + esc(s.name) + ' — ' + s.share.toFixed(1) + '%</button></li>';
    }).join('');
    var indRows = D.INDUSTRIES.map(function (ind) {
      return '<tr><td>' + esc(ind.name) + '</td><td class="num">$' + ind.output + 'bn</td><td class="num">' + ind.share.toFixed(1) + '%</td></tr>';
    }).join('');
    return pageHead('Economy', 'The world’s fourth-largest economy by nominal GDP: $4.03 trillion in 2024, built on manufacturing exports and a very large services sector.') +
      '<div class="grid-2">' +
      card('GDP, nominal, 2015–2024', C.lineChart({ labels: D.YEARS, values: D.SERIES.gdp.values, title: 'GDP trend', decimals: 2, suffix: 'tn', color: C.colors.teal }) + '<p class="note">The dollar figure fell in 2022–2024 as the yen weakened, even as yen GDP rose.</p>') +
      card('Real GDP growth, % per year', C.barChart({ labels: D.YEARS, values: D.SERIES.realGrowth.values, title: 'Real GDP growth', decimals: 1, suffix: '%' }) + '<p class="note">The pandemic year, 2020, took growth to −4.2%; 2024 was slightly negative at −0.1%.</p>') +
      '</div>' +
      card('GDP by sector, 2024', '<div class="donut-wrap"><div class="donut">' + C.donutChart({ rows: D.GDP_SECTORS, title: 'GDP by sector' }) + '</div><ul class="legend">' + legend + '</ul></div><p class="note" id="sector-note"><strong>' + esc(sector.name) + ' — ' + sector.share.toFixed(1) + '% of GDP.</strong> ' + esc(sector.note) + '</p>') +
      '<div class="grid-2">' +
      card('Trade in goods, ' + year, yearButtons('trade-year', [2022, 2023, 2024], year) +
        '<div class="stat-trio"><div><span class="big">$' + t.exports + 'bn</span><span class="cap">exports</span></div><div><span class="big">$' + t.imports + 'bn</span><span class="cap">imports</span></div><div><span class="big">' + (balance < 0 ? '−$' + Math.abs(balance) + 'bn' : '$' + balance + 'bn') + '</span><span class="cap">balance</span></div></div>' +
        '<p class="note">Japan has run a goods deficit since 2022, driven by energy imports priced in a weak yen.</p>') +
      card('Top industries by output, 2024', '<table class="tbl"><thead><tr><th>Industry</th><th class="num">Output</th><th class="num">Share of GDP</th></tr></thead><tbody>' + indRows + '</tbody></table><p class="note">Cars alone are worth about $520bn — nearly 13% of GDP.</p>') +
      '</div>';
  }

  // ---- Jobs ---------------------------------------------------------------

  function jobs(state) {
    var tab = state.jobsTab;
    var rows = D.EMPLOYMENT_SECTORS[tab];
    var tabBtns = [['all', 'All workers'], ['men', 'Men'], ['women', 'Women']].map(function (pair) {
      return '<button type="button" data-action="jobs-tab" data-tab="' + pair[0] + '"' + (tab === pair[0] ? ' class="active" aria-pressed="true"' : '') + '>' + pair[1] + '</button>';
    }).join('');
    var wageRows = D.WAGES.map(function (w) {
      return '<tr><td>' + esc(w.industry) + '</td><td class="num">¥' + w.wage + ',000</td></tr>';
    }).join('');
    return pageHead('Employment & income', '69.3 million people in the labour force, 2.5% unemployed — one of the lowest rates among large economies — and a services sector that employs nearly three in four workers.') +
      '<div class="grid-2">' +
      card('Unemployment rate, 2015–2024', C.lineChart({ labels: D.YEARS, values: D.SERIES.unemployment.values, title: 'Unemployment trend', decimals: 1, suffix: '%' }) + '<p class="note">Unemployment has stayed between 2.4% and 3.4% for the whole decade.</p>') +
      card('Labour force at a glance', '<div class="stat-trio"><div><span class="big">69.3m</span><span class="cap">labour force</span></div><div><span class="big">67.6m</span><span class="cap">employed</span></div><div><span class="big">63.1%</span><span class="cap">participation, age 15+</span></div></div><p class="note">Women’s participation has risen steadily; the 25–54 age groups are near 90%.</p>') +
      '</div>' +
      '<div class="grid-2">' +
      card('Employment by sector', '<div class="btn-row" role="group" aria-label="Choose a group">' + tabBtns + '</div>' +
        C.hbarChart({ title: 'Employment by sector', rows: rows.map(function (r) { return { name: r.name, value: r.share }; }), suffix: '%' }) +
        '<p class="note">Services employ 72.5% of all workers — 82.9% of working women, 63.3% of working men.</p>') +
      card('Participation by age group, 2024', C.hbarChart({ title: 'Participation by age', rows: D.PARTICIPATION.map(function (p) { return { name: 'Age ' + p.group, value: p.rate }; }), suffix: '%' }) + '<p class="note">Participation peaks at 88.9% for ages 45–54; one in four people over 65 still works.</p>') +
      '</div>' +
      card('Average monthly wage by industry, 2024', '<table class="tbl"><thead><tr><th>Industry</th><th class="num">Monthly wage</th></tr></thead><tbody>' + wageRows + '</tbody></table><p class="note">Finance pays about two and a half times hospitality — ¥548,000 against ¥214,000 a month.</p>');
  }

  // ---- Prices -------------------------------------------------------------

  function prices(state) {
    var year = state.cpiYear;
    var rows = D.CPI_CATEGORIES[year];
    return pageHead('Prices & inflation', 'Consumer prices rose 2.7% in 2024 — high for Japan, after decades near zero. Food led the rise; energy fell back after the 2022 spike.') +
      '<div class="grid-2">' +
      card('Consumer prices (CPI), 2015–2024', C.lineChart({ labels: D.YEARS, values: D.SERIES.cpi.values, title: 'CPI trend', decimals: 1, suffix: '%', color: C.colors.amber }) + '<p class="note">Inflation was near zero until 2021, then jumped to 2.5% in 2022 and 3.3% in 2023.</p>') +
      card('What rose most in 2024', '<div class="stat-trio"><div><span class="big">+4.4%</span><span class="cap">food</span></div><div><span class="big">−1.8%</span><span class="cap">energy</span></div><div><span class="big">+0.9%</span><span class="cap">housing</span></div></div><p class="note">Food is the category households feel most: it has risen every year since 2022.</p>') +
      '</div>' +
      card('CPI by category, % change', yearButtons('cpi-year', [2022, 2023, 2024], year) +
        C.hbarChart({ title: 'CPI by category ' + year, rows: rows.map(function (r) { return { name: r.name, value: r.value }; }), suffix: '%' }) +
        '<p class="note">In ' + year + ', ' + (rows[0].value >= 0 ? rows[0].name + ' rose fastest at +' + rows[0].value.toFixed(1) + '%' : rows[0].name + ' fell ' + rows[0].value.toFixed(1) + '%') + '. Energy swung from +15.6% in 2022 to −1.8% in 2024.</p>') +
      card('Reading the numbers', '<ul class="facts">' +
        '<li><strong>GDP deflator +2.9% in 2024</strong> — the broadest price measure, covering everything produced at home.</li>' +
        '<li><strong>Core CPI</strong> (excluding fresh food) also rose 2.7% in 2024, so the rise is broad, not just food.</li>' +
        '<li><strong>Cash wages</strong> rose about 2.8% in 2024, roughly keeping pace with prices for the first time in years.</li>' +
        '</ul>');
  }

  // ---- Education & health -------------------------------------------------

  function eduHealth(state) {
    var mode = state.eduMode;
    var modeBtns = [['age', 'By age group'], ['levels', 'Highest attainment']].map(function (pair) {
      return '<button type="button" data-action="edu-mode" data-mode="' + pair[0] + '"' + (mode === pair[0] ? ' class="active" aria-pressed="true"' : '') + '>' + pair[1] + '</button>';
    }).join('');
    var chart = mode === 'age'
      ? C.hbarChart({ title: 'Tertiary attainment by age', rows: D.EDUCATION.tertiaryByAge.map(function (r) { return { name: 'Age ' + r.group, value: r.rate }; }), suffix: '%' })
      : C.hbarChart({ title: 'Highest attainment, age 25–64', rows: D.EDUCATION.attainment.map(function (r) { return { name: r.level, value: r.share }; }), suffix: '%' });
    var chartNote = mode === 'age'
      ? 'Younger generations are far more likely to hold a degree: 65% of 25–34 year olds, against 45% of 55–64 year olds.'
      : 'More than half of working-age adults hold a tertiary qualification; only 5% left school before upper secondary.';
    return pageHead('Education & health', '84.0 years of life expectancy — among the longest in the world — and a school system that keeps almost everyone in education through upper secondary.') +
      '<div class="grid-2">' +
      card('Life expectancy, 2015–2024', C.lineChart({ labels: D.YEARS, values: D.SERIES.lifeExpectancy.values, title: 'Life expectancy trend', decimals: 1, suffix: ' yrs', color: C.colors.green }) + '<p class="note">Life expectancy peaked around 2020 and has eased slightly since.</p>') +
      card('Health system, 2024', '<div class="stat-trio"><div><span class="big">11.4%</span><span class="cap">of GDP on health</span></div><div><span class="big">12.6</span><span class="cap">hospital beds per 1,000</span></div><div><span class="big">2.7</span><span class="cap">physicians per 1,000</span></div></div><p class="note">Men live 81.1 years on average, women 87.1 — a gap of six years. There are 12.5 nurses per 1,000 people.</p>') +
      '</div>' +
      card('Education: who holds a degree', '<div class="btn-row" role="group" aria-label="Choose a view">' + modeBtns + '</div>' + chart + '<p class="note">' + chartNote + '</p>') +
      card('School facts', '<ul class="facts">' +
        '<li><strong>9 years</strong> of compulsory schooling; upper secondary enrolment is near universal.</li>' +
        '<li><strong>About 810 universities</strong> and 2.9 million students.</li>' +
        '<li><strong>Adult literacy near 99%</strong>, by the usual rounded estimates.</li>' +
        '<li><strong>95%</strong> of 25–64 year olds completed at least upper secondary education.</li>' +
        '</ul>');
  }

  // ---- Regions ------------------------------------------------------------

  function regionRows(state) {
    var q = state.regionFilter.trim().toLowerCase();
    var rows = D.REGIONS.slice();
    if (q) rows = rows.filter(function (r) { return r.name.toLowerCase().indexOf(q) !== -1 || r.capital.toLowerCase().indexOf(q) !== -1; });
    var key = state.regionSort.key;
    var dir = state.regionSort.dir;
    rows.sort(function (a, b) {
      var av = key === 'gdpPerCapita' ? D.gdpPerCapita(a) : a[key];
      var bv = key === 'gdpPerCapita' ? D.gdpPerCapita(b) : b[key];
      if (typeof av === 'string') return dir * av.localeCompare(bv);
      return dir * (av - bv);
    });
    if (!rows.length) return '<tr><td colspan="5">No region matches “' + esc(state.regionFilter) + '”.</td></tr>';
    return rows.map(function (r) {
      return '<tr data-action="region-row" data-name="' + esc(r.name) + '" tabindex="0"><td>' + esc(r.name) + '</td><td class="num">' + r.pop.toFixed(1) + 'm</td><td class="num opt">$' + r.gdp.toLocaleString('en-US') + 'bn</td><td class="num">$' + D.gdpPerCapita(r).toLocaleString('en-US') + '</td><td class="num">' + r.unemp.toFixed(1) + '%</td></tr>';
    }).join('');
  }

  function regionDetail(state) {
    var r = D.REGIONS.filter(function (x) { return x.name === state.regionSelected; })[0] || D.REGIONS[0];
    return '<h3>' + esc(r.name) + ' — ' + esc(r.capital) + '</h3>' +
      '<div class="stat-trio"><div><span class="big">' + r.pop.toFixed(1) + 'm</span><span class="cap">people · ' + (r.pop / 124.0 * 100).toFixed(1) + '% of Japan</span></div>' +
      '<div><span class="big">$' + r.gdp.toLocaleString('en-US') + 'bn</span><span class="cap">GDP · $' + D.gdpPerCapita(r).toLocaleString('en-US') + ' per person</span></div>' +
      '<div><span class="big">' + r.unemp.toFixed(1) + '%</span><span class="cap">unemployment</span></div></div>' +
      '<p class="note">' + esc(r.note) + '</p>';
  }

  function regions(state) {
    function th(label, key) {
      var arrow = state.regionSort.key === key ? (state.regionSort.dir === 1 ? ' ▲' : ' ▼') : '';
      var cls = key === 'gdp' ? ' class="opt"' : '';
      return '<th data-action="region-sort" data-key="' + key + '" tabindex="0"' + cls + '>' + label + arrow + '</th>';
    }
    return pageHead('Regions compared', 'Eight regions, from Hokkaido in the north to Kyushu and Okinawa in the south. Click a column header to sort, type to filter, click a row for the region’s detail.') +
      card('All regions, 2024', '<label class="finder-label" for="region-filter">Filter regions</label>' +
        '<input id="region-filter" class="finder" type="search" placeholder="Try “Osaka”, “north” or “Kanto”… " autocomplete="off" value="' + esc(state.regionFilter) + '">' +
        '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + th('Region', 'name') + th('Pop.', 'pop') + th('GDP', 'gdp') + th('GDP per capita', 'gdpPerCapita') + th('Unemp. %', 'unemp') + '</tr></thead>' +
        '<tbody id="region-body">' + regionRows(state) + '</tbody>' +
        '<tfoot><tr><td><strong>Japan</strong></td><td class="num"><strong>124.0m</strong></td><td class="num opt"><strong>$4,030bn</strong></td><td class="num"><strong>$32,500</strong></td><td class="num"><strong>2.5%</strong></td></tr></tfoot></table></div>' +
        '<p class="note">Populations add to 124.0 million and regional GDP to $4,030 billion — the national totals.</p>') +
      '<div class="card" id="region-detail">' + regionDetail(state) + '</div>';
  }

  // ---- Explorer -----------------------------------------------------------

  function explorerOptions(selected) {
    return Object.keys(D.SERIES).filter(function (k) { return k !== 'realGrowth'; }).map(function (k) {
      return '<option value="' + k + '"' + (k === selected ? ' selected' : '') + '>' + esc(D.SERIES[k].label) + ' (' + esc(D.SERIES[k].unit) + ')</option>';
    }).join('');
  }

  function yearOptions(selected) {
    return D.YEARS.map(function (y) {
      return '<option value="' + y + '"' + (y === selected ? ' selected' : '') + '>' + y + '</option>';
    }).join('');
  }

  function explorerPanel(state) {
    var key = state.exIndicator;
    var s = D.SERIES[key];
    var from = Math.min(state.exFrom, state.exTo);
    var to = Math.max(state.exFrom, state.exTo);
    var idx = D.YEARS.map(function (y, i) { return { y: y, v: s.values[i] }; }).filter(function (p) { return p.y >= from && p.y <= to; });
    var labels = idx.map(function (p) { return String(p.y); });
    var values = idx.map(function (p) { return p.v; });
    var chart = state.exType === 'bar'
      ? C.barChart({ labels: labels, values: values, title: s.label, decimals: s.format === 'dollars' ? 0 : 1 })
      : C.lineChart({ labels: labels, values: values, title: s.label, decimals: s.format === 'dollars' ? 0 : 1 });
    var tableRows = idx.map(function (p) {
      return '<tr><td>' + p.y + '</td><td class="num">' + D.fmt(p.v, s.format) + '</td></tr>';
    }).join('');
    return '<div class="chart-box">' + chart + '</div>' +
      '<table class="tbl"><thead><tr><th>Year</th><th class="num">' + esc(s.label) + ' (' + esc(s.unit) + ')</th></tr></thead><tbody>' + tableRows + '</tbody></table>';
  }

  function explorer(state) {
    return pageHead('Data explorer', 'Pick an indicator, a year range and a chart type — the chart and the table follow. Download the table as CSV for your own work.') +
      card('Build your chart', '<div class="ex-controls">' +
        '<label>Indicator <select id="ex-indicator">' + explorerOptions(state.exIndicator) + '</select></label>' +
        '<label>From <select id="ex-from">' + yearOptions(state.exFrom) + '</select></label>' +
        '<label>To <select id="ex-to">' + yearOptions(state.exTo) + '</select></label>' +
        '<span class="btn-row" role="group" aria-label="Chart type">' +
        '<button type="button" data-action="ex-type" data-type="line"' + (state.exType === 'line' ? ' class="active" aria-pressed="true"' : '') + '>Line</button>' +
        '<button type="button" data-action="ex-type" data-type="bar"' + (state.exType === 'bar' ? ' class="active" aria-pressed="true"' : '') + '>Bars</button>' +
        '</span>' +
        '<button type="button" class="primary" data-action="ex-csv">Download CSV</button>' +
        '</div><div id="ex-panel">' + explorerPanel(state) + '</div>');
  }

  // ---- About --------------------------------------------------------------

  function about() {
    return pageHead('About & methods', 'What this site is, where its numbers come from, and how to read them.') +
      card('What the figures are', '<p>All figures on this site are <strong>rounded public estimates</strong> for Japan, 2015–2024, in the style of a national statistics office’s headline releases. They are labelled as estimates wherever they appear, and they are cross-checked for internal consistency: age shares add to 100, regional populations add to the national total, and regional GDP adds to national GDP.</p>' +
        '<p>Nothing here is copied from any real statistics agency’s brand, text or images. The design, the wording and the charts are original to this site.</p>') +
      card('Sources, described generically', '<ul class="facts">' +
        '<li>National statistical office releases: population estimates, the labour force survey and the consumer price index.</li>' +
        '<li>National accounts: GDP, growth and the GDP deflator.</li>' +
        '<li>Education and health ministries: attainment, life expectancy, beds and physicians.</li>' +
        '<li>International estimates where a series is published with a lag, rounded to the precision shown.</li>' +
        '</ul>') +
      card('How to read the charts', '<ul class="facts">' +
        '<li><strong>Line charts</strong> show a series over 2015–2024; the last value is labelled at the end of the line.</li>' +
        '<li><strong>Bar charts</strong> show one value per year or per category; negative bars grow below the zero line.</li>' +
        '<li><strong>The donut</strong> shows GDP by sector — hover or tap a slice to read its note.</li>' +
        '<li><strong>The pyramid</strong> shows men on the left and women on the right, as a share of the whole population.</li>' +
        '<li><strong>Tables</strong> sort when you click a column header; the regions table also filters as you type.</li>' +
        '</ul>') +
      card('Update note', '<p>Figures cover 2015–2024 and were last reviewed in ' + esc(D.LAST_REVIEWED) + '. New releases are added as they arrive; the “latest releases” list on the overview always names the newest ones.</p><p><a href="#/">Back to the overview</a></p>');
  }

  window.JINViews = {
    overview: overview,
    population: population,
    economy: economy,
    jobs: jobs,
    prices: prices,
    eduHealth: eduHealth,
    regions: regions,
    regionRows: regionRows,
    regionDetail: regionDetail,
    explorer: explorer,
    explorerPanel: explorerPanel,
    about: about,
  };
})();
