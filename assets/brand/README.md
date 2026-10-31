# Kreatekno brand assets

Pulled from the live site (kreatekno.com) on 2026-10-13 to reuse in the rebuild.

## Logo files

| File | Size | Notes |
|---|---|---|
| `kreatekno-logo.png` | 2559×853 | Original header logo (mark + "KREATEKNO" + "AUTOMATE YOU"), transparent background, with padding |
| `kreatekno-logo-trimmed.png` | 2211×377 | Same logo, padding trimmed. Use this in the header |
| `kreatekno-mark.png` | 477×477 | Cube mark only, cropped from the full logo. Use for favicon / app icon / avatar |
| `kreatekno-icon-512.png` | 512×512 | The old site's favicon. Blurry (upscaled), so prefer `kreatekno-mark.png` |
| `kreatekno-icon-270.png` | 270×270 | Same old favicon, smaller |

No vector (SVG) logo was found on the site. Ask for the original source file, or redraw the logo as SVG before launch so it stays sharp at every size.

The logo is purple on a transparent background. It reads well on white or light backgrounds. On the dark navy it needs a light version (for example, the wordmark in white).

## Colors

### From the logo (sampled from the pixels)

| Role | Hex | Where |
|---|---|---|
| Logo purple | `#9F0ED6` | Wordmark, tagline, right cube face |
| Logo violet | `#8C2BFA` | Bottom cube face, bottom node |
| Logo cyan | `#35EAFE` | Left cube face, left node |

### Used on the current site (from the page CSS, by how often each appears)

| Role | Hex | Used for |
|---|---|---|
| Navy (main dark) | `#131951` | Most backgrounds, headings, borders (most used color) |
| Purple (accent) | `#9609CA` | Accent text, dividers, accordion hover/active |
| Blue (links/buttons) | `#046BD2` | Buttons, links (Astra theme default) |
| White | `#FFFFFF` | Text on navy, backgrounds |

Other colors defined in the old theme but not used on the page: cyan `#05ABC4`, gold `#EAD196`, maroon `#3B060A`.

### CSS starting point

```css
:root {
  --brand-navy: #131951;
  --brand-purple: #9F0ED6;  /* logo; site used #9609CA */
  --brand-violet: #8C2BFA;
  --brand-cyan: #35EAFE;
  --brand-white: #FFFFFF;
}
```

The blue `#046BD2` is the Astra theme's default, not part of the logo. Decide whether to keep it in the visual design pass (M12).

## Fonts (current site)

- **Poppins** (most used)
- Roboto, Roboto Slab (Elementor defaults, used less)

Both are on Google Fonts and can be loaded with `next/font`.
