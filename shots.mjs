// Japan in Numbers — screenshot runner (development only).
//
// Takes the four screenshots listed in shots.json with the system Chrome in
// headless mode, straight from the running site. It starts its own copy of
// serve.ts on a scratch port, waits for the port to answer, screenshots each
// view, then stops the server. Run it from the repository root:
//
//   node shots.mjs
//
// The browser binary is picked up from CHROME_BIN, or from the usual places
// on this machine (/opt/meta-chromium/chrome, then google-chrome).

import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { get } from 'node:http';

const root = fileURLToPath(new URL('.', import.meta.url));
const shots = JSON.parse(readFileSync(join(root, 'shots.json'), 'utf8'));
const PORT = 8123;
const CHROME = process.env.CHROME_BIN || pickChrome();

function pickChrome() {
  for (const candidate of [
    process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell',
    '/opt/meta-chromium/chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    'google-chrome',
  ]) {
    if (candidate.startsWith('/') && existsSync(candidate)) return candidate;
    if (!candidate.startsWith('/')) return candidate;
  }
  return 'google-chrome';
}

function waitForServer(port, tries) {
  return new Promise((done) => {
    const attempt = (left) => {
      const req = get({ host: '127.0.0.1', port, path: '/' }, (res) => {
        res.resume();
        done(res.statusCode === 200);
      });
      req.on('error', () => {
        if (left <= 1) return done(false);
        setTimeout(() => attempt(left - 1), 250);
      });
    };
    attempt(tries);
  });
}

function screenshot(view) {
  const url = 'http://127.0.0.1:' + PORT + '/index.html' + view.path;
  const out = resolve(root, 'screenshots', view.file);
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=' + view.viewport.width + ',' + view.viewport.height,
    '--virtual-time-budget=8000',
    '--screenshot=' + out,
    url,
  ];
  const run = spawnSync(CHROME, args, { stdio: 'inherit', timeout: 60000 });
  if (run.status !== 0) throw new Error('Chrome failed on ' + view.file);
  const done = statSync(out);
  if (done.size < 10000) throw new Error('Screenshot looks empty: ' + view.file + ' (' + done.size + ' bytes)');
  console.log('shot ' + view.file + ' (' + view.viewport.width + 'x' + view.viewport.height + ' ' + view.path + ', ' + done.size + ' bytes)');
}

async function main() {
  const server = spawn(process.execPath, ['serve.ts', '--port', String(PORT)], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', (d) => process.stdout.write(d));
  server.stderr.on('data', (d) => process.stderr.write(d));
  try {
    const up = await waitForServer(PORT, 40);
    if (!up) throw new Error('the local server never answered on port ' + PORT);
    for (const view of shots) screenshot(view);
    console.log('all ' + shots.length + ' screenshots written to screenshots/');
  } finally {
    server.kill('SIGTERM');
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
