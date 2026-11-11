# 🔒 Password Tools

A simple, private password generator and strength checker that runs entirely in your browser. No servers, no tracking, no dependencies, no build step.

## Features

- **Password generator** with adjustable length (4–50) and character sets (lowercase, uppercase, numbers, symbols)
- **Cryptographically secure** randomness via `crypto.getRandomValues` (not `Math.random`)
- **Strength checker** with a live meter and a checklist of the rules your password meets
- **One-click copy** to clipboard
- **Light and dark themes** (follows your system preference, remembers your choice)
- **English and Portuguese** interface with a one-click language switch
- **Responsive** design that works on desktop and mobile
- **100% client-side**: nothing you type ever leaves your browser

## Getting started

No installation needed. Clone the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/<your-username>/password-tools.git
cd password-tools
# then just open index.html in your browser
```

Optionally, serve it locally:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Project structure

```
password-tools/
├── index.html          # Page markup
├── css/
│   ├── variables.css   # Design tokens (colors, radii) and dark theme
│   ├── base.css        # Reset and global styles
│   ├── layout.css      # App card, sidebar, responsive rules
│   └── components.css  # Buttons, inputs, meter, toast
├── js/
│   ├── i18n.js         # Translations (EN / PT)
│   ├── theme.js        # Light / dark theme
│   ├── strength.js     # Strength scoring (pure logic)
│   ├── generator.js    # Secure password generation (pure logic)
│   ├── ui.js           # DOM helpers: tabs, meter, toast, clipboard
│   └── main.js         # Entry point that wires everything together
├── LICENSE
└── README.md
```

Scripts are loaded in order from `index.html` and share a single `window.PasswordTools` namespace, so there is no bundler or module system to set up.

## How strength is scored

| Rule                      | Points |
| ------------------------- | ------ |
| At least 8 characters     | 25     |
| Contains an uppercase letter | 20  |
| Contains a number         | 20     |
| Contains a symbol         | 20     |
| At least 12 characters    | 15     |

Below 40 is **weak**, 40–69 is **medium**, and 70+ is **strong**. This is a simple heuristic, not a guarantee. For real accounts, prefer long, unique passwords stored in a password manager.

## Adding a language

1. Open `js/i18n.js`.
2. Copy the `en` block inside `translations` and translate the values.
3. Update the `toggle()` function if you want to cycle through more than two languages.

## Contributing

Issues and pull requests are welcome. Please keep the code dependency-free and the scripts small and focused.

## License

Released under the [MIT License](LICENSE).
