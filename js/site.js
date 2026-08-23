/* Walnut St. Labs homepage — contact form.
 *
 * The contact section ships two things: HubSpot's embedded form, and a styled
 * fallback form that matches the design.
 *
 * HubSpot's current embed (js.hsforms.net/forms/embed/<portal>.js) is
 * self-driving: it finds .hs-form-frame divs by class and renders into them.
 * There is no create() call to make and no ready callback to hook, so this
 * file's only job is to notice when a form has actually appeared and retire
 * the fallback at that point — never before. If the script is blocked, fails,
 * or renders nothing, the fallback stays and the section still works.
 *
 * The embed may render into the light DOM, a shadow root, or an iframe
 * depending on how the form is configured in HubSpot, so the check covers all
 * three rather than assuming one.
 *
 * Nothing else on the page needs JavaScript.
 */
(function () {
  'use strict';

  var EMAIL = 'sales@walnutstlabs.com';
  var TIMEOUT_MS = 12000; // give up waiting and keep the fallback
  var POLL_MS = 200;

  var target = document.getElementById('hs-form-target');
  var fallback = document.getElementById('contact-form-fallback');
  var notice = document.getElementById('contact-form-notice');

  if (!target || !fallback) return;

  /* Fallback behaviour: this form has nowhere to post, so it says so rather
   * than reporting a send that did not happen. Only ever seen if the embed
   * fails to render. */
  fallback.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!notice) return;
    notice.textContent =
      'This form could not load — please email ' + EMAIL + ' and we will reply within a day.';
    notice.hidden = false;
  });

  function hasRenderedForm() {
    if (target.shadowRoot && target.shadowRoot.childElementCount > 0) return true;
    if (target.querySelector('iframe, form')) return true;
    return target.childElementCount > 0;
  }

  function retireFallback() {
    fallback.hidden = true;
  }

  if (hasRenderedForm()) {
    retireFallback();
    return;
  }

  var settled = false;
  var observer = new MutationObserver(check);
  var poll = window.setInterval(check, POLL_MS);
  var deadline = window.setTimeout(function () {
    finish(false);
  }, TIMEOUT_MS);

  observer.observe(target, { childList: true, subtree: true });

  function check() {
    if (!settled && hasRenderedForm()) finish(true);
  }

  function finish(rendered) {
    if (settled) return;
    settled = true;
    observer.disconnect();
    window.clearInterval(poll);
    window.clearTimeout(deadline);
    if (rendered) {
      retireFallback();
    } else {
      // Deliberately loud: a live page showing the fallback is a broken embed.
      console.warn(
        '[walnutstlabs] HubSpot form did not render within ' + TIMEOUT_MS +
        'ms — serving the fallback form. Check the embed script, the form id, ' +
        'and whether an extension is blocking js.hsforms.net.'
      );
    }
  }
})();
