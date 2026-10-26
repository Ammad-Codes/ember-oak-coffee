# Ember & Oak Coffee

A premium, animated, single-page website for a specialty coffee house. Plain HTML, CSS and vanilla JavaScript: no frameworks, no build step, no libraries.

**Live:** https://ammad-codes.github.io/ember-oak-coffee/

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure and content |
| `style.css` | Design system, layout, themes and every animation |
| `script.js` | All interactivity (one IIFE, each feature isolated so one failure never breaks the rest) |

Photos are loaded from Unsplash and fonts (Cormorant Garamond, Inter) from Google Fonts. Nothing else is external.

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## What is inside

- **Scroll animations:** scroll progress bar, varied reveals (fade, slide, scale, clip), split-word hero title, parallax images, animated counters, marquee strip, and a scroll-linked craft timeline with a filling cup.
- **Buttons:** ripple, fill sweep, sliding arrow, magnetic pull, press feedback, add-to-cart morph with a fly-to-cart image, and loading then success states on forms.
- **Hidden and revealed content:** hover overlays, Read more expanders, FAQ accordion, 3D card tilt, CSS steam, animated underline links, sliding tab indicator, animated filter transitions.
- **Interactive:** build-your-drink configurator with live cup and price, a three-question roast quiz, grind selector, heart pop, live menu search with highlighting, toasts, swipeable testimonial slider with progress, four-step reservation stepper with animated confirmation, hero typewriter, smooth dark/light theme transition, cursor spotlight, and a sticky order pill on mobile.
- **Commerce flow:** menu with category tabs and tag filters, quick view, cart drawer with quantity, promo code (`COFFEE10`) and checkout form.
- **Rounded design:** 14px base radius, pill buttons, 20px cards, 18px images, rounded modals and drawer.

## Accessibility and robustness

- Respects `prefers-reduced-motion` (motion is removed, content shows instantly).
- Hover-only effects (tilt, spotlight, magnetic buttons) are enabled only on fine-pointer devices.
- Content stays visible if JavaScript fails or loads slowly (animated start states apply only once the script is running, plus a timed fallback).
- Keyboard focus styles, labelled controls, 44px minimum tap targets, no horizontal overflow from 320px up.

## Customise

- Colours, radii and spacing are CSS variables at the top of `style.css` (`--accent`, `--radius`, and so on). The light theme lives under `[data-theme="light"]`.
- Menu items, beans and quiz data are plain arrays at the top of `script.js`.
- Images use Unsplash photo IDs; swap an ID to change a photo.
