---
name: Design System Documentation
overview: Create comprehensive, industry-standard design system documentation for the Ukiyoe project based on best practices from leading design systems (Carbon, Material Design, Airbnb DLS).
todos:
  - id: design-tokens-doc
    content: Document design tokens with usage hierarchy and examples
    status: pending
  - id: color-system-doc
    content: Create color system documentation with accessibility guidelines
    status: pending
  - id: typography-doc
    content: Document typography system with usage examples
    status: pending
  - id: spacing-doc
    content: Document spacing system with recent improvements and hierarchy
    status: pending
  - id: component-template
    content: Create reusable component documentation template
    status: pending
  - id: key-components
    content: Document 3-5 most important components
    status: pending
  - id: patterns-doc
    content: Document layout and content patterns
    status: pending
  - id: guidelines-doc
    content: Create design and accessibility guidelines
    status: pending
---

# Ukiyoe Design System Documentation Plan

## Overview
Create comprehensive documentation for the Ukiyoe design system following industry best practices learned from Carbon Design System, Material Design, Figma, and Airbnb DLS. The documentation will ensure design consistency, improve team collaboration, and serve as a single source of truth.

## Documentation Structure

Based on research, the most effective design system documentation includes:

### 1. Getting Started
- **Introduction**: What is the Ukiyoe Design System
- **Design Principles**: Japanese aesthetic philosophy (和の美学)
- **Installation Guide**: For designers and developers
- **Quick Start**: Basic usage examples
- **Contribution Guidelines**: How to propose changes

### 2. Foundations

#### Design Tokens ([src/App.css](src/App.css) lines 14-113)
Document existing tokens with usage guidelines:

**Colors (主色・地色)**
- `--sumi-iro`, `--beni-iro`, `--ai-iro`, `--kin-iro`
- Usage: When to use each color family
- Accessibility: Contrast ratios and guidelines

**Typography**
- Font families: Serif (Yuji Syuku) vs Sans (Noto Sans JP)
- Font size scale: `--text-xs` through `--text-8xl`
- Line height and letter spacing tokens
- Usage guidelines for each scale

**Spacing System** (Recently standardized!)
- Base unit: 8px
- Scale: `--space-xs` (8px) through `--space-6xl` (256px)
- **NEW: Usage hierarchy documented:**
  - `--space-xs` (8px): Internal component padding
  - `--space-sm` (16px): Related element groupings
  - `--space-md` (24px): Sub-section separations
  - `--space-lg` (32px): Section-level content gaps
  - `--space-xl` (48px): Major section divisions
  - `--space-2xl` (64px): Top-level container gaps

**Animation**
- Duration tokens and easing functions
- The unique `--ease-ukiyoe` curve

**Shadows & Borders**
- Minimal shadow system
- Border tokens and usage

### 3. Components

For each component (following Carbon/Figma templates):

**Component Template:**
- **Purpose**: What is this component (1-2 sentences)
- **When to use**: Specific use cases
- **When NOT to use**: Anti-patterns
- **Variants**: All available types
- **Anatomy**: Visual breakdown with labels
- **States**: Default, hover, active, disabled, error
- **Spacing**: How spacing tokens apply
- **Accessibility**: WCAG compliance, keyboard navigation, screen reader behavior
- **Code Examples**: React/JSX snippets
- **Figma Links**: Direct links to component in design files
- **DO's and DON'Ts**: Visual examples

**Current Components to Document:**
- IntroSection (with title-group, text-content, evolution-cards)
- FullscreenSection (split-layout with image and text panels)
- Hanko buttons (unique to this system)
- Timeline components
- Modal dialogs
- Navigation elements

### 4. Patterns

**Layout Patterns:**
- Horizontal scroll navigation (Sawataya-style)
- Split-screen layouts (55/45 image-text ratio)
- Card layouts and grids
- Responsive breakpoints and behavior

**Content Patterns:**
- Japanese/English bilingual content structure
- Typography pairing (serif headlines + sans body)
- Image presentation with overlays

### 5. Guidelines

**Design Guidelines:**
- Japanese aesthetic principles
- Use of negative space (間/ma)
- Washi paper background treatments
- Color usage philosophy
- Motion design principles

**Content Guidelines:**
- Tone of voice (bilingual)
- Writing style for cultural content
- Localization best practices

**Accessibility Guidelines:**
- Color contrast requirements
- Focus states
- Keyboard navigation patterns
- Screen reader considerations
- Semantic HTML requirements

### 6. Resources

- Figma file links
- Design asset downloads
- Code repository
- Contribution process
- Office hours/support channels
- Changelog and version history

## File Structure

```
/docs
  /design-system
    /getting-started
      - introduction.md
      - installation.md
      - design-principles.md
      - contribution-guide.md
    /foundations
      /design-tokens
        - overview.md
        - color.md
        - typography.md
        - spacing.md
        - animation.md
        - borders-shadows.md
      - accessibility.md
      - grid-system.md
    /components
      - overview.md
      - intro-section.md
      - fullscreen-section.md
      - hanko-button.md
      - timeline.md
      - modal.md
      - navigation.md
    /patterns
      - layout-patterns.md
      - content-patterns.md
    /guidelines
      - design-guidelines.md
      - content-guidelines.md
      - accessibility-guidelines.md
    /resources
      - downloads.md
      - changelog.md
      - roadmap.md
```

## Implementation Approach

### Phase 1: Foundation Documentation (Priority)
1. Design Tokens overview with updated spacing hierarchy
2. Color system documentation
3. Typography system
4. Spacing system (COMPLETED - document recent improvements!)

### Phase 2: Component Documentation
1. Create component documentation template
2. Document 3-5 most used components
3. Add code examples and Figma embeds
4. Include DO's and DON'Ts with screenshots

### Phase 3: Patterns & Guidelines
1. Document layout patterns
2. Content and design guidelines
3. Accessibility guidelines

### Phase 4: Resources & Maintenance
1. Add changelog automation
2. Create contribution templates
3. Set up documentation review process

## Best Practices to Follow

Based on research from Carbon, Figma, and others:

1. **Write for Humans**: Simple language, no jargon
2. **Show, Don't Just Tell**: Include visuals, interactive demos when possible
3. **Make it Searchable**: Clear headings, consistent terminology
4. **Keep it Current**: Set up review schedules, use automation
5. **Encourage Contribution**: Clear processes for feedback and updates
6. **Meet Teams Where They Are**: Integrate with existing tools (Figma, GitHub)
7. **Document the Why**: Not just what/how, but rationale behind decisions

## Success Metrics

- Reduced design inconsistencies across the site
- Faster onboarding for new team members
- Fewer questions in support channels
- Increased component reuse
- Improved accessibility compliance

## Tools Considered

- **Markdown files** in repo (simple, version controlled)
- **Storybook** for interactive component demos
- **Figma** for design specs and embeds
- **GitHub Pages** or similar for hosting

Documentation should be:
- Easy to update
- Version controlled alongside code
- Searchable
- Accessible to all team members