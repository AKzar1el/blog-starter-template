import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { createClient } from '@libsql/client';

// The smoke test uses its own disposable database and synthetic credentials.
// It never reads or modifies the deployed database.
const db = `template-check-${randomUUID()}.db`;
const url = `file:${db}`;
const key = randomUUID();
const listener = createServer();
await new Promise((resolve, reject) => {
  listener.once('error', reject);
  listener.listen(0, '127.0.0.1', resolve);
});
const port = listener.address().port;
await new Promise(resolve => listener.close(resolve));
const base = `http://127.0.0.1:${port}`;
const env = {
  ...process.env,
  NODE_ENV: 'production',
  TURSO_DATABASE_URL: url,
  TURSO_AUTH_TOKEN: '',
  API_KEY: key,
  NEXT_PUBLIC_SITE_URL: base,
  NEXT_PUBLIC_SITE_NAME: 'Template smoke test',
  NEXT_PUBLIC_GA_ID: '',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: '',
  NEXT_TELEMETRY_DISABLED: '1',
};
let server;
function run(script, args, timeout = 180_000) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], { env, stdio: 'inherit', timeout });
    child.once('error', reject);
    child.once('exit', (code, signal) => code === 0 ? resolve() : reject(new Error(`${script} exited ${code ?? signal}`)));
  });
}
async function check(path, status, options) {
  const response = await fetch(base + path, { ...options, signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, status, `${path}: expected ${status}`);
  console.log(`PASS ${options?.method ?? 'GET'} ${path} (${status})`);
  return response;
}
const json = (body, authorized = false) => ({ method: 'POST', headers: { 'content-type': 'application/json', ...(authorized ? { 'x-api-key': key } : {}) }, body: JSON.stringify(body) });

try {
  await run('node_modules/tsx/dist/cli.mjs', ['scripts/init-db.ts']);
  await run('node_modules/tsx/dist/cli.mjs', ['scripts/init-db.ts']);
  const client = createClient({ url });
  try {
    const { rows } = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('posts', 'comments', 'newsletter_emails') ORDER BY name");
    assert.deepEqual(rows.map(row => row.name), ['comments', 'newsletter_emails', 'posts']);
    console.log('PASS fresh schema and idempotent initialization');
  } finally {
    client.close();
  }

  await run('node_modules/next/dist/bin/next', ['build'], 240_000);
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], { env, stdio: 'inherit' });
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt++) {
    if (server.exitCode !== null) break;
    try {
      const response = await fetch(base + '/', { signal: AbortSignal.timeout(2000) });
      if (response.status === 200) { ready = true; break; }
    } catch { /* startup may not be finished */ }
    await delay(500);
  }
  assert.ok(ready, 'Local production server did not become ready');
  const post = { title: 'Template fixture', slug: 'template-fixture', content: '# Test article\n\nSynthetic content only.', excerpt: 'Template fixture', author: 'Test', tags: ['fixture'] };
  await check('/api/posts', 401, json(post));
  await check('/api/posts', 201, json(post, true));
  const article = await check('/blog/template-fixture', 200);
  assert.match(await article.text(), /Template fixture/);
  await check('/blog?page=1', 200);
  await check('/blog?page=bad', 200);
  const search = await check('/search?q=Template', 200);
  assert.match(await search.text(), /Template fixture/);
  await check('/feed', 200);
  await check('/sitemap.xml', 200);
  await check('/api/comments?postSlug=template-fixture', 200);
  const comment = await (await check('/api/comments', 201, json({ postSlug: 'template-fixture', content: 'Synthetic test comment' }))).json();
  assert.ok(Number.isSafeInteger(comment.id));
  await check(`/api/comments/${comment.id}/like`, 200, { method: 'POST' });
  await check('/api/comments/not-a-number/like', 400, { method: 'POST' });
  await check('/api/newsletter', 201, json({ email: 'smoke@example.invalid' }));
  await check('/api/newsletter', 409, json({ email: 'smoke@example.invalid' }));
  console.log('PASS isolated production template smoke test');
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise(resolve => server.once('exit', resolve));
    server.kill();
    await Promise.race([exited, delay(5000)]);
  }
  for (const suffix of ['', '-journal', '-wal', '-shm']) {
    for (let attempt = 0; attempt < 10; attempt++) {
      try {
        await rm(db + suffix, { force: true });
        break;
      } catch (error) {
        if (!['EBUSY', 'EPERM'].includes(error.code) || attempt === 9) {
          console.error(`Could not remove disposable fixture ${db + suffix}: ${error.code}`);
          process.exitCode = 1;
          break;
        }
        await delay(500);
      }
    }
  }
}
