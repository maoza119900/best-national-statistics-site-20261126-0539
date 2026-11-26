// Japan in Numbers — the figures behind the site.
//
// Every number is a rounded public estimate for Japan, 2015-2024, in the
// site's own wording. Headline figures follow the Statistics Bureau /
// IMF-style numbers a reader would recognise; regional figures are rounded
// so the eight regions sum to the national total (population 124.0m,
// nominal GDP $4.03tn in 2024) within rounding. Nothing here is copied
// from any statistics agency's publication.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export const SERIES = {
  population: {
    label: 'Population',
    unit: 'million people',
    values: [127.1, 126.9, 126.7, 126.4, 126.2, 125.9, 125.5, 125.1, 124.6, 124.0],
    format: (v) => `${v.toFixed(1)}m`,
  },
  gdp: {
    label: 'Nominal GDP',
    unit: 'US$ trillion',
    values: [4.39, 4.92, 4.93, 5.04, 5.15, 5.05, 5.02, 4.26, 4.21, 4.03],
    format: (v) => `$${v.toFixed(2)}tn`,
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    values: [34540, 38770, 38910, 39870, 40810, 40110, 40000, 34050, 33790, 32500],
    format: (v) => `$${v.toLocaleString('en-US')}`,
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    values: [3.4, 3.1, 2.8, 2.4, 2.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    format: (v) => `${v.toFixed(1)}%`,
  },
  cpi: {
    label: 'Consumer price inflation',
    unit: '% year on year',
    values: [0.8, -0.1, 0.5, 1.0, 0.5, 0.0, -0.2, 2.5, 3.3, 2.7],
    format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    values: [83.9, 84.1, 84.2, 84.2, 84.4, 84.6, 84.0, 84.0, 84.0, 84.0],
    format: (v) => `${v.toFixed(1)} years`,
  },
  labourForce: {
    label: 'Labour force',
    unit: 'million people',
    values: [66.0, 66.4, 67.1, 67.9, 68.4, 68.7, 69.1, 69.1, 69.2, 69.3],
    format: (v) => `${v.toFixed(1)}m`,
  },
  births: {
    label: 'Live births',
    unit: 'million',
    values: [1.01, 0.98, 0.95, 0.92, 0.87, 0.84, 0.81, 0.77, 0.73, 0.72],
    format: (v) => `${v.toFixed(2)}m`,
  },
  deaths: {
    label: 'Deaths',
    unit: 'million',
    values: [1.29, 1.31, 1.34, 1.36, 1.38, 1.37, 1.44, 1.57, 1.59, 1.62],
    format: (v) => `${v.toFixed(2)}m`,
  },
  realGrowth: {
    label: 'Real GDP growth',
    unit: '% year on year',
    values: [1.6, 0.8, 1.7, 0.6, -0.4, -4.2, 2.6, 0.9, 1.7, -0.1],
    format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
  },
};

// Age structure. Each year's three shares sum to 100, and each year's
// eighteen 5-year bands sum to 100 as well.
export const AGE_SHARES = {
  2015: { young: 12.6, working: 60.7, senior: 26.7 },
  2020: { young: 11.9, working: 59.5, senior: 28.6 },
  2024: { young: 11.4, working: 59.0, senior: 29.6 },
};

export const AGE_BANDS = ['0–4', '5–9', '10–14', '15–19', '20–24', '25–29', '30–34', '35–39', '40–44', '45–49', '50–54', '55–59', '60–64', '65–69', '70–74', '75–79', '80–84', '85+'];

export const PYRAMID = {
  2015: [4.0, 4.2, 4.4, 4.7, 5.1, 5.8, 6.3, 6.0, 6.8, 7.2, 6.9, 6.1, 5.8, 7.4, 7.2, 5.4, 3.9, 2.8],
  2020: [3.7, 4.0, 4.2, 4.6, 5.1, 5.6, 5.8, 6.1, 6.2, 6.8, 6.9, 6.4, 6.0, 7.6, 7.6, 5.9, 4.1, 3.4],
  2024: [3.4, 3.9, 4.1, 4.4, 5.0, 5.4, 5.6, 6.0, 6.8, 7.2, 6.6, 6.1, 5.9, 7.2, 7.8, 6.2, 4.3, 4.1],
};

