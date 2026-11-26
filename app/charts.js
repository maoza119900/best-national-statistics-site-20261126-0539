// Japan in Numbers — chart library.
//
// Every chart is hand-written SVG: no chart library, no external asset. Each
// builder takes plain arrays and returns an SVG string the views drop into
// the page. Labels are placed to avoid collisions: x-axis ticks are thinned
// to every second year, value labels sit clear of the bars, and negative bars
// carry their label below the zero line instead of inside the bar.

(function () {
  'use strict';

  var INK = '#1b2a4a';
  var MUTED = '#5b6b84';
  var GRID = '#e3e8f0';
  var BLUE = '#2563eb';
  var TEAL = '#0d9488';
  var AMBER = '#d97706';
  var ROSE = '#e11d48';
  var VIOLET = '#7c3aed';
  var GREEN = '#15803d';
  var PALETTE = [BLUE, TEAL, AMBER, ROSE, VIOLET, GREEN, '#0891b2', '#be185d'];

  function esc(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function niceTicks(min, max, count) {
    if (min === max) { min -= 1; max += 1; }
    var span = max - min;
    var step = span / count;
    var mag = Math.pow(10, Math.floor(Math.log10(step)));
    var norm = step / mag;
    var nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
    step = nice * mag;
    var start = Math.floor(min / step) * step;
    var ticks = [];
    for (var v = start; v <= max + step * 0.5; v += step) {
      ticks.push(Math.round(v * 100) / 100);
    }
    return ticks;
  }

  function num(value, decimals) {
    var n = Number(value);
    if (decimals === undefined) decimals = 1;
    return n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // Line chart with a filled area, dots, and a y axis that always includes
  // zero when the values are all positive. `series` is one array of numbers.
  function lineChart(opts) {
    var labels = opts.labels;
    var values = opts.values;
    var w = opts.width || 760;
    var h = opts.height || 300;
    var padL = 58;
    var padR = 16;
    var padT = 18;
    var padB = 34;
    var color = opts.color || BLUE;
    var decimals = opts.decimals === undefined ? 1 : opts.decimals;
    var suffix = opts.suffix || '';
    var min = Math.min.apply(null, values.concat([0]));
    var max = Math.max.apply(null, values);
    if (max - min < 1) max = min + 1;
    var ticks = niceTicks(min, max, 4);
    var lo = ticks[0];
    var hi = ticks[ticks.length - 1];
    var iw = w - padL - padR;
    var ih = h - padT - padB;
    function x(i) { return padL + (i * iw) / (labels.length - 1); }
    function y(v) { return padT + ih - ((v - lo) / (hi - lo)) * ih; }
    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.title || 'Line chart') + '">');
    ticks.forEach(function (t) {
      out.push('<line x1="' + padL + '" y1="' + y(t).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y(t).toFixed(1) + '" stroke="' + GRID + '"/>');
      out.push('<text x="' + (padL - 8) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + num(t, decimals) + suffix + '</text>');
    });
    var area = 'M' + x(0).toFixed(1) + ',' + y(values[0]).toFixed(1);
    var line = 'M' + x(0).toFixed(1) + ',' + y(values[0]).toFixed(1);
    for (var i = 1; i < values.length; i++) {
      area += ' L' + x(i).toFixed(1) + ',' + y(values[i]).toFixed(1);
      line += ' L' + x(i).toFixed(1) + ',' + y(values[i]).toFixed(1);
    }
    area += ' L' + x(values.length - 1).toFixed(1) + ',' + y(lo).toFixed(1) + ' L' + x(0).toFixed(1) + ',' + y(lo).toFixed(1) + ' Z';
    out.push('<path d="' + area + '" fill="' + color + '" fill-opacity="0.08"/>');
    out.push('<path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linejoin="round"/>');
    values.forEach(function (v, i) {
      out.push('<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"/>');
    });
    // Last value labelled at the end of the line, clear of the axis.
    var last = values[values.length - 1];
    out.push('<text x="' + (x(values.length - 1) - 4).toFixed(1) + '" y="' + (y(last) - 10).toFixed(1) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + INK + '">' + num(last, decimals) + suffix + '</text>');
    labels.forEach(function (lab, i) {
      if (i % 2 === 0 || i === labels.length - 1) {
        out.push('<text x="' + x(i).toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(lab) + '</text>');
      }
    });
    out.push('</svg>');
    return out.join('');
  }

  // Vertical bar chart. Negative bars grow below the zero line and their
  // labels sit under the bar end, never overlapping the axis labels.
  function barChart(opts) {
    var labels = opts.labels;
    var values = opts.values;
    var w = opts.width || 760;
    var h = opts.height || 300;
    var padL = 58;
    var padR = 16;
    var padT = 24;
    var padB = 34;
    var decimals = opts.decimals === undefined ? 1 : opts.decimals;
    var suffix = opts.suffix || '';
    var min = Math.min.apply(null, values.concat([0]));
    var max = Math.max.apply(null, values.concat([0]));
    if (max - min < 1) max = min + 1;
    var ticks = niceTicks(min, max, 4);
    var lo = ticks[0];
    var hi = ticks[ticks.length - 1];
    var iw = w - padL - padR;
    var ih = h - padT - padB;
    function y(v) { return padT + ih - ((v - lo) / (hi - lo)) * ih; }
    var slot = iw / labels.length;
    var bw = Math.min(46, slot * 0.62);
    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.title || 'Bar chart') + '">');
    ticks.forEach(function (t) {
      out.push('<line x1="' + padL + '" y1="' + y(t).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y(t).toFixed(1) + '" stroke="' + GRID + '"/>');
      out.push('<text x="' + (padL - 8) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end" font-size="11" fill="' + MUTED + '">' + num(t, decimals) + suffix + '</text>');
    });
    values.forEach(function (v, i) {
      var cx = padL + slot * i + slot / 2;
      var color = opts.colors ? opts.colors[i % opts.colors.length] : (v < 0 ? ROSE : BLUE);
      var top = Math.min(y(v), y(0));
      var height = Math.abs(y(v) - y(0));
      out.push('<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(height, 1).toFixed(1) + '" rx="3" fill="' + color + '"><title>' + esc(labels[i]) + ': ' + num(v, decimals) + suffix + '</title></rect>');
      var ly = v < 0 ? y(v) + 16 : y(v) - 7;
      out.push('<text x="' + cx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + INK + '">' + num(v, decimals) + suffix + '</text>');
      out.push('<text x="' + cx.toFixed(1) + '" y="' + (h - 10) + '" text-anchor="middle" font-size="11" fill="' + MUTED + '">' + esc(labels[i]) + '</text>');
    });
    out.push('</svg>');
    return out.join('');
  }

  // Horizontal bars with the category name on the left and the value at the
  // end of each bar. Negative values extend left from the zero line.
  function hbarChart(opts) {
    var rows = opts.rows; // [{name, value}]
    var w = opts.width || 760;
    var rowH = opts.rowHeight || 34;
    var padL = opts.labelWidth || 210;
    var padR = 64;
    var padT = 8;
    var h = padT + rows.length * rowH + 8;
    var decimals = opts.decimals === undefined ? 1 : opts.decimals;
    var suffix = opts.suffix || '';
    var max = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.value); }).concat([1]));
    var min = Math.min.apply(null, rows.map(function (r) { return r.value; }).concat([0]));
    var span = (min < 0 ? max : 0) + max;
    var zeroX = padL + (min < 0 ? (max / span) * (w - padL - padR) : 0);
    var scale = (w - padL - padR) / span;
    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.title || 'Horizontal bar chart') + '">');
    rows.forEach(function (r, i) {
      var cy = padT + i * rowH + rowH / 2;
      var color = opts.colors ? opts.colors[i % opts.colors.length] : PALETTE[i % PALETTE.length];
      var barW = Math.max(Math.abs(r.value) * scale, 2);
      var bx = r.value < 0 ? zeroX - barW : zeroX;
      out.push('<text x="' + (padL - 10) + '" y="' + (cy + 4).toFixed(1) + '" text-anchor="end" font-size="12" fill="' + INK + '">' + esc(r.name) + '</text>');
      out.push('<rect x="' + bx.toFixed(1) + '" y="' + (cy - 9).toFixed(1) + '" width="' + barW.toFixed(1) + '" height="18" rx="3" fill="' + (r.value < 0 ? ROSE : color) + '"/>');
      var tx = r.value < 0 ? bx - 6 : bx + barW + 6;
      var anchor = r.value < 0 ? 'end' : 'start';
      out.push('<text x="' + tx.toFixed(1) + '" y="' + (cy + 4).toFixed(1) + '" text-anchor="' + anchor + '" font-size="12" font-weight="700" fill="' + INK + '">' + num(r.value, decimals) + suffix + '</text>');
    });
    if (min < 0) {
      out.push('<line x1="' + zeroX.toFixed(1) + '" y1="' + padT + '" x2="' + zeroX.toFixed(1) + '" y2="' + (h - 8) + '" stroke="' + GRID + '"/>');
    }
    out.push('</svg>');
    return out.join('');
  }

  // Donut chart. Segments carry data-index so the page can highlight one on
  // hover or click and show its note underneath.
  function donutChart(opts) {
    var rows = opts.rows; // [{name, share}]
    var size = opts.size || 300;
    var cx = size / 2;
    var cy = size / 2;
    var r = size / 2 - 14;
    var inner = r - 52;
    var total = rows.reduce(function (a, b) { return a + b.share; }, 0);
    var out = [];
    // The viewBox is padded by 26 units on every side so the percentage
    // labels that sit outside the ring are never clipped at the edge.
    out.push('<svg viewBox="-26 -26 ' + (size + 52) + ' ' + (size + 52) + '" role="img" aria-label="' + esc(opts.title || 'Donut chart') + '">');
    var angle = -Math.PI / 2;
    rows.forEach(function (row, i) {
      var frac = row.share / total;
      var a0 = angle;
      var a1 = angle + frac * Math.PI * 2;
      var large = frac > 0.5 ? 1 : 0;
      var x0 = cx + r * Math.cos(a0);
      var y0 = cy + r * Math.sin(a0);
      var x1 = cx + r * Math.cos(a1);
      var y1 = cy + r * Math.sin(a1);
      var xi1 = cx + inner * Math.cos(a1);
      var yi1 = cy + inner * Math.sin(a1);
      var xi0 = cx + inner * Math.cos(a0);
      var yi0 = cy + inner * Math.sin(a0);
      var color = PALETTE[i % PALETTE.length];
      out.push('<path d="M' + x0.toFixed(1) + ',' + y0.toFixed(1) + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ',' + y1.toFixed(1) + ' L' + xi1.toFixed(1) + ',' + yi1.toFixed(1) + ' A' + inner + ',' + inner + ' 0 ' + large + ' 0 ' + xi0.toFixed(1) + ',' + yi0.toFixed(1) + ' Z" fill="' + color + '" data-sector="' + i + '" style="cursor:pointer"><title>' + esc(row.name) + ': ' + num(row.share, 1) + '%</title></path>');
      var mid = (a0 + a1) / 2;
      var lx = cx + (r + 26) * Math.cos(mid);
      var ly = cy + (r + 26) * Math.sin(mid);
      if (frac > 0.04) {
        out.push('<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + INK + '">' + num(row.share, 1) + '%</text>');
      }
      angle = a1;
    });
    out.push('<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="13" fill="' + MUTED + '">GDP by sector</text>');
    out.push('<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="15" font-weight="700" fill="' + INK + '">2024</text>');
    out.push('</svg>');
    return out.join('');
  }

  // Population pyramid: men extend left from the centre line, women right.
  function pyramidChart(opts) {
    var bands = opts.bands;
    var men = opts.men;
    var women = opts.women;
    var w = opts.width || 760;
    var rowH = 26;
    var padT = 30;
    var padB = 10;
    var h = padT + bands.length * rowH + padB;
    var mid = w / 2;
    var half = (w - 130) / 2;
    var max = Math.max.apply(null, men.concat(women).concat([1]));
    var out = [];
    out.push('<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(opts.title || 'Population pyramid') + '">');
    out.push('<text x="' + (mid - half) + '" y="16" font-size="12" font-weight="700" fill="' + BLUE + '">Men</text>');
    out.push('<text x="' + (mid + half) + '" y="16" text-anchor="end" font-size="12" font-weight="700" fill="' + ROSE + '">Women</text>');
    bands.forEach(function (band, i) {
      var y = padT + i * rowH;
      var mw = (men[i] / max) * half;
      var ww = (women[i] / max) * half;
      out.push('<rect x="' + (mid - mw).toFixed(1) + '" y="' + y + '" width="' + mw.toFixed(1) + '" height="20" rx="2" fill="' + BLUE + '"><title>Men ' + esc(band) + ': ' + num(men[i], 1) + '%</title></rect>');
      out.push('<rect x="' + mid.toFixed(1) + '" y="' + y + '" width="' + ww.toFixed(1) + '" height="20" rx="2" fill="' + ROSE + '"><title>Women ' + esc(band) + ': ' + num(women[i], 1) + '%</title></rect>');
      out.push('<text x="' + mid + '" y="' + (y + 14) + '" text-anchor="middle" font-size="10" fill="' + MUTED + '">' + esc(band) + '</text>');
    });
    out.push('<line x1="' + mid + '" y1="' + padT + '" x2="' + mid + '" y2="' + (h - padB) + '" stroke="' + GRID + '"/>');
    out.push('</svg>');
    return out.join('');
  }

  window.JINCharts = {
    esc: esc,
    num: num,
    lineChart: lineChart,
    barChart: barChart,
    hbarChart: hbarChart,
    donutChart: donutChart,
    pyramidChart: pyramidChart,
    colors: { ink: INK, muted: MUTED, blue: BLUE, teal: TEAL, amber: AMBER, rose: ROSE, violet: VIOLET, green: GREEN },
  };
})();
