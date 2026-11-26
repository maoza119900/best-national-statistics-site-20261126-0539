// Japan in Numbers — data layer.
//
// Every figure is a rounded public estimate for 2015-2024, in the site's own
// words. The numbers are cross-checked inside this file: the three age shares
// add to 100 in each pyramid year, the eight regions add to the national
// population (124.0m) and to national GDP ($4.03tn), and every share column
// adds to 100. Nothing here is fetched: the whole site reads from this file.

(function () {
  'use strict';

  var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  // Headline series, one value per year in YEARS.
  var SERIES = {
    population: {
      label: 'Population',
      unit: 'million people',
      format: 'people',
      values: [127.1, 126.9, 126.7, 126.4, 126.2, 125.9, 125.5, 125.1, 124.6, 124.0],
    },
    gdp: {
      label: 'GDP, nominal',
      unit: 'US$ trillion',
      format: 'money',
      values: [4.38, 4.93, 4.86, 4.95, 5.08, 5.04, 5.03, 4.26, 4.21, 4.03],
    },
    gdpPerCapita: {
      label: 'GDP per capita',
      unit: 'US$',
      format: 'dollars',
      values: [34500, 38800, 38300, 39100, 40200, 40000, 39900, 34000, 33800, 32500],
    },
    unemployment: {
      label: 'Unemployment rate',
      unit: '% of labour force',
      format: 'percent',
      values: [3.4, 3.1, 2.8, 2.4, 2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    },
    cpi: {
      label: 'Consumer prices (CPI)',
      unit: '% change, year on year',
      format: 'percent',
      values: [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
    },
    lifeExpectancy: {
      label: 'Life expectancy at birth',
      unit: 'years',
      format: 'years',
      values: [83.9, 84.0, 84.1, 84.2, 84.3, 84.4, 84.3, 84.2, 84.1, 84.0],
    },
    realGrowth: {
      label: 'Real GDP growth',
      unit: '% change, year on year',
      format: 'percent',
      values: [1.6, 0.8, 1.7, 0.6, -0.4, -4.2, 2.6, 0.9, 1.7, -0.1],
    },
  };

  // Age structure. Each year's three shares add to 100. The pyramid bands
  // below are built from the same shares, so the two views always agree.
  var AGE_SHARES = {
    2015: { young: 12.6, working: 60.7, older: 26.7 },
    2020: { young: 11.9, working: 59.5, older: 28.6 },
    2024: { young: 11.4, working: 59.0, older: 29.6 },
  };

  // Population pyramid: share of the total population in each five-year band,
  // men on the left, women on the right. Bands sum to 100 in each year, and
  // the 0-14 / 15-64 / 65+ groups match AGE_SHARES above.
  var PYRAMID_BANDS = [
    '0–4', '5–9', '10–14', '15–19', '20–24', '25–29', '30–34', '35–39',
    '40–44', '45–49', '50–54', '55–59', '60–64', '65–69', '70–74', '75–79',
    '80–84', '85+',
  ];
  var PYRAMID = {
    2015: {
      men: [2.1, 2.1, 2.2, 2.5, 2.7, 2.9, 3.1, 3.2, 3.3, 3.3, 3.2, 3.1, 3.1, 3.4, 3.0, 2.5, 1.8, 1.5],
      women: [2.0, 2.1, 2.1, 2.5, 2.7, 2.9, 3.0, 3.1, 3.3, 3.2, 3.2, 3.2, 3.2, 3.5, 3.2, 2.9, 2.4, 2.5],
    },
    2020: {
      men: [2.0, 2.0, 2.0, 2.4, 2.6, 2.8, 3.0, 3.1, 3.2, 3.3, 3.2, 3.2, 3.1, 3.3, 3.1, 2.6, 2.0, 1.9],
      women: [1.9, 2.0, 2.0, 2.3, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.2, 3.2, 3.5, 3.3, 3.0, 2.6, 3.3],
    },
    2024: {
      men: [1.9, 1.9, 2.0, 2.2, 2.5, 2.8, 2.8, 3.0, 3.2, 3.3, 3.4, 3.2, 3.1, 3.2, 3.1, 2.7, 2.1, 2.3],
      women: [1.8, 1.9, 1.9, 2.2, 2.4, 2.7, 2.8, 3.0, 3.2, 3.3, 3.4, 3.3, 3.2, 3.4, 3.3, 3.1, 2.7, 3.7],
    },
  };

  // Births and deaths, millions per year.
  var VITAL = {
    2015: { births: 1.01, deaths: 1.29 },
    2020: { births: 0.84, deaths: 1.38 },
    2024: { births: 0.72, deaths: 1.62 },
  };

  // GDP by sector, % of GDP, 2024. Adds to 100.
  var GDP_SECTORS = [
    { name: 'Services', share: 71.6, note: 'Retail, finance, health, education and other services dominate the economy.' },
    { name: 'Manufacturing', share: 20.4, note: 'Cars, electronics and machinery are the export engine.' },
    { name: 'Construction', share: 5.4, note: 'Housing and public works, steady after the 2010s rebuilding.' },
    { name: 'Other industry', share: 1.5, note: 'Mining, utilities and water supply.' },
    { name: 'Agriculture, forestry & fisheries', share: 1.1, note: 'Small in GDP, large in land use and food culture.' },
  ];

  // Trade in goods, US$ billion.
  var TRADE = {
    2022: { exports: 746, imports: 941 },
    2023: { exports: 717, imports: 832 },
    2024: { exports: 726, imports: 816 },
  };

  // Largest industries by output, 2024. Shares are of nominal GDP ($4.03tn).
  var INDUSTRIES = [
    { name: 'Automotive', output: 520, share: 12.9 },
    { name: 'Electronics', output: 380, share: 9.4 },
    { name: 'Machinery', output: 340, share: 8.4 },
    { name: 'Chemicals', output: 290, share: 7.2 },
    { name: 'Food & beverages', output: 260, share: 6.5 },
    { name: 'Steel & metals', output: 180, share: 4.5 },
  ];

  // Employment by sector, % of all employed. Each column adds to 100.
  var EMPLOYMENT_SECTORS = {
    all: [
      { name: 'Primary (agriculture, forestry, fisheries)', share: 3.1 },
      { name: 'Secondary (manufacturing, construction)', share: 24.4 },
      { name: 'Tertiary (services)', share: 72.5 },
    ],
    men: [
      { name: 'Primary (agriculture, forestry, fisheries)', share: 3.6 },
      { name: 'Secondary (manufacturing, construction)', share: 33.1 },
      { name: 'Tertiary (services)', share: 63.3 },
    ],
    women: [
      { name: 'Primary (agriculture, forestry, fisheries)', share: 2.5 },
      { name: 'Secondary (manufacturing, construction)', share: 14.6 },
      { name: 'Tertiary (services)', share: 82.9 },
    ],
  };

  // Average monthly wage by industry, thousand yen, 2024.
  var WAGES = [
    { industry: 'Finance & insurance', wage: 548 },
    { industry: 'Information & communications', wage: 512 },
    { industry: 'Construction', wage: 396 },
    { industry: 'Education', wage: 378 },
    { industry: 'Manufacturing', wage: 352 },
    { industry: 'All industries', wage: 348 },
    { industry: 'Transport & postal services', wage: 342 },
    { industry: 'Wholesale & retail', wage: 318 },
    { industry: 'Health & welfare', wage: 296 },
    { industry: 'Accommodation & food services', wage: 214 },
  ];

  // Labour-force participation by age group, %, 2024.
  var PARTICIPATION = [
    { group: '15–24', rate: 47.8 },
    { group: '25–34', rate: 88.4 },
    { group: '35–44', rate: 87.6 },
    { group: '45–54', rate: 88.9 },
    { group: '55–64', rate: 78.2 },
    { group: '65+', rate: 25.6 },
  ];

  // CPI by category, % change year on year.
  var CPI_CATEGORIES = {
    2022: [
      { name: 'Energy', value: 15.6 },
      { name: 'Food', value: 4.5 },
      { name: 'Transport', value: 2.1 },
      { name: 'Recreation', value: 1.8 },
      { name: 'Clothing', value: 1.4 },
      { name: 'Education', value: 0.9 },
      { name: 'Housing', value: 0.8 },
      { name: 'Health', value: 0.6 },
    ],
    2023: [
      { name: 'Food', value: 8.1 },
      { name: 'Clothing', value: 2.9 },
      { name: 'Recreation', value: 2.7 },
      { name: 'Transport', value: 2.6 },
      { name: 'Energy', value: 2.4 },
      { name: 'Education', value: 1.2 },
      { name: 'Housing', value: 1.1 },
      { name: 'Health', value: 1.0 },
    ],
    2024: [
      { name: 'Food', value: 4.4 },
      { name: 'Clothing', value: 2.4 },
      { name: 'Recreation', value: 2.1 },
      { name: 'Transport', value: 1.6 },
      { name: 'Education', value: 1.2 },
      { name: 'Housing', value: 0.9 },
      { name: 'Health', value: 0.8 },
      { name: 'Energy', value: -1.8 },
    ],
  };

  // Education and health, 2024 unless stated.
  var EDUCATION = {
    tertiaryByAge: [
      { group: '25–34', rate: 65 },
      { group: '35–44', rate: 58 },
      { group: '45–54', rate: 52 },
      { group: '55–64', rate: 45 },
    ],
    attainment: [
      { level: 'Below upper secondary', share: 5 },
      { level: 'Upper secondary', share: 40 },
      { level: 'Tertiary', share: 55 },
    ],
  };
  var HEALTH = {
    lifeMen: 81.1,
    lifeWomen: 87.1,
    spendingGdp: 11.4,
    bedsPer1000: 12.6,
    physiciansPer1000: 2.7,
    nursesPer1000: 12.5,
  };

  // The eight regions. Populations add to 124.0m and GDP to $4,030bn.
  var REGIONS = [
    { name: 'Kanto', pop: 43.9, gdp: 1560, unemp: 2.6, capital: 'Tokyo', note: 'The Tokyo metropolitan area holds over a third of the country.' },
    { name: 'Chubu', pop: 21.1, gdp: 680, unemp: 2.2, capital: 'Nagoya', note: 'Manufacturing heartland around Aichi and the Chukyo area.' },
    { name: 'Kansai', pop: 20.4, gdp: 645, unemp: 2.8, capital: 'Osaka', note: 'Osaka, Kyoto and Kobe: commerce, culture and biotech.' },
    { name: 'Kyushu & Okinawa', pop: 14.3, gdp: 430, unemp: 3.0, capital: 'Fukuoka', note: 'Semiconductors, cars and agriculture in the south.' },
    { name: 'Tohoku', pop: 8.5, gdp: 255, unemp: 2.9, capital: 'Sendai', note: 'Rice, fisheries and a shrinking, ageing population.' },
    { name: 'Chugoku', pop: 7.1, gdp: 210, unemp: 2.4, capital: 'Hiroshima', note: 'Steel, shipbuilding and car plants along the Inland Sea.' },
    { name: 'Hokkaido', pop: 5.1, gdp: 150, unemp: 3.1, capital: 'Sapporo', note: 'The northern island: farming, dairy and winter tourism.' },
    { name: 'Shikoku', pop: 3.6, gdp: 100, unemp: 2.7, capital: 'Matsuyama', note: 'The smallest region, between the Inland Sea and the Pacific.' },
  ];

  // Largest prefectures by population, millions, 2024.
  var PREFECTURES = [
    { name: 'Tokyo', pop: 14.1 },
    { name: 'Kanagawa', pop: 9.2 },
    { name: 'Osaka', pop: 8.8 },
    { name: 'Aichi', pop: 7.5 },
    { name: 'Saitama', pop: 7.3 },
    { name: 'Chiba', pop: 6.3 },
    { name: 'Hyogo', pop: 5.4 },
    { name: 'Hokkaido', pop: 5.1 },
  ];

  // Latest releases, each linking to its section.
  var RELEASES = [
    { date: 'January 2026', title: 'Population estimates: 124.0 million people', route: '#/population' },
    { date: 'January 2026', title: 'Consumer prices rose 2.7% in 2024', route: '#/prices' },
    { date: 'December 2025', title: 'Labour force survey: unemployment 2.5%', route: '#/jobs' },
    { date: 'December 2025', title: 'National accounts: real GDP −0.1% in 2024', route: '#/economy' },
  ];

  // Indicators for the overview finder: name, 2024 value, route.
  var INDICATORS = [
    { name: 'Population', value: '124.0 million', route: '#/population' },
    { name: 'GDP, nominal', value: '$4.03 trillion', route: '#/economy' },
    { name: 'GDP per capita', value: '$32,500', route: '#/economy' },
    { name: 'Real GDP growth', value: '−0.1% in 2024', route: '#/economy' },
    { name: 'Unemployment rate', value: '2.5%', route: '#/jobs' },
    { name: 'Labour force', value: '69.3 million', route: '#/jobs' },
    { name: 'Consumer prices (CPI)', value: '+2.7% in 2024', route: '#/prices' },
    { name: 'Life expectancy', value: '84.0 years', route: '#/education-health' },
    { name: 'Share aged 65+', value: '29.6%', route: '#/population' },
    { name: 'Share aged 0–14', value: '11.4%', route: '#/population' },
    { name: 'Births', value: '0.72 million in 2024', route: '#/population' },
    { name: 'Deaths', value: '1.62 million in 2024', route: '#/population' },
    { name: 'Exports', value: '$726 billion in 2024', route: '#/economy' },
    { name: 'Imports', value: '$816 billion in 2024', route: '#/economy' },
    { name: 'Health spending', value: '11.4% of GDP', route: '#/education-health' },
    { name: 'Tertiary attainment, age 25–34', value: '65%', route: '#/education-health' },
    { name: 'Urban population', value: '91.8%', route: '#/population' },
    { name: 'Largest region: Kanto', value: '43.9 million people', route: '#/regions' },
  ];

  // When the figures were last reviewed. The About page shows this, so the
  // review date lives in exactly one place.
  var LAST_REVIEWED = 'January 2026';

  // Small formatting helpers used by the views.
  function fmt(value, kind) {
    if (kind === 'percent') return (value > 0 ? '+' : '') + value.toFixed(1) + '%';
    if (kind === 'money') return '$' + value.toFixed(2) + 'tn';
    if (kind === 'dollars') return '$' + value.toLocaleString('en-US');
    if (kind === 'people') return value.toFixed(1) + 'm';
    if (kind === 'years') return value.toFixed(1) + ' years';
    return String(value);
  }

  function gdpPerCapita(region) {
    return Math.round((region.gdp * 1000) / region.pop);
  }

  window.JIN = {
    YEARS: YEARS,
    SERIES: SERIES,
    AGE_SHARES: AGE_SHARES,
    PYRAMID_BANDS: PYRAMID_BANDS,
    PYRAMID: PYRAMID,
    VITAL: VITAL,
    GDP_SECTORS: GDP_SECTORS,
    TRADE: TRADE,
    INDUSTRIES: INDUSTRIES,
    EMPLOYMENT_SECTORS: EMPLOYMENT_SECTORS,
    WAGES: WAGES,
    PARTICIPATION: PARTICIPATION,
    CPI_CATEGORIES: CPI_CATEGORIES,
    EDUCATION: EDUCATION,
    HEALTH: HEALTH,
    REGIONS: REGIONS,
    PREFECTURES: PREFECTURES,
    RELEASES: RELEASES,
    INDICATORS: INDICATORS,
    LAST_REVIEWED: LAST_REVIEWED,
    fmt: fmt,
    gdpPerCapita: gdpPerCapita,
  };
})();
