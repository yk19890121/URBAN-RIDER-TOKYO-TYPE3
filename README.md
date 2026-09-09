# URBAN RIDER TOKYO TYPE3

Static storefront presentation for the six URBAN RIDER TOKYO T-shirt collections.

## Local preview

```powershell
npm run build
npm run check
npm run dev
```

Open `http://127.0.0.1:4173`.

## Structure

- `src/collections.mjs`: collection copy and crop direction
- `src/products.json`: normalized workbook product, price, and SUZURI link data
- `src/assets.json`: supplied image selection
- `scripts/build.mjs`: seven-page static generator
- `public/styles.css`: TYPE3 responsive visual system
- `public/app.js`: progressive interactions and accessibility

GitHub Actions builds and deploys `dist/` to GitHub Pages after a push to `main`.
## 2026-09 画像・遷移改修

- `src/assets.json` は `top` / `hero` / `gallery` の3スロット。選定画像は `scripts/remap_assets.py` で元PNGからWebPと640px版へ変換します。
- コレクションページのギャラリーは横スクロール、非トリミング、ホバー拡大、クリック時ライトボックス。BRANDページにはギャラリーを出力しません。
- TOPから各ブランドページへは、クリック位置から広がるN07円形リビールで遷移します。`prefers-reduced-motion` では通常遷移です。
- 画像使用箇所は `node scripts/image_usage.mjs` で `docs/image-usage.md` に生成します。商品99点、価格、SUZURI購入URLは変更しません。
