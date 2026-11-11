/**
 * i18n.js — tiny translation layer (English + Portuguese).
 *
 * Elements marked with data-i18n="key" get their text replaced.
 * Elements marked with data-i18n-placeholder="key" get their placeholder replaced.
 */
(function (app) {
  "use strict";

  const STORAGE_KEY = "pt-lang";
  const DEFAULT_LANG = "en";

  const translations = {
    en: {
      "nav.generator": "Generator",
      "nav.checker": "Checker",
      "theme.dark": "Dark Mode",
      "theme.light": "Light Mode",

      "gen.title": "Password Generator",
      "gen.subtitle": "Create strong, random passwords in one click.",
      "gen.placeholder": 'Click "Generate"',
      "gen.length": "Length",
      "gen.lowercase": "Lowercase letters",
      "gen.uppercase": "Uppercase letters",
      "gen.numbers": "Numbers",
      "gen.symbols": "Symbols",
      "gen.generate": "Generate Password",
      "gen.pickOne": "Select at least one option",

      "chk.title": "Strength Checker",
      "chk.subtitle": "Find out how strong your password is. Nothing leaves your browser.",
      "chk.placeholder": "Type or paste a password",

      "rule.length8": "At least 8 characters",
      "rule.length12": "At least 12 characters",
      "rule.upper": "Contains an uppercase letter",
      "rule.number": "Contains a number",
      "rule.symbol": "Contains a symbol",

      "level.weak": "Weak",
      "level.medium": "Medium",
      "level.strong": "Strong",
      "score": "Strength: {score}%",

      "toast.copied": "Copied to clipboard!",
      "toast.copyFailed": "Could not copy",
      "toast.nothing": "Generate a password first",

      "aria.show": "Show password",
      "aria.hide": "Hide password",
      "aria.copy": "Copy password",
      "aria.lang": "Switch language"
    },

    pt: {
      "nav.generator": "Gerador",
      "nav.checker": "Verificador",
      "theme.dark": "Modo Escuro",
      "theme.light": "Modo Claro",

      "gen.title": "Gerador de Senhas",
      "gen.subtitle": "Cria senhas fortes e aleatórias com um clique.",
      "gen.placeholder": 'Clica em "Gerar"',
      "gen.length": "Tamanho",
      "gen.lowercase": "Letras minúsculas",
      "gen.uppercase": "Letras maiúsculas",
      "gen.numbers": "Números",
      "gen.symbols": "Símbolos",
      "gen.generate": "Gerar Senha",
      "gen.pickOne": "Seleciona pelo menos uma opção",

      "chk.title": "Verificar Força",
      "chk.subtitle": "Descobre quão forte é a tua senha. Nada sai do teu navegador.",
      "chk.placeholder": "Escreve ou cola uma senha",

      "rule.length8": "Pelo menos 8 caracteres",
      "rule.length12": "Pelo menos 12 caracteres",
      "rule.upper": "Contém uma letra maiúscula",
      "rule.number": "Contém um número",
      "rule.symbol": "Contém um símbolo",

      "level.weak": "Fraca",
      "level.medium": "Média",
      "level.strong": "Forte",
      "score": "Segurança: {score}%",

      "toast.copied": "Copiada!",
      "toast.copyFailed": "Não foi possível copiar",
      "toast.nothing": "Gera uma senha primeiro",

      "aria.show": "Mostrar senha",
      "aria.hide": "Esconder senha",
      "aria.copy": "Copiar senha",
      "aria.lang": "Mudar idioma"
    }
  };

  let lang = DEFAULT_LANG;
  const listeners = [];

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }

  /** Translate a key, optionally filling {placeholders}. */
  function t(key, vars) {
    const dict = translations[lang] || translations[DEFAULT_LANG];
    let text = dict[key] || translations[DEFAULT_LANG][key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.replace("{" + name + "}", vars[name]);
      });
    }
    return text;
  }

  /** Apply translations to every marked element in the document. */
  function apply() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    // The button shows the language you would switch TO
    const langBtn = document.getElementById("langBtn");
    if (langBtn) {
      langBtn.textContent = lang === "en" ? "PT" : "EN";
      langBtn.setAttribute("aria-label", t("aria.lang"));
    }

    const copyBtn = document.getElementById("copyBtn");
    if (copyBtn) copyBtn.setAttribute("aria-label", t("aria.copy"));
  }

  function setLang(next) {
    if (!translations[next]) return;
    lang = next;
    safeSet(STORAGE_KEY, lang);
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  function toggle() {
    setLang(lang === "en" ? "pt" : "en");
  }

  /** Register a callback that runs after the language changes. */
  function onChange(fn) {
    listeners.push(fn);
  }

  function init() {
    const saved = safeGet(STORAGE_KEY);
    if (saved && translations[saved]) lang = saved;
    apply();
  }

  app.i18n = { t: t, apply: apply, setLang: setLang, toggle: toggle, onChange: onChange, init: init, getLang: function () { return lang; } };
})(window.PasswordTools = window.PasswordTools || {});
