/**
 * strength.js — password strength scoring.
 * Pure logic, no DOM access. Returns a score (0-100), a level and which rules pass.
 */
(function (app) {
  "use strict";

  const WEAK_BELOW = 40;
  const MEDIUM_BELOW = 70;

  /** Which individual rules does the password satisfy? */
  function evaluateRules(password) {
    return {
      length8: password.length >= 8,
      length12: password.length >= 12,
      upper: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password)
    };
  }

  /** Turn a numeric score into "weak" | "medium" | "strong". */
  function levelFor(score) {
    if (score < WEAK_BELOW) return "weak";
    if (score < MEDIUM_BELOW) return "medium";
    return "strong";
  }

  /**
   * Score a password.
   * Weights: 8+ chars (25), uppercase (20), number (20), symbol (20), 12+ chars (15).
   */
  function evaluate(password) {
    if (!password) {
      return { score: 0, level: "weak", rules: evaluateRules("") };
    }

    const rules = evaluateRules(password);
    let score = 0;
    if (rules.length8) score += 25;
    if (rules.upper) score += 20;
    if (rules.number) score += 20;
    if (rules.symbol) score += 20;
    if (rules.length12) score += 15;
    score = Math.min(score, 100);

    return { score: score, level: levelFor(score), rules: rules };
  }

  app.strength = { evaluate: evaluate };
})(window.PasswordTools = window.PasswordTools || {});
