/**
 * main.js — application entry point. Wires the modules to the page.
 */
(function (app) {
  "use strict";

  const $ = function (id) { return document.getElementById(id); };

  // Last generated password, kept so the UI can re-render when the language changes
  let currentPassword = "";

  function readOptions() {
    return {
      length: Number($("length").value),
      lower: $("optLower").checked,
      upper: $("optUpper").checked,
      numbers: $("optNumbers").checked,
      symbols: $("optSymbols").checked
    };
  }

  function renderGeneratorMeter() {
    app.ui.renderMeter("gen", currentPassword ? app.strength.evaluate(currentPassword) : null);
  }

  function renderCheckerMeter() {
    const value = $("checkInput").value;
    const result = app.strength.evaluate(value);
    app.ui.renderMeter("check", value ? result : null);
    app.ui.renderRules(result.rules);
  }

  function handleGenerate() {
    const password = app.generator.generate(readOptions());

    if (!password) {
      app.ui.toast(app.i18n.t("gen.pickOne"));
      return;
    }

    currentPassword = password;
    const output = $("result");
    output.removeAttribute("data-i18n"); // stop the placeholder from being re-translated
    output.textContent = password;
    output.classList.add("has-value");
    renderGeneratorMeter();
  }

  function handleCopy() {
    if (!currentPassword) {
      app.ui.toast(app.i18n.t("toast.nothing"));
      return;
    }

    app.ui.copyText(currentPassword).then(
      function () { app.ui.toast(app.i18n.t("toast.copied")); },
      function () { app.ui.toast(app.i18n.t("toast.copyFailed")); }
    );
  }

  function handleToggleVisibility() {
    const input = $("checkInput");
    const button = $("toggleVisibility");
    const show = input.type === "password";

    input.type = show ? "text" : "password";
    button.textContent = show ? "🙈" : "👁️";
    button.setAttribute("aria-label", app.i18n.t(show ? "aria.hide" : "aria.show"));
  }

  function init() {
    app.i18n.init();
    app.theme.init();

    // Navigation
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { app.ui.showTab(btn.dataset.tab); });
    });

    // Header controls
    $("themeBtn").addEventListener("click", app.theme.toggle);
    $("langBtn").addEventListener("click", app.i18n.toggle);

    // Generator
    $("generateBtn").addEventListener("click", handleGenerate);
    $("copyBtn").addEventListener("click", handleCopy);
    $("length").addEventListener("input", function (event) {
      $("lengthValue").textContent = event.target.value;
    });

    // Checker
    $("checkInput").addEventListener("input", renderCheckerMeter);
    $("toggleVisibility").addEventListener("click", handleToggleVisibility);

    // Re-render dynamic text when the language changes
    app.i18n.onChange(function () {
      renderGeneratorMeter();
      renderCheckerMeter();
      app.theme.render();
    });

    renderCheckerMeter();
  }

  document.addEventListener("DOMContentLoaded", init);
})(window.PasswordTools = window.PasswordTools || {});
