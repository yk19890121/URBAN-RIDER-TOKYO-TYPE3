import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
if (!fs.existsSync(path.join(dist, 'index.html'))) execFileSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { stdio: 'inherit' });
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.ttf': 'font/ttf', '.svg': 'image/svg+xml' };

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
  const target = path.resolve(dist, `.${relative}`);
  if (!target.startsWith(dist)) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  fs.readFile(target, (error, data) => {
    if (error) {
      fs.readFile(path.join(dist, '404.html'), (notFoundError, notFound) => {
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(notFoundError ? 'Not found' : notFound);
      });
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache' }).end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`URT TYPE3: http://127.0.0.1:${port}`));
