import fs from 'node:fs/promises';
import path from 'node:path';
import { collections } from '../src/collections.mjs';

const root = path.resolve(import.meta.dirname, '..');
const assets = JSON.parse(await fs.readFile(path.join(root, 'src/assets.json'), 'utf8'));
const products = JSON.parse(await fs.readFile(path.join(root, 'src/products.json'), 'utf8'));
const out = path.join(root, 'dist');

const esc = value => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const yen = value => `¥${Number(value).toLocaleString('ja-JP')}`;
const href = (prefix, slug) => `${prefix}collections/${slug}/`;
const arrow = '<span class="arrow" aria-hidden="true">→</span>';

function image(src, prefix, alt, { className = '', position = '50% 50%', priority = false, contain = false } = {}) {
  const small = src.replace('.webp', '-640.webp');
  return `<img class="${className}${contain ? ' image-contain' : ''}" src="${prefix}${src}" srcset="${prefix}${small} 640w, ${prefix}${src} 1400w" sizes="(max-width: 760px) 96vw, 70vw" alt="${esc(alt)}" width="1200" height="900" style="--object-position:${position}" decoding="async" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
}

function slideshow(files, prefix, alt, positions, priority = false) {
  const slides = files.map((src, index) => ({ src: `${prefix}${src}`, position: positions[index] || '50% 50%' }));
  return `<div class="slideshow" data-slides="${esc(JSON.stringify(slides))}">${image(files[0], prefix, alt, { className: 'slide is-active', position: positions[0], priority })}<img class="slide slide-next" alt="" aria-hidden="true" width="1200" height="900" decoding="async"><span class="image-fallback" aria-hidden="true">${esc(alt)}</span></div>`;
}

function menu(prefix, current = '') {
  return `<button class="menu-toggle" type="button" aria-label="コレクションメニューを開く" aria-expanded="false" aria-controls="collection-menu"><span>MENU</span><i aria-hidden="true"></i></button>
  <dialog class="nav-dialog" id="collection-menu" aria-label="コレクションメニュー">
    <div class="nav-head"><a href="${prefix}" class="wordmark">URBAN RIDER TOKYO</a><button type="button" class="menu-close" aria-label="メニューを閉じる">CLOSE ×</button></div>
    <nav aria-label="コレクション一覧">${collections.map(c => `<a href="${href(prefix, c.slug)}" data-transition ${current === c.slug ? 'aria-current="page"' : ''}><span>${c.number}</span><strong>${c.name}</strong>${arrow}</a>`).join('')}</nav>
    <p>好きな絵を選ぶ。好きな一枚で、街へ出る。</p>
  </dialog>`;
}

function footer(prefix, collection) {
  const brand = collection?.short || 'URBAN RIDER TOKYO';
  return `<footer class="site-footer"><div><a class="footer-mark" href="${prefix}">URBAN<br>RIDER TOKYO</a><p>${collection ? collection.tagline : '都市を駆ける、自由な魂へ。'}</p></div><nav aria-label="フッターナビゲーション"><a href="${prefix}">TOP</a><a href="#gallery">GALLERY</a><a href="#products">T-SHIRTS</a><a href="https://suzuri.jp/URBAN_RIDER_TOKYO" target="_blank" rel="noopener noreferrer">ONLINE STORE</a></nav><div class="footer-meta"><span>${esc(brand)} COLLECTION</span><span>GRAPHIC T-SHIRT SHOP</span><span>© ${new Date().getFullYear()} URBAN RIDER TOKYO</span></div></footer>`;
}

function shell(content, { prefix = '', collection = null } = {}) {
  const title = collection ? `${collection.name} | URBAN RIDER TOKYO` : 'URBAN RIDER TOKYO | GRAPHIC T-SHIRT SHOP';
  const description = collection ? collection.concept : '都市を駆ける、自由な魂へ。6つのコレクションから選ぶ、東京発のグラフィックTシャツショップ。';
  return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#251c35"><meta name="description" content="${esc(description)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="website"><title>${esc(title)}</title><link rel="icon" href="${prefix}favicon.svg" type="image/svg+xml"><link rel="preload" href="${prefix}fonts/Bungee-Regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="${prefix}styles.css"><script type="module" src="${prefix}app.js"></script></head><body class="${collection ? `brand-page brand-${collection.slug}` : 'home-page'}" id="top"><a class="skip-link" href="#main">本文へスキップ</a>${content}<dialog class="lightbox" aria-label="画像の拡大表示"><button type="button" class="lightbox-close" aria-label="拡大表示を閉じる">CLOSE ×</button><figure><img class="lightbox-image" alt=""><figcaption><p></p><a class="lightbox-buy" target="_blank" rel="noopener noreferrer">購入する ${arrow}</a></figcaption></figure></dialog><div class="page-cover" aria-hidden="true"></div><div class="pointer-mark" aria-hidden="true"><span>VIEW</span></div><div class="fx-layer" aria-hidden="true"></div></body></html>`;
}

