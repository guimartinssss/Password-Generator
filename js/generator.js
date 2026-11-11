/**
 * generator.js — password generation.
 * Uses the browser's cryptographically secure random source (crypto.getRandomValues)
 * instead of Math.random(), and avoids modulo bias.
 */
(function (app) {
  "use strict";

  const CHARSETS = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+[]{}<>?-=~"
  };

  /** Secure random integer in [0, max) using rejection sampling. */
  function randomInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    do {
      crypto.getRandomValues(buffer);
    } while (buffer[0] >= limit);
    return buffer[0] % max;
  }

  function pick(chars) {
    return chars[randomInt(chars.length)];
  }

  /** Fisher-Yates shuffle with secure randomness. */
  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      const tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  /**
   * Generate a password.
   * @param {{length:number, lower:boolean, upper:boolean, numbers:boolean, symbols:boolean}} options
   * @returns {string} the password, or "" when no character set is selected
   */
  function generate(options) {
    const sets = Object.keys(CHARSETS)
      .filter(function (name) { return options[name]; })
      .map(function (name) { return CHARSETS[name]; });

    if (sets.length === 0) return "";

    const length = Math.max(options.length, sets.length);
    const pool = sets.join("");

    // Guarantee at least one character from every selected set, then fill the rest
    const chars = sets.map(pick);
    while (chars.length < length) chars.push(pick(pool));

    return shuffle(chars).join("");
  }

  app.generator = { generate: generate };
})(window.PasswordTools = window.PasswordTools || {});
