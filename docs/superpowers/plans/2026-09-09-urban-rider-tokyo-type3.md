# URBAN RIDER TOKYO TYPE3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Subagents are disabled by user request. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish one TYPE3 collection index and six responsive collection storefront pages without modifying TYPE2.

**Architecture:** A dependency-free Node.js build reads normalized collection, product, and asset data, then writes seven static HTML pages. One shared CSS file owns the TYPE3 visual system and responsive rules; one progressive-enhancement JavaScript file owns crossfades, dialogs, pointer effects, and page transitions.

**Tech Stack:** Node.js 20+, semantic HTML, native CSS Grid, vanilla JavaScript, responsive WebP images, GitHub Actions Pages deployment.

## Global Constraints

- Work only in `URBAN-RIDER-TOKYO-TYPE3`; do not modify or push TYPE2.
- Use only supplied TOP, collection, and T-shirt images.
- Use `#251c35`, `#d6c9ed`, and `#d9ff52`; no gradients, glow, or shadows.
- Preserve seven stable URLs: `/` plus `/collections/{bike,animal,gakusei,army,dokuro,brand}/`.
- Preserve all 99 workbook-derived products, tax-inclusive prices, and SUZURI URLs.
- Use per-placement crop positions; product images use containment.
- Implement B04, C02, I02, I09, G05, G10, C09, U08, U09, U13, and N07 with touch and reduced-motion fallbacks.
- Mobile product cards use one column and collection imagery has capped height.
- Do not use subagents.

---

### Task 1: Seed the TYPE3 repository with validated data and assets

**Files:**
- Create: `package.json`
- Create: `src/collections.mjs`
- Create: `src/products.json`
- Create: `src/assets.json`
- Create: `public/images/*`
- Create: `public/fonts/*`
- Create: `scripts/verify.mjs`

**Interfaces:**
- Consumes: supplied source assets and workbook-normalized data from the local URT source workspace.
- Produces: `collections`, product records `{id,brand,name,number,price,url,image,sourceRow}`, and asset records used by the builder.

- [ ] **Step 1: Copy normalized source data and optimized image/font assets from the existing local source workspace**

Run PowerShell `Copy-Item` with explicit source and destination paths. Copy only `src/products.json`, `src/assets.json`, `src/asset-manifest.json`, `src/data-corrections.json`, `public/images`, and selected locally hosted fonts.

- [ ] **Step 2: Add the package scripts**

```json
{
  "name": "urban-rider-tokyo-type3",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "build": "node scripts/build.mjs",
    "check": "node --check public/app.js && node --check scripts/build.mjs && node scripts/verify.mjs"
  }
}
```

- [ ] **Step 3: Add collection copy and display settings**

Define six entries with stable slug, number, display name, lowercase masthead, Japanese tagline, concept heading, concept body, captions, and crop positions.

- [ ] **Step 4: Write the validation assertions**

```js
assert.equal(products.length, 99);
assert.deepEqual(Object.fromEntries(counts), {
  animal: 18, army: 5, bike: 49, brand: 8, dokuro: 3, gakusei: 16
});
assert.equal(products.filter(p => !p.url || !p.price || !p.image).length, 0);
```

- [ ] **Step 5: Run the validation and commit**

Run: `npm run build && npm run check`

Expected: seven pages generated, 99 products verified, no missing local image.

Commit: `git commit -m "Seed TYPE3 catalog data and assets"`

### Task 2: Build the semantic seven-page document generator

**Files:**
- Create: `scripts/build.mjs`
- Create: `public/favicon.svg`
- Test: `scripts/verify.mjs`

**Interfaces:**
- Consumes: `collections`, `products.json`, and `assets.json`.
- Produces: `dist/index.html`, six `dist/collections/<slug>/index.html` pages, and `dist/404.html`.

- [ ] **Step 1: Extend verification with output tests before creating the builder**

```js
for (const slug of ['bike','animal','gakusei','army','dokuro','brand']) {
  assert.ok(await exists(`dist/collections/${slug}/index.html`));
}
assert.match(await read('dist/index.html'), /GRAPHIC T-SHIRT SHOP/);
```

- [ ] **Step 2: Run the test to verify the missing builder fails**

Run: `npm run check`

Expected: FAIL because generated HTML does not exist.

- [ ] **Step 3: Implement shared HTML helpers**

Create escaping, responsive image, slideshow, menu, footer, lightbox, and document-shell functions. Navigation and purchase links must work without JavaScript.

- [ ] **Step 4: Implement TOP markup**

Generate six paired collection rows in the required order. Each row includes the number panel, collection name, Japanese copy, lime arrow, and corresponding TOP-folder image field. Render the sixth visual as the lime wordmark field.

- [ ] **Step 5: Implement collection-page markup**

Generate the wide title, 18:62:20 hero, concept band, two-image editorial gallery, data-driven product grid, and footer. Bind every product CTA directly to its workbook-derived URL.

- [ ] **Step 6: Build and verify HTML, then commit**

Run: `npm run build && npm run check`

Expected: `Built 7 pages / 99 products` followed by verification success.

Commit: `git commit -m "Build TYPE3 storefront pages"`

