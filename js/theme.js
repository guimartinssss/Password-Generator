/**
 * theme.js — light/dark theme handling.
 * Respects the saved choice, then the operating system preference.
 */
(function (app) {
  "use strict";

  const STORAGE_KEY = "pt-theme";
  let current = "light";

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }

  function render() {
    document.documentElement.setAttribute("data-theme", current);

    const icon = document.getElementById("themeIcon");
    const label = document.getElementById("themeLabel");
    const isDark = current === "dark";

    // The button offers the opposite mode
    if (icon) icon.textContent = isDark ? "☀️" : "🌙";
    if (label) {
      label.dataset.i18n = isDark ? "theme.light" : "theme.dark";
      label.textContent = app.i18n.t(label.dataset.i18n);
    }
  }

  function toggle() {
    current = current === "dark" ? "light" : "dark";
    safeSet(STORAGE_KEY, current);
    render();
  }

  function init() {
    const saved = safeGet(STORAGE_KEY);
    if (saved === "dark" || saved === "light") {
      current = saved;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      current = "dark";
    }
    render();
  }

  app.theme = { init: init, toggle: toggle, render: render };
})(window.PasswordTools = window.PasswordTools || {});
