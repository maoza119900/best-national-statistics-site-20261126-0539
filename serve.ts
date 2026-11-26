// Japan in Numbers — local static server (development only).
//
// Serves app/ on http://localhost:8080 so the site can be opened in a real
// browser while building it: `node serve.ts`, or `node serve.ts --port 8090`
// for another port. It only ever serves files inside app/, sends the MIME
// types a browser needs, and refuses anything outside the folder. This is a
// convenience for local work, not a server for the internet.

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));
const argv = process.argv.slice(2);
const flagAt = argv.indexOf('--port');
const wanted = flagAt === -1 ? 8080 : Number(argv[flagAt + 1]);
const port = Number.isInteger(wanted) && wanted > 0 && wanted < 65536 ? wanted : 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendError(response, code, message) {
  response.writeHead(code, { 'content-type': 'text/plain; charset=utf-8' });
  response.end(message);
}

createServer((request, response) => {
  const raw = request.url ?? '/';
  let path;
  try {
    path = decodeURIComponent(new URL(raw, 'http://localhost').pathname);
  } catch {
    sendError(response, 400, 'bad request');
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  const file = resolve(join(appRoot, normalize(path)));
  if (file !== appRoot && !file.startsWith(appRoot + sep)) {
    sendError(response, 403, 'forbidden');
    return;
  }
  let size;
  try {
    const info = statSync(file);
    if (!info.isFile()) throw new Error('not a file');
    size = info.size;
  } catch {
    sendError(response, 404, 'not found');
    return;
  }
  response.writeHead(200, {
    'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'content-length': size,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(response);
}).on('error', (err) => {
  console.error('server error: ' + err.message);
  process.exit(1);
}).listen(port, '127.0.0.1', () => {
  console.log('Japan in Numbers is on http://localhost:' + port);
});
