import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHandler } from '../server/room-service.mjs';
import { LocalStore } from '../server/local-store.mjs';

const root = resolve(fileURLToPath(new URL('../public/', import.meta.url)));
const handler = createHandler(new LocalStore(fileURLToPath(new URL('../.local-data/', import.meta.url))));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.js': 'text/javascript', '.wasm': 'application/wasm', '.mp3': 'audio/mpeg', '.css': 'text/css' };
createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://' + req.headers.host);
    if (url.pathname === '/.netlify/functions/kelas') {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const response = await handler(new Request(url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined }));
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
      return;
    }
    const path = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
    const bytes = await readFile(path);
    const headers = { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Accept-Ranges': 'bytes' };
    // Audio cues need byte ranges so a browser can seek to the requested instruction.
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]), end = Math.min(range[2] ? Number(range[2]) : bytes.length - 1, bytes.length - 1);
      if (start >= bytes.length || end < start) { res.writeHead(416, { 'Content-Range': 'bytes */' + bytes.length }); res.end(); return; }
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${bytes.length}`, 'Content-Length': end - start + 1 });
      res.end(req.method === 'HEAD' ? undefined : bytes.subarray(start, end + 1));
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': bytes.length });
      res.end(req.method === 'HEAD' ? undefined : bytes);
    }
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log('Joran Minda: http://127.0.0.1:' + port));
