---
name: Sumanth Photography
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#5f5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfde'
  on-secondary-container: '#636262'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c1b'
  on-tertiary-container: '#838482'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c5'
  on-tertiary-fixed: '#1a1c1b'
  on-tertiary-fixed-variant: '#464746'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 84px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 32px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 128px
---

## Brand & Style

This design system is built on a high-end editorial philosophy, drawing inspiration from premium fashion and wedding publications. The brand personality is **elegant, professional, and exclusive**, positioning the photography as a piece of fine art rather than a mere service.

The design style is **Editorial Minimalism**. It prioritizes high-contrast typography, expansive whitespace, and a monochromatic palette to ensure that the photography remains the primary focus. The aesthetic evokes the tactile feeling of a physical coffee-table book or a luxury magazine, using "paper-like" surfaces and precise, architectural alignment to establish authority and artistic merit.

## Colors

The color palette is strictly monochromatic and neutral to provide a sophisticated backdrop for vibrant photography. 

- **Primary:** Pure Black (`#000000`) is used for primary typography, borders, and high-impact UI elements.
- **Secondary:** Deep Charcoal (`#1A1A1A`) provides subtle depth for secondary text and interactive states.
- **Background:** Off-White/Paper (`#F9F8F6`) serves as the canvas, reducing eye strain and providing a warmer, more premium feel than pure white.
- **Neutral:** Mid-tone greys are used sparingly for metadata and deactivated states.

No accent colors are permitted; the "color" in the UI must come exclusively from the photographic content itself.

## Typography

Typography is the cornerstone of this design system. We use a high-contrast pairing to create a sense of rhythm and hierarchy.

- **Headlines:** `Playfair Display` is used for all major headings. Its high-contrast strokes and elegant serifs evoke luxury and timelessness. Use tight letter spacing for large display sizes to create a modern editorial look.
- **Body & Metadata:** `Inter` provides a functional, neutral counterpoint. It ensures legibility for technical details, metadata, and body copy. 
- **Labels:** Use `Inter` in uppercase with generous letter spacing (10%) for section headers and small labels to mimic magazine folio styles.

## Layout & Spacing

The layout philosophy is based on a **fixed grid with generous margins**. The goal is to create "breathable" compositions that allow individual photographs to stand out.

- **Grid:** A 12-column grid for desktop with 32px gutters. Elements should often span 6 or 8 columns to create asymmetrical, editorial interest.
- **Whitespace:** Use significant vertical padding (`section-gap`) between content blocks to signify a transition in the narrative.
- **Margins:** Desktop margins are intentionally wide (64px) to frame the content, moving inward to 20px on mobile devices.
- **Alignment:** Strictly align text to the grid. Metadata should be positioned with precision, often tucked into corners or aligned with the edges of large image blocks.

## Elevation & Depth

This design system avoids traditional shadows and depth metaphors in favor of **Tonal Layers and Bold Outlines**.

- **Flat Hierarchy:** Depth is communicated through contrast rather than elevation. Primary content sits on the base paper-colored surface.
- **Borders:** Use thin, 1px black borders to define sections and interactive cards. These borders should feel like "ink on paper."
- **Overlays:** For image-heavy interactions, use 90% opacity black overlays with white Playfair Display typography to maintain the high-contrast aesthetic.
- **No Blurs:** Avoid glassmorphism or soft shadows, as they conflict with the sharp, architectural nature of the brand.

## Shapes

The shape language is primarily **rectilinear and structured**. While the `roundedness` is set to `1` (0.25rem) to prevent the UI from feeling overly aggressive or hostile, it remains subtle enough to appear nearly sharp.

- **Container Corners:** Buttons and input fields use the base 4px (0.25rem) radius.
- **Large Components:** Image cards and large containers should maintain this subtle rounding to feel like high-quality print paper edges.
- **Interactive Elements:** Explicitly avoid pill shapes or circles, except for specific icon buttons, to maintain the sophisticated, grid-aligned aesthetic.

## Components

### Buttons
Buttons are sleek and minimalist. The primary action is a solid black block with white Inter typography and a simple right-arrow icon (`→`). Secondary actions use a 1px black border with a transparent background.

### Selection Cards
Cards for gallery selection or package choosing feature a thin 1px black border. When selected, the border thickness increases or a solid black header bar appears. Icons used within cards must be hairline-thin.

### Input Fields
Inputs are styled as a single bottom border (1px black) or a very thin 4-sided stroke. Labels should be small, uppercase Inter text placed above the field.

### Elegant Checkmarks
Checkboxes are replaced with a custom elegant "X" or a refined, thin-weight checkmark that matches the stroke weight of the typography.

### Lists & Metadata
Metadata lists for photography specs (e.g., ISO, Aperture, Date) should be displayed in a horizontal row with small-caps Inter, separated by thin vertical dividers.

### Subtle Paper Texture
A very low-opacity grain texture should be applied to the background of the entire application to enhance the "fine-art print" feel.