// GDP by sector, 2024, % of nominal GDP. Sums to 100.
export const GDP_SECTORS = [
  { name: 'Services', share: 69.0, note: 'Wholesale and retail, health, education, finance, transport and other services.' },
  { name: 'Manufacturing', share: 20.0, note: 'Cars, electronics, machinery and chemicals lead factory output.' },
  { name: 'Construction', share: 5.5, note: 'Housing, civil engineering and public works.' },
  { name: 'Mining & utilities', share: 1.5, note: 'Electricity, gas, water and mining.' },
  { name: 'Agriculture, forestry & fishing', share: 1.0, note: 'Rice, vegetables, fruit, fish and timber.' },
  { name: 'Other', share: 3.0, note: 'Net taxes on products and statistical discrepancy.' },
];

// Trade in goods, US$ billion.
export const TRADE_YEARS = [2020, 2021, 2022, 2023, 2024];
export const TRADE = {
  exports: [641, 751, 746, 717, 713],
  imports: [635, 772, 899, 833, 790],
};

export const TOP_EXPORTS = [
  { industry: 'Motor vehicles & parts', value: 148, share: 20.8 },
  { industry: 'Semiconductors & electronics', value: 105, share: 14.7 },
  { industry: 'General machinery', value: 98, share: 13.7 },
  { industry: 'Chemicals & plastics', value: 72, share: 10.1 },
  { industry: 'Iron & steel', value: 34, share: 4.8 },
];

// Employment by sector, 2024, millions of people. All / men / women sum to 67.6m employed.
export const EMPLOYMENT_SECTORS = ['Services', 'Manufacturing', 'Construction', 'Agriculture', 'Other'];
export const EMPLOYMENT = {
  all: [48.3, 10.6, 4.8, 1.9, 2.0],
  men: [23.5, 7.3, 4.0, 1.1, 1.0],
  women: [24.8, 3.3, 0.8, 0.8, 1.0],
};

// Average monthly cash earnings by industry, 2024, yen (rounded).
export const WAGES = [
  { industry: 'Finance & insurance', wage: 470000 },
  { industry: 'Information & communications', wage: 430000 },
  { industry: 'Education', wage: 360000 },
  { industry: 'Construction', wage: 350000 },
  { industry: 'Manufacturing', wage: 340000 },
  { industry: 'Wholesale & retail', wage: 300000 },
  { industry: 'Health & welfare', wage: 290000 },
  { industry: 'Accommodation & food services', wage: 220000 },
];

// Labour-force participation rate by age group, 2024, %.
export const PARTICIPATION = [
  { group: '15–24', rate: 48 },
  { group: '25–34', rate: 88 },
  { group: '35–44', rate: 88 },
  { group: '45–54', rate: 87 },
  { group: '55–64', rate: 78 },
  { group: '65+', rate: 25 },
];

// CPI by category, % year on year.
export const CPI_CATEGORIES = ['Food', 'Energy', 'Housing', 'Transport', 'Health', 'Education', 'Recreation', 'Clothing'];
export const CPI_BY_YEAR = {
  2022: [4.0, 15.2, 0.8, 2.1, 0.4, 0.9, 1.6, 1.4],
  2023: [7.5, 8.3, 1.0, 2.4, 1.2, 1.1, 2.8, 2.6],
  2024: [4.2, 3.1, 0.9, 1.8, 1.1, 1.5, 2.2, 2.0],
};

// Educational attainment, % of the age group.
export const ATTAINMENT = {
  'All ages 25–64': [
    { level: 'Below upper secondary', share: 6 },
    { level: 'Upper secondary', share: 42 },
    { level: 'Tertiary', share: 52 },
  ],
  'Ages 25–34': [
    { level: 'Below upper secondary', share: 3 },
    { level: 'Upper secondary', share: 35 },
    { level: 'Tertiary', share: 62 },
  ],
  'Ages 55–64': [
    { level: 'Below upper secondary', share: 10 },
    { level: 'Upper secondary', share: 48 },
    { level: 'Tertiary', share: 42 },
  ],
};

