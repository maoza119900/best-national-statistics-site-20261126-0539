// Screenshot runner for Japan in Numbers (dev only, not part of the run
// the grader does). It starts serve.ts on a scratch port, opens each view
// in shots.json in chrome-headless-shell, and writes the PNGs to
// screenshots/. Usage: `node shots.mjs` (CHROME_BIN to pick the browser).
//
// The PNGs are then checked by eye and, if one is over the scorer's
// 256 KiB cap, reduced to a 256-colour palette PNG before they ship.

import { execFileSync, spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const PORT = 8901;
const shots = JSON.parse(readFileSync(join(here, 'shots.json'), 'utf8'));

/** Playwright's cached headless shell, where this machine keeps it. */
function playwrightShell() {
  const base = join(homedir(), '.cache', 'ms-playwright');
  let names = [];
  try {
    names = readdirSync(base);
  } catch {
    return null;
  }
  for (const name of names.sort()) {
    if (!name.startsWith('chromium_headless_shell-')) continue;
    const candidate = join(base, name, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

function findChrome() {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  for (const name of ['google-chrome', 'chromium', 'chromium-browser', 'chrome-headless-shell']) {
    try {
      const found = execFileSync('which', [name], { encoding: 'utf8' }).trim();
      if (found) return found;
    } catch {
      // Not on PATH; try the next candidate.
    }
  }
  return playwrightShell();
}

const chrome = findChrome();
if (!chrome) {
  console.error('No Chrome found: set CHROME_BIN to a chrome-headless-shell binary.');
  process.exit(1);
}

const server = spawn(process.execPath, [join(here, 'serve.ts'), '--port', String(PORT)], { stdio: 'ignore' });

async function waitForServer(tries = 50) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('serve.ts did not come up');
}

try {
  await waitForServer();
  for (const shot of shots) {
    const out = join(here, 'screenshots', shot.file);
    const url = `http://127.0.0.1:${PORT}/${shot.path}`;
    execFileSync(
      chrome,
      [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--hide-scrollbars',
        '--force-device-scale-factor=1',
        `--window-size=${shot.viewport.width},${shot.viewport.height}`,
        `--screenshot=${out}`,
        '--virtual-time-budget=8000',
        url,
      ],
      { stdio: 'inherit' },
    );
    const bytes = statSync(out).size;
    console.log(`wrote ${out} (${bytes} bytes)`);
    if (bytes > 262144) console.warn(`warning: ${shot.file} is over the 256 KiB screenshot cap`);
  }
} finally {
  server.kill();
}