### Task 3: Implement the TYPE3 responsive visual system

**Files:**
- Create: `public/styles.css`
- Test: `scripts/verify.mjs`

**Interfaces:**
- Consumes: semantic classes emitted by `scripts/build.mjs`.
- Produces: the complete dark purple, lavender, and lime layout from 320px mobile through desktop.

- [ ] **Step 1: Add CSS token assertions to verification**

```js
for (const token of ['#251c35', '#d6c9ed', '#d9ff52']) assert.ok(css.includes(token));
for (const banned of ['linear-gradient(', 'radial-gradient(', 'box-shadow:']) assert.ok(!css.includes(banned));
```

- [ ] **Step 2: Implement tokens, typography, focus states, and radius rules**

Self-host Bungee for the wide display role and use a readable Japanese Gothic system stack. Define card radii, capsule buttons, lime focus outlines, and image aspect-ratio reservations.

- [ ] **Step 3: Implement TOP desktop and mobile layouts**

Use `grid-template-columns: minmax(0, 39fr) minmax(0, 61fr)` above 900px. Below 900px, each row becomes a paired compact block with an image height cap. Below 560px, scale numbers and names with `clamp()`.

- [ ] **Step 4: Implement collection hero, concept, gallery, product, and footer layouts**

Use `18fr 62fr 20fr` for the hero above 980px, controlled two-column gallery and product grids, and single-column products below 760px. Keep product media contained and details readable beside it where width permits.

- [ ] **Step 5: Build, verify tokens and responsive rules, then commit**

Run: `npm run build && npm run check`

Expected: PASS with no forbidden gradients or shadows.

Commit: `git commit -m "Style TYPE3 responsive storefront"`

### Task 4: Add progressive interactions and accessibility

**Files:**
- Create: `public/app.js`
- Test: `scripts/verify.mjs`

**Interfaces:**
- Consumes: `data-slides`, `data-lightbox`, `data-transition`, and `data-cursor` attributes.
- Produces: pausable crossfades, accessible lightbox/menu, fine-pointer effects, and reduced-motion fallbacks.

- [ ] **Step 1: Add interaction-source assertions**

```js
for (const hook of ['matchMedia', 'prefers-reduced-motion', 'showModal', 'Escape']) {
  assert.ok(app.includes(hook));
}
assert.ok(!app.includes("addEventListener('scroll'"));
```

- [ ] **Step 2: Implement B04 crossfades**

Use one timer per slideshow, pause buttons, visibility-aware suspension, and an immediate static state under reduced motion.

- [ ] **Step 3: Implement G05, C02, and N07 dialogs and transitions**

Open gallery/product images in the shared lightbox, restore focus on close, close with Escape, and use a circular page-cover transition while preserving the link destination.

- [ ] **Step 4: Implement pointer-only G10, U08, U09, and U13 feedback**

Enable only when `(hover: hover) and (pointer: fine)` and reduced motion is off. Use transform and opacity only. Bound and remove trail and shockwave nodes after animation.

- [ ] **Step 5: Implement I02, I09, and C09 visual feedback**

Draw collection-name outlines on entry, reveal product images with a restrained torn edge, and apply one short wobble to purchase controls on hover or activation.

- [ ] **Step 6: Run checks and commit**

Run: `npm run build && npm run check`

Expected: PASS, with no scroll event listener and all accessibility hooks present.

Commit: `git commit -m "Add accessible TYPE3 interactions"`

### Task 5: Visual QA, publishing, and live verification

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Create: `blenci-selection.json`
- Modify: visual and interaction files only for confirmed QA defects.

**Interfaces:**
- Consumes: completed `dist` build.
- Produces: GitHub Pages deployment and verified public URL.

- [ ] **Step 1: Add GitHub Pages workflow**

Use `actions/checkout@v4`, `actions/setup-node@v4`, `npm run build`, `actions/upload-pages-artifact@v3`, and `actions/deploy-pages@v4`, with Pages write and id-token permissions.

- [ ] **Step 2: Record implemented BLENCI IDs and project usage**

Write `blenci-selection.json` with catalog commit `5934e9e40bcea73cc4a77195346c07a112f6f127`, the implemented layouts, gimmicks, and fonts only.

- [ ] **Step 3: Run local desktop and mobile visual review**

Review TOP plus every collection page at desktop width and at 390px. Check subject visibility, heading fit, product containment, one-column mobile products, menu, lightbox, and purchase link targets.

- [ ] **Step 4: Run the final pre-flight checks**

Run: `npm run build && npm run check`

Expected: seven pages, 99 products, no missing data or assets, and clean syntax.

Search visible output for em/en dashes and forbidden styling. Confirm the parent TYPE2 repository has no tracked changes.

- [ ] **Step 5: Commit and push TYPE3 only**

Commit: `git commit -m "Configure TYPE3 GitHub Pages deployment"`

Run: `git remote -v` and confirm every URL contains `URBAN-RIDER-TOKYO-TYPE3` before `git push -u origin main`.

- [ ] **Step 6: Verify deployment**

Wait for the Pages workflow, open the deployed URL, and verify that the TOP page, one collection page, a product image, and a purchase URL load successfully.