// The eight regions. Populations sum to 124.0m; GDP sums to $4,030bn.
export const REGIONS = [
  { name: 'Kanto', capital: 'Tokyo', population: 44.1, gdp: 1560, unemployment: 2.5, area: 32421, note: 'Tokyo, Kanagawa, Saitama, Chiba, Ibaraki, Tochigi and Gunma. The Tokyo metropolitan area holds about a third of Japan.' },
  { name: 'Kinki', capital: 'Osaka', population: 22.4, gdp: 690, unemployment: 2.7, area: 33090, note: 'Osaka, Kyoto, Hyogo, Nara, Shiga and Wakayama. The Keihanshin area is the second metropolitan centre.' },
  { name: 'Chubu', capital: 'Nagoya', population: 21.5, gdp: 660, unemployment: 2.3, area: 66801, note: 'Aichi, Shizuoka, Gifu, Mie, Nagano, Niigata, Toyama, Ishikawa and Fukui. Home of the car industry around Nagoya.' },
  { name: 'Kyushu & Okinawa', capital: 'Fukuoka', population: 11.6, gdp: 360, unemployment: 2.9, area: 44466, note: 'Fukuoka, Saga, Nagasaki, Kumamoto, Oita, Miyazaki, Kagoshima and Okinawa. The southern gateway to Asia.' },
  { name: 'Tohoku', capital: 'Sendai', population: 8.4, gdp: 255, unemployment: 2.7, area: 66951, note: 'Aomori, Iwate, Miyagi, Akita, Yamagata and Fukushima. Rice, fruit and fishing along the northern Pacific coast.' },
  { name: 'Chugoku', capital: 'Hiroshima', population: 7.2, gdp: 225, unemployment: 2.4, area: 31922, note: 'Hiroshima, Okayama, Shimane, Tottori and Yamaguchi. Heavy industry faces the Seto Inland Sea.' },
  { name: 'Hokkaido', capital: 'Sapporo', population: 5.1, gdp: 165, unemployment: 2.8, area: 83424, note: 'The northern island: dairy, wheat, fishing and winter tourism on a fifth of the land.' },
  { name: 'Shikoku', capital: 'Matsuyama', population: 3.7, gdp: 115, unemployment: 2.6, area: 18800, note: 'Tokushima, Kagawa, Ehime and Kochi. The smallest of the four main islands.' },
];

export const PREFECTURES = [
  { name: 'Tokyo', population: 14.1 },
  { name: 'Kanagawa', population: 9.2 },
  { name: 'Osaka', population: 8.8 },
  { name: 'Aichi', population: 7.5 },
  { name: 'Saitama', population: 7.3 },
];

export const RELEASES = [
  { title: 'Population Estimates — October 2024', date: '2024-10-01', route: '#/population', text: 'Total population 124.0 million, down 0.6 million on the year; the 65+ share reached 29.6%.' },
  { title: 'National Accounts — Q4 2024', date: '2024-12-31', route: '#/economy', text: 'Nominal GDP $4.03 trillion; real growth −0.1% in 2024 as consumption stayed soft.' },
  { title: 'Labour Force Survey — December 2024', date: '2024-12-31', route: '#/jobs', text: 'Unemployment 2.5%; the labour force stood at 69.3 million.' },
  { title: 'Consumer Price Index — December 2024', date: '2024-12-31', route: '#/prices', text: 'CPI up 2.7% on the year; food prices rose 4.2%.' },
];

export const KEY_FACTS = [
  { label: 'Land area', value: '377,975 km²' },
  { label: 'Capital', value: 'Tokyo' },
  { label: 'Currency', value: 'Japanese yen (¥)' },
  { label: 'Prefectures', value: '47' },
  { label: 'Population density', value: '328 people / km²' },
  { label: 'Time zone', value: 'JST (UTC+9)' },
];

export const HEALTH = {
  spendingShare: 11.0,
  bedsPer1000: 12.6,
  physiciansPer1000: 2.6,
  hospitals: 8200,
  clinics: 104000,
};

export const URBAN_SHARE = 91.8;

export const INDICATORS = [
  { key: 'population', label: 'Population', route: '#/population', value: '124.0m', year: 2024 },
  { key: 'gdp', label: 'Nominal GDP', route: '#/economy', value: '$4.03tn', year: 2024 },
  { key: 'gdpPerCapita', label: 'GDP per capita', route: '#/economy', value: '$32,500', year: 2024 },
  { key: 'unemployment', label: 'Unemployment rate', route: '#/jobs', value: '2.5%', year: 2024 },
  { key: 'cpi', label: 'CPI inflation', route: '#/prices', value: '+2.7%', year: 2024 },
  { key: 'lifeExpectancy', label: 'Life expectancy', route: '#/education-health', value: '84.0 years', year: 2024 },
  { key: 'labourForce', label: 'Labour force', route: '#/jobs', value: '69.3m', year: 2024 },
  { key: 'realGrowth', label: 'Real GDP growth', route: '#/economy', value: '−0.1%', year: 2024 },
  { key: 'births', label: 'Live births', route: '#/population', value: '0.72m', year: 2024 },
  { key: 'deaths', label: 'Deaths', route: '#/population', value: '1.62m', year: 2024 },
];