function titleDraw() {
  return '<svg class="title-draw" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10 C22 2 73 2 98 8" pathLength="1"/></svg>';
}

function homeRow(collection) {
  const a = assets[collection.slug];
  const visual = collection.slug === 'brand'
    ? `<div class="collection-identity"><strong>URBAN RIDER<br>TOKYO</strong><span>都市を駆ける、<br>自由な魂へ。</span></div>`
    : slideshow(a.top, '', `${collection.name}のイメージ`, collection.crop, collection.slug === 'bike');
  return `<article class="collection-row collection-${collection.slug}"><a class="collection-panel" href="${href('', collection.slug)}" data-transition data-cursor="OPEN"><span class="collection-number">${collection.number}</span><div class="collection-name"><h2>${collection.name}</h2>${titleDraw()}<p>${collection.japanese}</p></div><span class="round-arrow" aria-hidden="true">→</span></a><a class="collection-visual" href="${href('', collection.slug)}" data-transition data-expand data-cursor="OPEN" aria-label="${esc(collection.name)}を見る">${visual}<span class="visual-copy">${esc(collection.tagline)}</span></a></article>`;
}

function home() {
  return shell(`<div class="site-shell"><header class="top-header"><div><a class="top-logo" href="#top">URBAN<br>RIDER TOKYO</a><span>GRAPHIC T-SHIRT SHOP</span></div><h1>都市を駆ける、<br>自由な魂へ。</h1><p>東京のスピードと、自由に生きる気分を一枚に。6つのコレクションから、今日のTシャツを選ぼう。</p>${menu('')}</header><main id="main"><section class="collection-index" aria-label="6つのTシャツコレクション">${collections.map(homeRow).join('')}</section><section class="shop-statement"><p>ART. BIKE. ANIMAL. MILITARY. SKULL. AND YOU.</p><strong>好きなもので、どこまでも。</strong><a href="https://suzuri.jp/URBAN_RIDER_TOKYO" target="_blank" rel="noopener noreferrer">Tシャツを購入する ${arrow}</a></section></main>${footer('', null)}</div>`);
}

function productName(product, collection) {
  if (/^\d+$/.test(product.number)) return `${collection.short} TEE ${product.number}`;
  return product.number.replace('dokuro_', 'DOKURO ').replaceAll('_', ' / ');
}

function productCard(product, collection, prefix, index) {
  const name = productName(product, collection);
  return `<article class="product-card" data-product-index="${index}"><button type="button" class="product-image torn-reveal" data-lightbox="${prefix}${product.image}" data-caption="${esc(name)} / ${yen(product.price)} 税込" data-url="${esc(product.url)}" data-cursor="ZOOM" aria-label="${esc(name)}の画像を拡大">${image(product.image, prefix, name, { contain: true })}<span aria-hidden="true">＋</span></button><div class="product-info"><span class="product-no">${String(index + 1).padStart(2, '0')}</span><h3>${esc(name)}</h3><p>${yen(product.price)} <small>税込</small></p><a class="buy-button" href="${esc(product.url)}" target="_blank" rel="noopener noreferrer" data-wobble aria-label="${esc(name)}を購入する。SUZURIが新しいタブで開きます">購入する ${arrow}</a></div></article>`;
}

