/* Walnut St. Labs homepage — contact form.
 *
 * The contact section ships two things: a HubSpot embedded form, and a styled
 * fallback form that matches the design. Which one the visitor sees depends on
 * configuration, not on this file:
 *
 *   - Put the portal and form ids on #hs-form-target in index.html
 *     (data-hs-portal-id / data-hs-form-id / data-hs-region) and the HubSpot
 *     form renders in place of the fallback.
 *   - Leave them blank and the fallback stays up, telling visitors to email
 *     sales@walnutstlabs.com rather than pretending a submission was sent.
 *
 * Nothing else on the page needs JavaScript.
 */
(function () {
  'use strict';

  var EMAIL = 'sales@walnutstlabs.com';
  var HS_SCRIPT = 'https://js.hsforms.net/forms/embed/v2.js';

  var target = document.getElementById('hs-form-target');
  var fallback = document.getElementById('contact-form-fallback');
  var notice = document.getElementById('contact-form-notice');

  if (!target || !fallback) return;

  var portalId = (target.dataset.hsPortalId || '').trim();
  var formId = (target.dataset.hsFormId || '').trim();
  var region = (target.dataset.hsRegion || 'na1').trim();

  function showNotice(text) {
    if (!notice) return;
    notice.textContent = text;
    notice.hidden = false;
  }

  /* Fallback behaviour: this form has nowhere to post, so it says so instead of
   * reporting a send that did not happen. Replaced wholesale once HubSpot is
   * configured. */
  fallback.addEventListener('submit', function (event) {
    event.preventDefault();
    showNotice('This form is not connected yet — please email ' + EMAIL + ' and we will reply within a day.');
  });

  if (!portalId || !formId) {
    // Deliberately loud: a live site with an unconfigured form is a bug.
    console.warn(
      '[walnutstlabs] HubSpot form not configured. Set data-hs-portal-id and ' +
      'data-hs-form-id on #hs-form-target in index.html. Serving the fallback form.'
    );
    return;
  }

  var script = document.createElement('script');
  script.src = HS_SCRIPT;
  script.charset = 'utf-8';
  script.async = true;

  script.addEventListener('load', function () {
    if (!window.hbspt || !window.hbspt.forms) {
      showNotice('The contact form could not load. Please email ' + EMAIL + '.');
      return;
    }
    window.hbspt.forms.create({
      region: region,
      portalId: portalId,
      formId: formId,
      target: '#hs-form-target',
      onFormReady: function () {
        // Only retire the fallback once HubSpot has actually painted a form,
        // so a failed render never leaves the section empty.
        fallback.hidden = true;
      }
    });
  });

  script.addEventListener('error', function () {
    console.warn('[walnutstlabs] HubSpot embed script failed to load; keeping the fallback form.');
  });

  document.head.appendChild(script);
})();
