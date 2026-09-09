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