function brandPage(collection) {
  const prefix = '../../';
  const a = assets[collection.slug];
  const heroFiles = collection.slug === 'brand' ? [...a.top, ...a.art] : a.art.slice(0, 3);
  const galleryFiles = collection.slug === 'brand' ? a.art : a.art.slice(3, 5);
  const collectionProducts = products.filter(p => p.brand === collection.slug);
  const heroPositions = heroFiles.map((_, index) => collection.crop[index] || '50% 50%');
  return shell(`<div class="site-shell"><header class="brand-header"><a class="brand-logo" href="${prefix}" data-transition>URBAN RIDER TOKYO</a><nav aria-label="ページ内ナビゲーション"><a href="#concept">ABOUT</a><a href="#gallery">GALLERY</a><a href="#products">T-SHIRTS</a></nav>${menu(prefix, collection.slug)}</header><main id="main"><section class="brand-title"><h1>${esc(collection.masthead)}</h1>${titleDraw()}</section><section class="brand-hero"><aside class="hero-notes"><span>AFTER HOURS<br>DIGITAL CULTURE<br>FOR A BRIGHTER<br>TOMORROW</span><strong>${esc(collection.tagline)}</strong><small>${collection.short}<br>COLLECTION<br>TOKYO</small></aside><div class="hero-media">${slideshow(heroFiles, prefix, `${collection.name} キービジュアル`, heroPositions, true)}<button type="button" class="motion-toggle" aria-pressed="false" aria-label="画像の自動切替を一時停止">Ⅱ</button><span class="slide-count">01 / ${String(heroFiles.length).padStart(2, '0')}</span></div><aside class="hero-copy"><p>${collection.side.map(esc).join('<br>')}</p><span>${collection.short}<br>COLLECTION<br>TOKYO</span><small>RIDE A BRIGHTER TOMORROW.</small></aside></section><section class="concept-band" id="concept"><div><h2>${esc(collection.heading)}</h2><p>${esc(collection.concept)}</p></div><aside><strong>${collection.short}<br>COLLECTION</strong><span>${esc(collection.english)}</span></aside></section><section class="editorial-gallery" id="gallery" aria-label="${collection.short}アートギャラリー">${galleryFiles.map((src, index) => `<figure class="gallery-item gallery-${index + 1}"><span class="gallery-number">0${index + 1}</span><button type="button" data-lightbox="${prefix}${src}" data-caption="${esc(collection.captions[index])}" data-cursor="VIEW" aria-label="${esc(collection.captions[index])}を拡大">${image(src, prefix, collection.captions[index], { position: collection.crop[index + 3] || '50% 50%' })}<span aria-hidden="true">＋</span></button><figcaption><strong>${esc(collection.captions[index])}</strong><small>${esc(collection.galleryText[index])}</small></figcaption></figure>`).join('')}</section><section class="product-section" id="products"><header><h2>${collection.short}<br>COLLECTION</h2><p>好きなものを、着て、どこへでも。</p><span>${String(collectionProducts.length).padStart(2, '0')} ITEMS</span></header><div class="product-grid" data-product-grid data-page-size="6">${collectionProducts.map((p, index) => productCard(p, collection, prefix, index)).join('')}</div>${collectionProducts.length > 6 ? `<button type="button" class="load-more">もっと見る <span>＋</span></button>` : ''}<p class="shop-note">購入とサイズ選択はSUZURIの商品ページで行えます。表示価格は税込です。</p></section><section class="next-collection"><span>NEXT COLLECTION</span><a href="${href(prefix, collections[(collections.indexOf(collection) + 1) % collections.length].slug)}" data-transition>${collections[(collections.indexOf(collection) + 1) % collections.length].name} ${arrow}</a></section></main>${footer(prefix, collection)}</div>`, { prefix, collection });
}

await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
await fs.cp(path.join(root, 'public'), out, { recursive: true });
await fs.writeFile(path.join(out, 'index.html'), home());
for (const collection of collections) {
  const folder = path.join(out, 'collections', collection.slug);
  await fs.mkdir(folder, { recursive: true });
  await fs.writeFile(path.join(folder, 'index.html'), brandPage(collection));
}
await fs.writeFile(path.join(out, '404.html'), '<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ページが見つかりません</title><body style="font-family:sans-serif;padding:10vw;background:#251c35;color:#d9ff52"><h1>PAGE NOT FOUND</h1><p>お探しのページは見つかりませんでした。</p><a style="color:#d6c9ed" href="./">TOPへ戻る</a></body></html>');
console.log(`Built 7 pages / ${products.length} products. Output: dist/`);
