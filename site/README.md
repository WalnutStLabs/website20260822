# Walnut St. Labs — homepage

Static one-page site built from the Claude Design handoff in `../project`
(`Walnut St Labs Homepage.dc.html`). No build step: `index.html`, two
stylesheets, one script, and the logo PNGs.

```
site/
  index.html         the page
  css/nocturne.css   the Nocturne design system (tokens + component classes)
  css/site.css       page styles
  js/site.js         contact-form wiring — the only JavaScript on the page
  assets/logos/      20 client logos
```

## Running it

Any static server works:

```sh
cd site && python3 -m http.server 8000
```

Deploy by uploading the `site/` directory as-is (Netlify/Vercel/S3/nginx —
publish directory `site`, no build command).

## Configuring the contact form

The contact section is a **HubSpot embedded form**. It needs two ids, which go
on the embed target in `index.html`:

```html
<div id="hs-form-target"
     data-hs-region="na1"
     data-hs-portal-id="YOUR_PORTAL_ID"
     data-hs-form-id="YOUR_FORM_ID"></div>
```

* **Portal id** — HubSpot → Settings → Account Setup → Account Defaults (also
  the number in your HubSpot URL).
* **Form id** — the GUID in the form's URL under Marketing → Forms, or from the
  form's own embed snippet.
* **Region** — `na1` for most portals, `eu1` for EU-hosted ones.

Until both ids are filled in, the page serves the styled fallback form: it
matches the design, but submitting it shows a notice pointing at
sales@walnutstlabs.com rather than pretending the message was sent, and the
console logs a warning. Once the ids are set, `js/site.js` loads HubSpot's
embed script and swaps the fallback out only after HubSpot has painted a real
form — so a failed embed leaves the fallback in place rather than an empty
column.

HubSpot's own form markup is restyled to match the design system at the bottom
of `css/site.css` (`.hs-form …`). If you add field types the prototype did not
have (checkboxes, dropdowns), check them against those rules.

## Notes on the implementation

* **`css/nocturne.css` is the design system, kept verbatim** from
  `project/_ds/nocturne-…/styles.css` so it can be re-synced. The one change:
  its `@import` of Inter is dropped in favour of a preconnected `<link>` in the
  page head — same family and weights, fetched earlier. Page-specific styling
  belongs in `site.css`, not here.
* **Service icons are inline SVGs** (Phosphor, light weight, 256×256 viewBox) —
  the same twelve glyphs the prototype pulled from the Phosphor webfont over a
  CDN, but without the runtime dependency or the font download.
* **Logo band** — the artwork is dark-on-transparent, so it is inverted and
  desaturated in CSS to read on the dark ground, held at 65% opacity, full on
  hover. Order is the one Chris asked for: Point One Navigation, Apex Controls,
  Formant, Precog, then the rest.
* **No FAQ section** — it was dropped during design review, along with its nav
  link. The prototype still carries the `faqs` data and a `showFaq` prop; both
  were left behind deliberately.
* Copy is verbatim from the prototype, with one exception: the twelfth service
  title read "Advetising" and is spelled "Advertising" here.
