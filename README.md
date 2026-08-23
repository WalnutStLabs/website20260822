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

The contact section is a **HubSpot embedded form**, wired with HubSpot's
current embed snippet — the script finds the div by its `.hs-form-frame` class
and renders into it. Both live in `index.html`:

```html
<div class="hs-form-frame" id="hs-form-target"
     data-region="na1"
     data-form-id="53b4341f-acb6-46ad-96c9-dc55f4f23350"
     data-portal-id="544318"></div>
...
<script src="https://js.hsforms.net/forms/embed/544318.js" defer></script>
```

Portal `544318`, form `53b4341f-…`, region `na1`. These are public values —
they appear in every HubSpot embed on every public site — so there is nothing
secret to protect here.

Note this is the **newer** embed, not the older `v2.js` + `hbspt.forms.create()`
API. The new script is self-driving: there is no create call and no ready
callback, so `js/site.js` watches the target instead and only retires the
fallback once a form has actually appeared.

### The fallback form

Underneath the embed sits a styled fallback that matches the design. If the
embed script is blocked (adblockers routinely block `js.hsforms.net`), fails,
or renders nothing within 12 seconds, the fallback stays on the page and
submitting it points people at sales@walnutstlabs.com — it never claims a
message was sent. A warning is logged to the console in that case.

Verified against every way the embed can render: light DOM, shadow root,
iframe, delayed render, and fully blocked.

### Styling

`css/site.css` restyles HubSpot's markup (`.hs-form …`) to match the design
system. **That only takes effect if HubSpot renders into the light DOM.** If
the form renders inside a shadow root or an iframe, page CSS cannot cross that
boundary and the form will use HubSpot's own styling instead — which will look
wrong on this dark background. In that case set the form's colours, fonts and
button styling in HubSpot's form editor rather than here:

* background — transparent or `#161826`
* text — `#e9e9ed`
* accent / button — `#9184d9`
* font — Inter

If you add field types the prototype did not have (checkboxes, dropdowns) and
the form does render in the light DOM, check them against the `.hs-form` rules.

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
