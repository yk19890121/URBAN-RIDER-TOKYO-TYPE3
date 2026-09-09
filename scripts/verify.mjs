import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { collections } from '../src/collections.mjs';

const root = path.resolve(import.meta.dirname, '..');
const products = JSON.parse(await fs.readFile(path.join(root, 'src/products.json'), 'utf8'));
const assets = JSON.parse(await fs.readFile(path.join(root, 'src/assets.json'), 'utf8'));
const read = relative => fs.readFile(path.join(root, relative), 'utf8');
const exists = async relative => fs.access(path.join(root, relative)).then(() => true, () => false);

assert.equal(products.length, 99, 'Workbook product count changed');
const counts = Object.fromEntries([...new Set(products.map(p => p.brand))].sort().map(brand => [brand, products.filter(p => p.brand === brand).length]));
assert.deepEqual(counts, { animal: 18, army: 5, bike: 49, brand: 8, dokuro: 3, gakusei: 16 });
assert.equal(products.filter(p => !p.url || !p.price || !p.image).length, 0, 'Product data has required-field gaps');
assert.equal(new Set(products.map(p => p.id)).size, products.length, 'Product IDs must be unique');

for (const product of products) {
  assert.match(product.url, /^https:\/\/suzuri\.jp\/URBAN_RIDER_TOKYO\//, `Unexpected purchase URL: ${product.id}`);
  assert.ok(await exists(path.join('public', product.image)), `Missing product image: ${product.image}`);
  assert.ok(await exists(path.join('public', product.image.replace('.webp', '-640.webp'))), `Missing responsive product image: ${product.image}`);
}

for (const collection of collections) {
  assert.ok(assets[collection.slug], `Missing asset group: ${collection.slug}`);
  const pagePath = `dist/collections/${collection.slug}/index.html`;
  assert.ok(await exists(pagePath), `Missing collection page: ${collection.slug}`);
  const html = await read(pagePath);
  const expected = counts[collection.slug];
  assert.equal((html.match(/class="product-card"/g) || []).length, expected, `Wrong product count on ${collection.slug}`);
  assert.match(html, new RegExp(`<h1>${collection.masthead.replace(' ', '\\s')}</h1>`), `Missing masthead: ${collection.slug}`);
  for (const product of products.filter(p => p.brand === collection.slug)) assert.ok(html.includes(product.url), `Missing purchase link: ${product.id}`);
  assert.ok(!/[—–]/.test(html), `Forbidden dash in visible output: ${collection.slug}`);
}

const home = await read('dist/index.html');
assert.match(home, /GRAPHIC T-SHIRT SHOP/);
assert.equal((home.match(/class="collection-row /g) || []).length, 6);
for (const collection of collections) assert.ok(home.includes(`collections/${collection.slug}/`), `Missing TOP link: ${collection.slug}`);

const css = await read('public/styles.css');
for (const token of ['#251c35', '#d6c9ed', '#d9ff52']) assert.ok(css.includes(token), `Missing color token ${token}`);
for (const banned of ['linear-gradient(', 'radial-gradient(', 'box-shadow:']) assert.ok(!css.includes(banned), `Forbidden visual effect: ${banned}`);
for (const query of ['max-width:900px', 'max-width:700px', 'prefers-reduced-motion:reduce']) assert.ok(css.includes(query), `Missing responsive rule: ${query}`);

const app = await read('public/app.js');
for (const hook of ['matchMedia', 'prefers-reduced-motion', 'showModal', 'Escape', 'IntersectionObserver']) assert.ok(app.includes(hook), `Missing interaction hook: ${hook}`);
assert.ok(!app.includes("addEventListener('scroll'"), 'Scroll event listeners are not allowed');

console.log('Verified 7 pages, 99 products, responsive assets, links, tokens and interaction fallbacks.');
