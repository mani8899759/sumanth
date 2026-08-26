---
name: Cinematic Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#202020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c7'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c8c6c5'
  primary: '#c8c6c5'
  on-primary: '#313030'
  primary-container: '#111111'
  on-primary-container: '#7e7c7c'
  inverse-primary: '#5f5e5e'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#c6c6c6'
  on-tertiary: '#2f3131'
  tertiary-container: '#0f1112'
  on-tertiary-container: '#7c7d7d'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 84px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-edge: 48px
  section-gap: 160px
  cinematic-pause: 240px
---

## Brand & Style
The design system is engineered for high-end photography, evoking the atmosphere of a darkened gallery where the art is the sole protagonist. The personality is sophisticated, silent, and authoritative—prioritizing visual impact over UI clutter. 

The aesthetic follows a **Modern Editorial** approach, characterized by aggressive whitespace (or "blackspace"), razor-sharp typography, and a cinematic rhythm. It rejects decorative elements in favor of structural precision and high-contrast surfaces, ensuring that the interface feels like a premium physical portfolio.

## Colors
The palette is strictly monochromatic to eliminate visual noise. 
- **The Void (#000000):** Used for primary backgrounds to allow photography to bleed into the edges of the display.
- **The Surface (#111111 / #202020):** Subtle shifts in dark values define UI containers and depth without relying on shadows.
- **The Type (#FFFFFF / #F5F5F5):** High-contrast white for headlines; soft white for long-form body text to reduce eye strain in dark mode.
- **The Accent (#C8C8C8):** Silver tones for secondary metadata and borders, providing a metallic, premium feel.

## Typography
Typography is treated as a secondary art form. 
- **Serif (Playfair Display):** Reserved for "Editorial Moments"—large hero statements, gallery titles, and pull quotes. It should be used sparingly to maintain its impact.
- **Sans-Serif (Inter):** A functional, utilitarian choice for navigation, technical metadata (shutter speed, ISO), and body copy.
- **Rhythm:** Use all-caps labels with wide tracking for navigation to create a sense of architectural structure.

## Layout & Spacing
The layout philosophy is based on a **Cinematic Grid**. 
- **Margins:** Generous 48px to 64px horizontal margins ensure the content never feels crowded by the screen edges.
- **Verticality:** Use extreme vertical spacing (Section Gaps) to separate different photographic series. This "pause" mimics the experience of walking between rooms in a gallery.
- **The Split Layout:** For "About" or "Contact" pages, utilize a 50/50 split where one side is a fixed high-resolution image and the other is a scrollable text area.

## Elevation & Depth
This design system avoids traditional shadows to maintain its flat, editorial integrity. Depth is instead communicated through:
- **Tonal Layering:** Interactive elements like cards or inputs use a slightly lighter `#111111` surface against the `#000000` background.
- **Opacity Fades:** Inactive UI elements sit at 40-60% opacity, coming to 100% only on interaction.
- **Glassmorphism (Subtle):** Overlays (like a mobile menu or a filter drawer) use a high-density background blur (30px) with a semi-transparent `#111111` fill to maintain the sense of dark space behind the UI.

## Shapes
Shapes are disciplined and mostly rectangular. A subtle "Soft" (0.25rem) radius is applied to buttons and form fields to prevent the interface from feeling "hostile," but images should remain sharp-edged (0px) to preserve their photographic intent.

## Components
- **Buttons:** Ghost-style by default. White 1px border with `label-caps` text. On hover, solid white fill with black text.
- **Image Grids:** Use a "Dense Masonry" approach. Gutters should be minimal (8px or 16px) to let the images form a collective texture, or extreme (80px) to treat each image as an individual artifact.
- **Chips/Tags:** Small, monochromatic rectangles with `#202020` backgrounds. Used for categorizing gear or shoot locations.
- **Input Fields:** Bottom-border only. No background fill. Focus state changes the border from `Muted Gray` to `White`.
- **Navigation:** A compact, "sticky" header that is transparent initially and transitions to a blurred `#111111` strip on scroll.
- **Hero:** Full-screen viewport height (100vh) featuring a slow Ken Burns (scale 1.0 to 1.05) animation.