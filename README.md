# website20260822

The Walnut St. Labs homepage — a static one-page site, served by GitHub Pages
from the repository root. No build step: `index.html`, two stylesheets, one
script, and the logo images.

Built from a Claude Design handoff (`Walnut St Labs Homepage.dc.html`); the
prototype's design-canvas constructs are resolved into plain markup here.

```
index.html         the page
css/nocturne.css   the Nocturne design system (tokens + component classes)
css/site.css       page styles
js/site.js         contact-form wiring — the only JavaScript on the page
assets/logos/      20 client logos
.nojekyll          tells Pages to serve the files as-is, without Jekyll
```

## Local preview

```sh
python3 -m http.server 8000
```

## GitHub Pages

Pages serves from the repository root, so the URL is a project subpath:

```
https://walnutstlabs.github.io/website20260822/
```

Every asset reference in `index.html` is **relative**, which is what makes that
subpath work — don't rewrite them to absolute `/css/...` paths or the site will
break under Pages while still looking fine locally.

To turn it on: **Settings → Pages → Build and deployment → Source: Deploy from
a branch**, branch `main`, folder `/ (root)`.

For a custom domain (e.g. `walnutstlabs.com`), add a `CNAME` file at the root
containing just the hostname, then point DNS at GitHub's servers and set the
domain under Settings → Pages.

## Configuring the contact form

The contact section is a **HubSpot embedded form**. It needs two ids, on the
embed target in `index.html`:

```html
<div id="hs-form-target"
     data-hs-region="na1"
     data-hs-portal-id="544318"
     data-hs-form-id="YOUR_FORM_ID"></div>
```

* **Portal id** — `544318`, already set. (Portal and form ids are public values;
  they appear in every HubSpot embed on every public site. Nothing secret here.)
* **Form id** — still needed. It's the GUID in the form's URL under
  Marketing → Forms, or in the form's own embed snippet.
* **Region** — `na1` for this portal.

Until the form id is filled in, the page serves the styled fallback form: it
matches the design, but submitting it shows a notice pointing at
sales@walnutstlabs.com rather than pretending the message was sent, and the
console logs a warning. Once the id is set, `js/site.js` loads HubSpot's embed
script and swaps the fallback out only after HubSpot has painted a real form —
so a failed embed leaves the fallback in place rather than an empty column.

HubSpot's own form markup is restyled to match the design system at the bottom
of `css/site.css` (`.hs-form …`). If you add field types the prototype did not
have (checkboxes, dropdowns), check them against those rules.

## Notes on the implementation

* **`css/nocturne.css` is the design system, kept verbatim** from the handoff
  bundle so it can be re-synced. The one change: its `@import` of Inter is
  dropped in favour of a preconnected `<link>` in the page head — same family
  and weights, fetched earlier. Page-specific styling belongs in `site.css`.
* **Service icons are inline SVGs** (Phosphor, light weight, 256×256 viewBox) —
  the same twelve glyphs the prototype pulled from the Phosphor webfont over a
  CDN, but without the runtime dependency or the font download.
* **Logo band** — the artwork is dark-on-transparent, so it is inverted and
  desaturated in CSS to read on the dark ground, held at 65% opacity, full on
  hover. Order is deliberate: Point One Navigation, Apex Controls, Formant,
  Precog lead the band.
* **No FAQ section** — dropped during design review, along with its nav link.
* Copy is verbatim from the prototype, with one exception: the twelfth service
  title read "Advetising" and is spelled "Advertising" here.
