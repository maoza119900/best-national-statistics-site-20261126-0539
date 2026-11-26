// Hand-written SVG charts for Japan in Numbers. No chart library, no
// network: every chart is a string of SVG built from the numbers passed in.
// Colours come from the site palette so charts and page agree. The SVGs
// carry no xmlns attribute: they are injected into the HTML page, where
// inline SVG needs none, so app/ holds no absolute URL at all.

const INK = '#1b2a4a';
const MUTED = '#5b6b84';
const GRID = '#dbe2ec';
const BLUE = '#2456a6';
const TEAL = '#0e7c7b';
const AMBER = '#c47f17';
const ROSE = '#b3375a';
const SLATE = '#7a8aa0';
const PALETTE = [BLUE, TEAL, AMBER, ROSE, '#5b7fb8', SLATE, '#3f9e6e', '#8a6fb8'];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Round a number to one decimal, trimming a trailing ".0". */
const num = (v) => {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
};

/** Nice axis ticks: at most `count` steps covering [min, max]. */
function niceTicks(min, max, count = 4) {
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const norm = step0 / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out = [];
  for (let v = lo; v <= hi + step / 2; v += step) out.push(Math.round(v * 100) / 100);
  return { lo, hi, step, ticks: out };
}

/**
 * Line chart. `labels` are x labels, `values` the points. The y axis gets
 * its own column on the left and the x labels sit 26px below the plot, so a
 * bottom tick never collides with a year label.
 */
export function lineChart({ labels, values, width = 640, height = 300, format = num, color = BLUE, label = '' }) {
  const padL = 56;
  const padR = 16;
  const padT = 14;
  const padB = 30;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.12 || 1;
  const { lo, hi, ticks } = niceTicks(min - pad, max + pad);
  const x = (i) => padL + (i * w) / (labels.length - 1);
  const y = (v) => padT + h - ((v - lo) / (hi - lo)) * h;
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const grid = ticks
    .map(
      (t) =>
        `<line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>` +
        `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(t))}</text>`,
    )
    .join('');
  const xLabels = labels
    .map((l, i) => `<text x="${x(i)}" y="${padT + h + 20}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(l)}</text>`)
    .join('');
  const dots = values
    .map((v, i) => `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#fff" stroke="${color}" stroke-width="2"><title>${esc(labels[i])}: ${esc(format(v))}</title></circle>`)
    .join('');
  const last = values[values.length - 1];
  const endLabel = `<text x="${x(values.length - 1) - 4}" y="${y(last) - 10}" text-anchor="end" font-size="12" font-weight="700" fill="${color}">${esc(format(last))}</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label || 'Line chart')}">
${grid}
<line x1="${padL}" y1="${padT + h}" x2="${padL + w}" y2="${padT + h}" stroke="${INK}" stroke-width="1"/>
<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
${dots}
${endLabel}
${xLabels}
</svg>`;
}

/**
 * Bar chart. Handles negative values: the zero line sits inside the plot,
 * positive bars rise from it and negative bars hang below it, and each
 * value label sits outside its bar's far end so it never overlaps the bar.
 */
