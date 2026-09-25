/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs:  "400px",
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // ── Verso palette: Midnight + Amber Gold ────────────────────────
        //
        // Semantic tokens first. These resolve through the CSS variables in
        // index.css, so a single class works in both themes and the theme
        // flip is one class on <html> rather than a `dark:` twin on every
        // call site.
        canvas:   "var(--background)",
        surface:  "var(--card)",
        elevated: "var(--modal)",
        line:     "var(--border)",
        ink:      "var(--foreground)",
        subtle:   "var(--muted-foreground)",
        // Gold *text* on an app surface. Separate from the `gold` ramp on
        // purpose: a gold fill must stay the bright #E0A94E in both themes
        // (a foil block with a near-black label reads correctly on paper as
        // well as on midnight), but gold text has to darken on paper or it
        // measures 1.87:1. One token per job.
        accent:   "rgb(var(--gold-rgb) / <alpha-value>)",

        // The accent. 400 is the signature amber — bright enough to carry
        // text and hairlines on the near-black canvas (#E0A94E on #0B0D12
        // measures 9.4:1). The ramp darkens fast below it because gold is a
        // high-luminance hue: anything lighter than 600 cannot hold white
        // text, and this app paints plenty of gold fills.
        gold: {
          50:  "#FDF8EF",
          100: "#FAEFD8",
          200: "#F4DDAF",
          300: "#ECC77F",
          400: "#E0A94E", // signature amber — fills, and text on a photograph
          500: "#C98F33",
          600: "#A97426",
          700: "#8A6224", // AA-safe gold on the light canvas
          800: "#6B4C1E",
          900: "#4C3717",
          950: "#2B1F0D",
        },
        // Secondary warm accent — copper. Used where two warm marks must be
        // told apart (premium seals vs. ratings, live data vs. editorial
        // rules) without introducing a second hue family.
        copper: {
          50:  "#FBF3EF",
          100: "#F6E3D8",
          200: "#EDC4AF",
          300: "#E0A183",
          400: "#D08A5F",
          500: "#C97B4A",
          600: "#A9603A",
          700: "#874B2E",
          800: "#653825",
          900: "#46271A",
          950: "#28150E",
        },

      },
      // Must stay in step with --font-body/--font-display in index.css:
      // `font-display` here and `.font-display` there are the same role, and
      // when this still said Fraunces while the CSS said Literata, anything
      // styled with the Tailwind utility asked for a font the page no longer
      // loads. CJK faces are named for the same reason as in index.css.
      fontFamily: {
        sans:    ["Inter", "system-ui", "-apple-system", "PingFang SC", "Microsoft YaHei", "sans-serif"],
        display: ["Literata", "Georgia", "Songti SC", "ui-serif", "serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "\"SF Mono\"", "Menlo", "Consolas", "\"Liberation Mono\"", "monospace"],
      },
      fontSize: {
        // Editorial display sizes. Tight leading and negative tracking are
        // baked in: a 72px serif headline set at Tailwind's default 1.0
        // leading and 0 tracking reads loose and webby rather than printed.
        "display-sm": ["2.25rem",  { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display":    ["3.25rem",  { lineHeight: "1.02", letterSpacing: "-0.025em" }],
        "display-lg": ["4.5rem",   { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-xl": ["6rem",     { lineHeight: "0.94", letterSpacing: "-0.035em" }],
        // The uppercase tracked-out label that sits above every section.
        "kicker":     ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        kicker: "0.18em",
        wide2:  "0.28em",
      },
      spacing: {
        4.5: "1.125rem",
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      scale: {
        102: "1.02",
      },
      // Geometry, second pass.
      //
      // The first pass took radii down to 2–8px on the reasoning that print
      // layouts sit near-square. That was the wrong lesson: near-square plus
      // hairline rules plus monospaced data reads as a terminal, not a
      // magazine. A travel magazine is warm — its plates have softened
      // corners and its surfaces feel handled.
      //
      // Small controls (chips, buttons, fields) stay tight at 6px so they
      // still read as precise; anything that holds an image or a block of
      // content gets 14–20px so it reads as a plate on a page.
      borderRadius: {
        none: "0",
        sm:   "6px",
        DEFAULT: "8px",
        md:   "10px",
        lg:   "12px",
        xl:   "14px",
        "2xl": "18px",
        "3xl": "22px",
        "4xl": "26px",
        full: "9999px",
      },
      animation: {
        "fade-up":    "fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        "fade-in":    "fadeIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        "slide-in":   "slideIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards",
        "scale-in":   "scaleIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        // The signature entrance: a headline wiping up from behind a rule.
        "rise":       "rise 0.9s cubic-bezier(0.22,1,0.36,1) forwards",
        "rule-draw":  "ruleDraw 1.1s cubic-bezier(0.22,1,0.36,1) forwards",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-10px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.97)" }, to: { opacity: "1", transform: "scale(1)" } },
        rise:    { from: { opacity: "0", transform: "translateY(110%)" }, to: { opacity: "1", transform: "translateY(0)" } },
        ruleDraw: { from: { transform: "scaleX(0)" }, to: { transform: "scaleX(1)" } },
      },
      transitionTimingFunction: {
        // Heavier and longer-tailed than the old spring: editorial motion
        // settles rather than bounces.
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      transitionDuration: {
        250: "250ms",
        350: "350ms",
        400: "400ms",
        600: "600ms",
        700: "700ms",
        900: "900ms",
      },
      backdropBlur: {
        xs: "2px",
      },
      // Elevation is carried by surface steps and hairlines, not drop
      // shadows. What is left is a deep, neutral contact shadow that only
      // becomes visible on the light canvas; on the midnight canvas a black
      // shadow over near-black is invisible by design.
      boxShadow: {
        "card":       "0 1px 2px 0 rgb(0 0 0 / 0.16)",
        "card-hover": "0 2px 4px 0 rgb(0 0 0 / 0.20), 0 14px 34px -14px rgb(0 0 0 / 0.30)",
        "card-dark":  "0 1px 2px 0 rgb(0 0 0 / 0.5)",
        "gold-glow":  "0 0 24px -6px rgb(224 169 78 / 0.35)",
        "gold-rule":  "0 1px 0 0 rgb(224 169 78 / 0.45)",
      },
    },
  },
  plugins: [],
};
