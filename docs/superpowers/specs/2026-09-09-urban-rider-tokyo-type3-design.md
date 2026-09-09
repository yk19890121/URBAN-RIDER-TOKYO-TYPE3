# URBAN RIDER TOKYO TYPE3 design

## Goal

Build a seven-page static storefront presentation for URBAN RIDER TOKYO: one collection index and six collection pages. The site makes the T-shirt offering immediately clear, lets visitors choose a collection from the first page, and hands purchases off to the supplied SUZURI URLs.

TYPE2 remains untouched. All implementation, commits, publishing configuration, and deployment occur only in the `URBAN-RIDER-TOKYO-TYPE3` repository.

## Audience and design read

The audience is design-conscious streetwear customers who respond to indie music, youth culture, self-published media, illustration, and Tokyo street life. The tone is playful and casual. It avoids both aggressive biker styling and generic futuristic cyber styling.

Design dials:

- `DESIGN_VARIANCE: 8`: strongly asymmetric, but with clear correspondence between labels and images.
- `MOTION_INTENSITY: 6`: visible interaction and transitions without continuous spectacle.
- `VISUAL_DENSITY: 5`: enough product and editorial content to feel like a shop, with controlled spacing.

## Visual system

- Page background: `#251c35`.
- Primary light surface: `#d6c9ed`.
- Accent and primary CTA: `#d9ff52`.
- Text on light surfaces: `#251c35`.
- No gradients, outer glow, glass effects, or drop shadows.
- Display type uses a wide, rounded, heavy geometric face. Japanese body copy uses a readable Gothic fallback.
- Large surfaces use a 32-56px radius. Product cards use the same proportional radius system. Purchase buttons are capsules.
- The site remains in one dark visual theme. Lavender and lime are content surfaces within that theme, not separate light-mode sections.

## Information architecture

- `/`: TOP collection index.
- `/collections/bike/`
- `/collections/animal/`
- `/collections/gakusei/`
- `/collections/army/`
- `/collections/dokuro/`
- `/collections/brand/`

These paths remain stable. All purchase CTAs open their Excel-supplied SUZURI URL in a new tab.

## TOP page

Desktop uses a 39:61 two-column composition. Six aligned rows connect a lavender index panel on the left with a large image field on the right. Each left panel includes the collection number, name, Japanese label or short description, and a lime circular arrow control. Each image field uses only assets supplied in the TOP folder.

The order is BIKE, ANIMAL DESIGN, GAKUSEI, ARMY, DOKURO, and URBAN RIDER TOKYO BRAND. The sixth image field becomes a large lime brand panel with an oversized dark wordmark.

The masthead states `URBAN RIDER TOKYO`, `GRAPHIC T-SHIRT SHOP`, and `都市を駆ける、自由な魂へ。` so the commercial purpose is clear before interaction.

On mobile, each collection becomes a compact paired unit. The label remains visually tied to its image, image height is capped, and type scales with the viewport. The design must not turn into seven consecutive full-screen images.

## Collection pages

All six pages share a data-driven component structure but vary in image selection, crop position, copy, image rhythm, and minor surface proportions.

The header is no more than 80px tall on desktop. It carries the lime URBAN RIDER TOKYO identity, compact navigation, and the fullscreen collection menu.

Below the header, the collection name appears in lowercase or collection-appropriate wide display lettering across the viewport. The hero uses an approximately 18:62:20 layout: editorial notes on the left, a large rounded crossfading image in the center, and a lime copy panel on the right.

The concept is a full-width lavender band with a strong Japanese heading, short body copy, and compact supporting information. The gallery uses two offset image areas and clear `01` and `02` outline numerals. Gallery images are chosen only from the matching collection folder.

The product section is a two-column grid on desktop and one column on mobile. Each card uses a lavender horizontal layout, with the product image occupying about 60 percent and product details about 40 percent. Product name, tax-inclusive price, and purchase CTA come from the supplied workbook data. Product images come only from the T-shirt folder.

The footer keeps the page background, with the lime identity on the left and small navigation and collection copy on the right.

## Collection copy direction

- BIKE: everyday rides, detours, city freedom, and a relaxed pace.
- ANIMAL: odd companions, music, humor, and self-expression.
- GAKUSEI: after-school freedom, curiosity, and youthful momentum.
- ARMY: utility details softened by humor and everyday courage.
- DOKURO: bold art, playful defiance, and lighthearted skull imagery.
- BRAND: Tokyo energy and a casual identity for riders and non-riders alike.

Copy stays direct and concrete. It does not use fabricated statistics, generic AI-marketing phrases, or inaccessible decorative text.

## Data and assets

The supplied workbook contains 99 products: BIKE 49, ANIMAL 18, GAKUSEI 16, ARMY 5, DOKURO 3, and BRAND 8. Prices range from ¥4,378 to ¥7,337. Every record has a purchase URL and price.

The build reads normalized product JSON generated from the workbook. Each record retains its source row, image filename, brand assignment, tax-inclusive price, and purchase URL. A verification script checks counts, missing fields, image existence, page output, and link wiring.

Images are converted to responsive WebP variants. Crop positions are configured per placement so the primary subject remains visible. Product photography uses contain-style presentation rather than destructive cropping.

## BLENCI LAB implementation

- `L28`: TOP 39:61 composition and collection hero asymmetry.
- `L09`: product grid, adapted into two-column editorial commerce cards.
- `C02`: TOP collection selection expands into the destination transition; gallery imagery expands into a lightbox.
- `B04`: TOP and collection hero background crossfade.
- `I02`: collection-name line drawing and outline reveal.
- `I09`: restrained torn-paper reveal for T-shirt imagery.
- `G05`: keyboard-accessible lightbox.
- `G10`: fine-pointer proximity lift and image enlargement; static on touch.
- `C09`: subtle jelly feedback on purchase controls.
- `U08`: fine-pointer cursor morph over actionable media; no cursor replacement on touch.
- `U09`: short, low-density ink trail on fine pointers; disabled on touch and reduced motion.
- `U13`: click shockwave used as input feedback.
- `N07`: circular fullscreen collection menu and collection-to-page transition.
- `F26`: wide, playful display identity using Bungee or a locally hosted equivalent.
- `F42`: Japanese copy uses Zen Kaku Gothic New or a robust local Gothic fallback.

## Interaction and accessibility

Every motion effect communicates hierarchy, feedback, or page state. No effect carries unique information. Cursor effects run only for fine pointers. Touch uses ordinary focus and active states. `prefers-reduced-motion` removes crossfades, trails, shockwaves, and complex transitions while keeping content available.

Dialogs trap focus, close with Escape, restore focus, and expose descriptive labels. Every interactive element is keyboard reachable. Focus indicators use lime with sufficient contrast. Images have useful Japanese alt text; decorative images use empty alt text.

## Performance and failure handling

The first visible hero image is preloaded. Remaining images are lazy-loaded and decoded asynchronously. Image dimensions or aspect ratios reserve space to prevent layout shift. JavaScript enhances already-navigable links, so navigation and purchase actions still work if scripts fail.

If an image fails, the card retains its dimensions and displays its product or collection name. If the normalized data is empty or invalid at build time, the build fails instead of publishing an incomplete shop.

## Verification and publishing

The implementation must pass JavaScript syntax checks, the project verification script, and a production build. Desktop and mobile screenshots are reviewed for all seven pages, with additional checks for subject cropping, navigation, lightbox behavior, reduced motion, keyboard access, and product-link correctness.

Only the TYPE3 repository is pushed. GitHub Pages is configured through GitHub Actions and the final public URL is verified after deployment.
