---
name: Ukiyoe Project Design System Plan
overview: A comprehensive plan to establish a cohesive Design System for the Ukiyoe project, unifying visual language (colors, spacing, typography) and components to ensure consistency and scalability.
todos:
  - id: refactor-css-vars
    content: Refactor `CardPlayground.css` to use CSS variables from `App.css` (Colors & Spacing)
    status: in_progress
  - id: create-hanko-button
    content: Extract `HankoButton` component and implement across Intro, Nav, and LanguageToggle
    status: pending
    dependencies:
      - refactor-css-vars
  - id: audit-typography
    content: Audit and standardize typography usage across all components
    status: pending
    dependencies:
      - refactor-css-vars
---

# Ukiyoe Project Design System Plan

## 1. Philosophy & Purpose

**"Tradition meets Modern Web"**
The goal is to create a digital experience that feels as crafted and cohesive as the Ukiyo-e woodblock prints themselves.

-   **Consistency (Shin - 真)**: Every interaction and visual element should feel part of the same universe.
-   **Clarity (Mei - 明)**: Clear visual hierarchy using traditional Japanese aesthetics adapted for the screen.
-   **Efficiency (Soku - 速)**: Reusable components accelerate future development.

**Benefits:**

-   **Unified Aesthetic**: No more mismatched margins or slightly different shades of red.
-   **Maintainability**: Change a color in one place (`:root`), update it everywhere.
-   **Scalability**: New pages (like the Playground) will automatically look "correct" by using established tokens.

## 2. Design System Architecture (Atomic Design)

### A. Design Tokens (The Foundation)

These will be standardized in `src/App.css` (or a dedicated `src/styles/tokens.css`).

-   **Colors (Palette):**
    -   `--sumi-iro` (Primary Text/Ink): `#2d2d2d`
    -   `--beni-iro` (Accent/Crimson): `#d64e4e`
    -   `--ai-iro` (Secondary/Indigo): `#1e3a5f`
    -   `--kin-iro` (Highlight/Gold): `#c9a84c`
    -   `--washi` (Background): `#f5f0e6` / `#ebdcbd`
    -   *Action Item:* Replace hardcoded hex values (e.g., `#2d2a26`, `#6b6560`) in `CardPlayground.css` with these variables.

-   **Typography:**
    -   **Serif (Titles):** `Shippori Mincho` or `Noto Serif JP` (ensure consistency).
    -   **Sans (Body):** `Hiragino Kaku Gothic` / `Noto Sans JP`.
    -   *Action Item:* Verify font weights (300, 400, 600) are consistent.

-   **Spacing (The 8px Grid):**
    -   Base unit: 8px (`--space-xs`).
    -   Scale: `xs` (8px), `sm` (16px), `md` (24px), `lg` (32px), `xl` (48px), `2xl` (64px).
    -   *Action Item:* Audit margins/paddings that use arbitrary values (e.g., `15px`, `3rem` where `48px` is meant).

### B. Atoms (Basic Components)

-   **Buttons (Hanko Style):**
    -   `HankoButton`: The circular, stamped interaction element.
        -   Variants: `Default`, `Large`, `Active`, `Shoji` (translucent).
        -   Unified styles for: Nav arrows, Play/Pause, Language toggle.
-   **Labels/Badges:**
    -   `YearBadge`: Standardized pill shape for dates.
    -   `TechniqueLabel`: For tagging art styles.

### C. Molecules (Composite Components)

-   **Cards:**
    -   `PeriodCard`: Standardized shadow, hover lift, image aspect ratio.
    -   `TechniqueCard`: Consistent text hierarchy and padding.
-   **Inputs/Controls:**
    -   `TimelineSlider`: Standardized track, thumb, and active states.

## 3. Implementation Plan

### Phase 1: Token Standardization (CSS Refactor)

1.  **Audit `App.css`**: Ensure all root variables cover the needs of `CardPlayground.css` and others.
2.  **Refactor `CardPlayground.css`**: Replace hardcoded hex colors with `var(--sumi-iro)`, etc.
3.  **Refactor Spacing**: Replace ad-hoc pixel values with `var(--space-*)` variables.

### Phase 2: Component Abstraction (React Refactor)

1.  **Create `src/components/common/HankoButton.jsx`**:

    -   Extract logic/styles from `IntroSection` (Play/Pause), `LanguageToggle`, and `HorizontalScroll` (Nav Arrows).
    -   Props: `size` ('sm', 'md', 'lg'), `variant` ('solid', 'shoji'), `active` (bool), `onClick`.

2.  **Create `src/components/common/SectionTitle.jsx`**:

    -   Unify the typography for section headers across Intro, Timeline, and Playground.

### Phase 3: Visual QA

1.  **Browser Check**: Verify hover states, transitions, and responsive behavior match the new system.
2.  **A11y Check**: Ensure color contrast ratios meet WCAG standards using the defined palette.

## 4. References & Inspiration

-   **Atomic Design (Brad Frost)**: Methodology for building systems from atoms to organisms.
-   **Material Design 3**: Excellent reference for token naming (on-surface, container, etc.).
-   **Apple Human Interface Guidelines**: For interaction states and touch targets (44px+).