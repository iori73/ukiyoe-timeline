---
name: Design System Consistency
overview: Establish a consistent spacing hierarchy and layout system across all sections to create a professional, cohesive design.
todos:
  - id: spacing-guidelines
    content: Add spacing hierarchy documentation to CSS file
    status: completed
  - id: intro-width-fix
    content: Remove width constraints from intro-text-content
    status: completed
  - id: intro-spacing
    content: Standardize intro section spacing with variables
    status: completed
  - id: period-section-spacing
    content: Fix fullscreen period section spacing consistency
    status: completed
  - id: modal-spacing
    content: Update modal component spacing to use variables
    status: completed
  - id: global-cleanup
    content: Convert all remaining hardcoded spacing to variables
    status: completed
  - id: responsive-review
    content: Test and adjust responsive spacing at all breakpoints
    status: completed
---

# Design System Consistency & Professional Layout Improvements

## Overview

Refactor spacing, gaps, and layout constraints across the entire Ukiyoe project to establish visual consistency and professional design quality. The user identified critical issues with misaligned widths and inconsistent spacing that make the design look amateurish.

## Spacing Hierarchy (Design System)

Establish clear usage guidelines for the existing CSS variables:

- `--space-xs` (8px): Internal spacing within small components (padding in boxes)
- `--space-sm` (16px): **Tight groupings** - related elements like card text, form fields
- `--space-md` (24px): Moderate gaps between sub-sections
- `--space-lg` (32px): Section-level content gaps
- `--space-xl` (48px): Major section divisions
- `--space-2xl` (64px): Top-level container gaps

## Changes by Section

### 1. Intro Section ([src/App.css](src/App.css))

**Width & Alignment Issues:**

- Remove `max-width: 900px` from `.intro-text-content` (line 873)
- Ensure both `.intro-text-content` and `.intro-evolution-cards` are full-width with centered content
- Both containers should have consistent alignment behavior

**Spacing Fixes:**

- `.intro-content-new` gap: Keep at `var(--space-2xl)` (64px) - major division between text and cards
- `.intro-text-content` gap: Keep at `var(--space-lg)` (32px) - section-level
- `.intro-text-block` gap: Change to `var(--space-md)` (24px) - paragraph spacing
- `.intro-evolution-cards` gap: Change `48px` to `var(--space-xl)` (48px) - use variable
- `.evolution-card` gap: Change `8px` to `var(--space-sm)` (16px) - **KEY FIX**
- `.evolution-card-text` gap: Change `.5rem` to `var(--space-sm)` (16px) - **KEY FIX FOR CONSISTENCY**

### 2. Fullscreen Period Sections ([src/App.css](src/App.css))

**Text Panel Spacing:**

- `.text-panel-inner` gap: Currently `2rem` (32px) - standardize to `var(--space-lg)`
- `.section-header-row` gap: Currently `1rem` - change to `var(--space-sm)` (16px)
- `.section-meta-container` gap: Currently `1rem` - change to `var(--space-sm)` (16px)
- `.section-meta-item` gap: Currently `0.5rem` - change to `var(--space-xs)` (8px)
- `.section-details-figma` gap: Currently `1.5rem` (24px) - standardize to `var(--space-md)`
- `.detail-section-figma` gap: Currently `0.5rem` - change to `var(--space-xs)` (8px)

### 3. Modal Components ([src/App.css](src/App.css))

**Modal Text Panel:**

- `.modal-text-panel-inner` gap: Currently `2rem` - standardize to `var(--space-lg)` (32px)
- `.modal-meta-blur-container` gap: Currently `1.5rem` - change to `var(--space-md)` (24px)
- `.modal-meta-blur-item` gap: Currently `0.5rem` - change to `var(--space-xs)` (8px)
- `.modal-detail-sections` gap: Currently `1.5rem` - change to `var(--space-md)` (24px)
- `.modal-detail-section` gap: Currently `0.75rem` - change to `var(--space-sm)` (16px)

### 4. Global Cleanup ([src/App.css](src/App.css))

**Convert Raw Values to Variables:**

- Search for all hardcoded `rem`, `px` values in gap, padding, margin properties
- Replace with appropriate `var(--space-*)` variables
- Specific targets:
- Lines ~894-904: Evolution card gaps
- Lines ~1252-1256: Section header gaps
- Lines ~1334-1398: Meta container gaps
- Lines ~2495-2553: Modal gaps

**Responsive Adjustments:**

- Review mobile breakpoints (768px, 480px) to ensure spacing scales appropriately
- Mobile gaps can use smaller scale values (e.g., `--space-sm` instead of `--space-md`)

## Implementation Order

1. **Define spacing usage clearly in comments** at the top of CSS file
2. **Fix intro section** (highest visibility, user's primary concern)
3. **Apply to period sections** (main content)
4. **Update modal styles** (secondary views)
5. **Global cleanup pass** (find/replace remaining hardcoded values)
6. **Test responsive behavior** at all breakpoints

## Expected Outcomes

- Visual rhythm and consistency across all sections
- Professional, intentional spacing that guides the eye
- Aligned widths create clean, organized layouts
- Easier maintenance with standardized spacing variables
- Better responsive behavior with consistent scaling