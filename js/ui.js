/**
 * ui.js — DOM helpers: tabs, strength meter, rules list, toast and clipboard.
 */
(function (app) {
  "use strict";

  let toastTimer = null;

  /** Show one tab panel and mark its button as selected. */
  function showTab(name) {
    document.querySelectorAll(".tab").forEach(function (panel) {
      const active = panel.id === name;
      panel.classList.toggle("active", active);
      panel.hidden = !active;
    });

    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      const active = btn.dataset.tab === name;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", String(active));
    });
  }

  /**
   * Update a strength meter.
   * @param {"gen"|"check"} prefix element id prefix (genBar, genLevel, genScore, ...)
   * @param {{score:number, level:string}|null} result null clears the meter
   */
  function renderMeter(prefix, result) {
    const meter = document.getElementById(prefix + "Meter");
    const bar = document.getElementById(prefix + "Bar");
    const level = document.getElementById(prefix + "Level");
    const score = document.getElementById(prefix + "Score");

    if (!result) {
      bar.style.width = "0%";
      level.textContent = "";
      score.textContent = "";
      meter.removeAttribute("data-level");
      return;
    }

    const t = app.i18n.t;
    meter.dataset.level = result.level;
    bar.style.width = result.score + "%";
    level.textContent = t("level." + result.level);
    score.textContent = t("score", { score: result.score });
  }

  /** Mark each rule in the checker list as met or not. */
  function renderRules(rules) {
    document.querySelectorAll("#rules li").forEach(function (item) {
      item.classList.toggle("met", Boolean(rules[item.dataset.rule]));
    });
  }

  /** Show a short message at the bottom of the screen. */
  function toast(message) {
    const el = document.getElementById("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  /** Copy text to the clipboard, with a fallback for older browsers. */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      ok ? resolve() : reject(new Error("copy failed"));
    });
  }

  app.ui = { showTab: showTab, renderMeter: renderMeter, renderRules: renderRules, toast: toast, copyText: copyText };
})(window.PasswordTools = window.PasswordTools || {});