export function barChart({ labels, values, width = 640, height = 300, format = num, color = BLUE, label = '' }) {
  const padL = 56;
  const padR = 16;
  const padT = 22;
  const padB = 30;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const pad = (max - min) * 0.08 || 1;
  const { lo, hi, ticks } = niceTicks(min - pad, max + pad);
  const y = (v) => padT + h - ((v - lo) / (hi - lo)) * h;
  const slot = w / labels.length;
  const bw = Math.min(44, slot * 0.62);
  const grid = ticks
    .map(
      (t) =>
        `<line x1="${padL}" y1="${y(t)}" x2="${padL + w}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>` +
        `<text x="${padL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(format(t))}</text>`,
    )
    .join('');
  const bars = values
    .map((v, i) => {
      const cx = padL + slot * i + slot / 2;
      const y0 = y(0);
      const yv = y(v);
      const top = Math.min(y0, yv);
      const bh = Math.max(1, Math.abs(yv - y0));
      const fill = v < 0 ? ROSE : color;
      const labelY = v < 0 ? yv + 15 : yv - 6;
      return `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${fill}"><title>${esc(labels[i])}: ${esc(format(v))}</title></rect>` +
        `<text x="${cx}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="11" font-weight="600" fill="${INK}">${esc(format(v))}</text>`;
    })
    .join('');
  const xLabels = labels
    .map((l, i) => `<text x="${padL + slot * i + slot / 2}" y="${padT + h + 20}" text-anchor="middle" font-size="11" fill="${MUTED}">${esc(l)}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label || 'Bar chart')}">
${grid}
<line x1="${padL}" y1="${y(0)}" x2="${padL + w}" y2="${y(0)}" stroke="${INK}" stroke-width="1"/>
${bars}
${xLabels}
</svg>`;
}

/**
 * Donut chart. `items` are { name, share }. Segments are paths with a
 * data-name attribute so the page can highlight one on hover or click.
 */
export function donutChart({ items, width = 640, height = 300, label = '' }) {
  const cx = 150;
  const cy = height / 2;
  const rOuter = 105;
  const rInner = 62;
  const total = items.reduce((a, b) => a + b.share, 0);
  let angle = -Math.PI / 2;
  const arcs = items
    .map((item, i) => {
      const frac = item.share / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = frac > 0.5 ? 1 : 0;
      const x0 = cx + rOuter * Math.cos(a0);
      const y0 = cy + rOuter * Math.sin(a0);
      const x1 = cx + rOuter * Math.cos(a1);
      const y1 = cy + rOuter * Math.sin(a1);
      const x2 = cx + rInner * Math.cos(a1);
      const y2 = cy + rInner * Math.sin(a1);
      const x3 = cx + rInner * Math.cos(a0);
      const y3 = cy + rInner * Math.sin(a0);
      const mid = (a0 + a1) / 2;
      // Small slices get no ring label: at this radius their labels would
      // stack on each other. The legend beside the chart names every share.
      const pct =
        item.share >= 4
          ? (() => {
              const lx = cx + (rOuter + 24) * Math.cos(mid);
              const ly = cy + (rOuter + 24) * Math.sin(mid);
              const anchor = Math.cos(mid) >= 0 ? 'start' : 'end';
              return `<text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="${anchor}" font-size="11" font-weight="600" fill="${INK}">${num(item.share)}%</text>`;
            })()
          : '';
      return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${rOuter} ${rOuter} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} A ${rInner} ${rInner} 0 ${large} 0 ${x3.toFixed(1)} ${y3.toFixed(1)} Z" fill="${PALETTE[i % PALETTE.length]}" data-name="${esc(item.name)}" class="donut-seg"><title>${esc(item.name)}: ${num(item.share)}%</title></path>${pct}`;
    })
    .join('');
  const legend = items
    .map(
      (item, i) =>
        `<g class="donut-legend" data-name="${esc(item.name)}"><rect x="310" y="${30 + i * 26}" width="12" height="12" rx="2" fill="${PALETTE[i % PALETTE.length]}"/><text x="330" y="${40 + i * 26}" font-size="12" fill="${INK}">${esc(item.name)} — ${num(item.share)}%</text></g>`,
    )
    .join('');
  const centre = `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="700" fill="${INK}">100%</text><text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="11" fill="${MUTED}">of GDP</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label || 'Donut chart')}">
${arcs}
${centre}
${legend}
</svg>`;
}

/**
 * Age-structure pyramid: one horizontal bar per 5-year band, youngest at
 * the bottom, drawn from a centre spine with the share at the bar's end.
 */
export function pyramidChart({ bands, values, width = 640, height = 420, label = '' }) {
  const padL = 64;
  const padR = 64;
  const padT = 12;
  const padB = 12;
  const w = width - padL - padR;
  const h = height - padT - padB;
  const max = Math.max(...values);
  const slot = h / bands.length;
  const bh = Math.min(16, slot * 0.68);
  const rows = values
    .map((v, i) => {
      const y = padT + slot * (bands.length - 1 - i) + (slot - bh) / 2;
      const bw = (v / max) * w;
      const young = i < 3;
      const senior = i >= 13;
      const fill = young ? TEAL : senior ? AMBER : BLUE;
      return `<text x="${padL - 8}" y="${(y + bh / 2 + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="${MUTED}">${esc(bands[i])}</text>` +
        `<rect x="${padL}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${fill}"><title>${esc(bands[i])}: ${num(v)}% of the population</title></rect>` +
        `<text x="${(padL + bw + 6).toFixed(1)}" y="${(y + bh / 2 + 4).toFixed(1)}" font-size="11" font-weight="600" fill="${INK}">${num(v)}%</text>`;
    })
    .join('');
  const note = `<text x="${padL}" y="${height - 2}" font-size="11" fill="${MUTED}">Teal: ages 0–14 · Blue: 15–64 · Amber: 65+</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label || 'Age pyramid')}">
${rows}
${note}
</svg>`;
}
