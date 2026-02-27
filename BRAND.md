# KAI Brand Guidelines

> The Operating System for Cities and Enterprise.

---

## 1. Brand Positioning

**What Kai is:**
Kai is the intelligence layer for cities and enterprise — a single platform that unifies data, operations, and people across transit networks, stadiums, facilities, and urban infrastructure.

**Category:**
Kai defines and owns the category of *City Operating Systems*. It is not a tool, a dashboard, or a plugin. It is the operating system beneath everything.

**Target audience:**
Transit authorities, municipal governments, stadium operators, enterprise facility owners, and critical infrastructure operators. These are buyers where operational failure is not an option.

**Proof point:**
Live across 65 DART stations, 16,055 inspection points, 93 miles of light rail. Built for FIFA World Cup 2026.

---

## 2. Voice & Tone

Kai speaks like a confident expert — not a salesperson.

### Principles
- **Declarative, not explanatory.** State the fact. Let the number do the work.
- **Short sentences. Real data.** No filler words.
- **Confident without arrogance.** The product speaks for itself.
- **Technical, but not cold.** We care about the people in these spaces.

### Copy patterns

| ❌ Avoid | ✅ Prefer |
|----------|-----------|
| "Our cutting-edge AI-powered platform..." | "94.2% accuracy. Live." |
| "We help organizations manage their facilities more efficiently." | "One platform. Every space." |
| "REQUEST A DEMO TODAY!" | "Request a demo" |
| "EXPLORE THE PLATFORM" | "Explore the Platform" |
| Long explanations of features | Short statements + data points |

### Headline formulas
- **Two-line contrast:** "Three layers. / One unified truth."
- **Declarative fact:** "Kai is live across 65 DART stations today."
- **Scale statement:** "From a single station to an entire city."
- **Sentence-case always.** No ALL CAPS headlines.

---

## 3. Logo

The KAI wordmark is set in Geist Sans, `font-medium`, `tracking-[0.3em]`.

```
KAI
```

### Usage rules
- Always uppercase: `KAI`
- Minimum clear space: equal to the height of the "K" on all sides
- On dark backgrounds: white (`#FFFFFF`)
- On light backgrounds: black (`#000000`)
- Never use the brand orange or any other color for the wordmark
- Never add taglines, icons, or decorations to the wordmark itself

### Navigation usage
```
font-medium, tracking-[0.3em], font-size: 1rem (text-base)
```

---

## 4. Color

### Primary palette

| Name | Hex | Usage |
|------|-----|-------|
| **Black** | `#000000` | Primary background, hero sections, nav |
| **White** | `#FFFFFF` | Primary text on dark, primary CTA fill |
| **Hoopoe Orange** | `#FF6B35` | Operations layer, accent, hover states |
| **Wing Blue-Gray** | `#2C3E50` | Intelligence layer, secondary surfaces |
| **Off-White** | `#F8F9FA` | Light section backgrounds |

### Secondary / opacity system

Kai does not use grays from a traditional gray scale. Instead, it uses `white` or `black` with opacity to maintain color harmony across themes.

```
white/[0.06]  → hairline borders, dividers
white/20      → icon backgrounds, subtle separators
white/30      → eyebrow labels, captions
white/40      → secondary labels
white/50      → body text on dark
white/75      → secondary headline on dark
white          → primary text, primary CTAs
```

### Light section palette

| Token | Value | Usage |
|-------|-------|-------|
| `gray-100` | `#F3F4F6` | Decorative number color |
| `gray-400` | `#9CA3AF` | Eyebrow / label text |
| `gray-500` | `#6B7280` | Body text on white |
| `gray-600` | `#4B5563` | Slightly heavier body text |

### Rules
- **Never** put text directly on the Hoopoe Orange without sufficient contrast testing
- **Never** use gradients between brand colors — gradients are only used for image overlays (`black → transparent → black`)
- The accent green (`#27AE60`) is reserved for success/status states only — not decorative use

---

## 5. Typography

**Font family:** [Geist Sans](https://vercel.com/font) — loaded via `next/font/google`

Geist is a variable font; all weights are available without additional loading cost.

### Weight usage

| Weight | Class | Usage |
|--------|-------|-------|
| Thin (100) | `font-thin` | Hero display text, large stat numbers, decorative numerals |
| Light (300) | `font-light` | Body copy, card descriptions, paragraph text |
| Regular (400) | *(default)* | Not explicitly used |
| Medium (500) | `font-medium` | Eyebrow labels, nav links, CTA button text, section labels |

### Type scale

| Context | Size | Weight | Tracking | Line height |
|---------|------|--------|----------|-------------|
| Hero display | `clamp(3.2rem, 8vw, 7.5rem)` | `font-thin` | `tracking-[-0.03em]` | `leading-[0.93]` |
| Section H2 | `text-5xl` → `text-6xl` | `font-thin` | `tracking-[-0.02em]` | `leading-tight` |
| Module H3 | `text-xl` → `text-2xl` | `font-light` | default | default |
| Stat display | `3.5rem` → `4.5rem` | `font-thin` | `tracking-[-0.02em]` | `leading-none` |
| Body | `text-sm` → `text-xl` | `font-light` | default | `leading-relaxed` |
| Eyebrow label | `text-[11px]` | `font-medium` | `tracking-[0.2em]` → `tracking-[0.55em]` | — |
| Stat label | `text-[11px]` | `font-medium` | `tracking-[0.2em]` | — |
| Nav links | `text-[13px]` | default | default | — |
| Footer / meta | `text-[13px]` | default | default | — |

### Hierarchy rules
- Use **size and weight** for hierarchy — not opacity alone
- Opacity is for *secondary* elements within a hierarchy tier, not to create tiers
- Eyebrow labels always precede section headings; they establish category context
- `ALL CAPS` is reserved for eyebrow labels and stat labels only — never headlines or body

---

## 6. Layout & Spacing

### Container
```
max-w-7xl mx-auto px-6 lg:px-8
```
Maximum content width: `80rem` (1280px) with `24px` / `32px` horizontal padding.

### Section padding
```
py-36   →  144px vertical (standard sections)
py-44   →  176px vertical (CTA sections, maximum breathing room)
```

### Grid system
- **2-column:** `grid lg:grid-cols-2 gap-20` — hero intros, two-column content
- **3-column:** `grid lg:grid-cols-3 gap-16` — module cards, principle cards
- **4-column:** `grid grid-cols-2 lg:grid-cols-4 gap-12` — stat blocks
- Card grids (3-layer): `gap-1` — deliberate tight gap creates a single-unit visual

### Borders
Always hairline-thin. Never decorative — only structural:
- Dark surfaces: `border-white/[0.06]` to `border-white/[0.08]`
- Light surfaces: `border-gray-100` to `border-gray-200`
- Never use thick borders (`border-2` or greater)

---

## 7. Motion & Animation

### Hero entrance (CSS, on load)
Elements animate in sequentially on page load using the `.hero-animate` class with inline `animationDelay`.

```css
@keyframes heroFadeUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-animate {
  opacity: 0;
  animation: heroFadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

**Stagger order and delays:**

| Element | Delay |
|---------|-------|
| Eyebrow label | `0ms` |
| H1 / headline | `160ms` |
| Body / subheading | `360ms` |
| CTAs | `520ms` |
| Scroll indicator | `900ms` |

### Scroll reveal (IntersectionObserver)
All below-fold content uses the `<FadeUp>` component from `@/components/FadeUp`.

```css
.fade-up {
  opacity: 0;
  transform: translateY(36px);
  transition:
    opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up.in-view { opacity: 1; transform: translateY(0); }
```

**Card stagger delays:** `0ms`, `120ms`, `240ms` (left → right across grid)

### Easing
All animations use `cubic-bezier(0.16, 1, 0.3, 1)` — a fast-out curve that snaps into place rather than easing symmetrically. This feels decisive, not floaty.

### Hover transitions
```
transition-all duration-300   →  interactive elements (buttons, CTAs)
transition-colors duration-200 →  text links, nav items
transition-transform duration-300 →  module card lift (-translate-y-1)
```

### Animated counters
The `<CountUp>` component (`@/components/CountUp`) animates numeric stats when they enter the viewport. Use for all key performance numbers.

---

## 8. Photography & Imagery

### Subject matter
Real infrastructure. Real operations. Real places. No stock photography of people shaking hands or generic city skylines.

**Approved subjects:**
- Transit platforms, rail lines, station interiors (DART network)
- Operational control environments
- Physical infrastructure details (sensors, signage, turnstiles)

**Avoid:**
- Generic stock photography
- Heavily stylized or filtered images
- Images without clear operational context

### Treatment on dark sections
```
opacity-35 to opacity-50  →  base image opacity
+ bg-linear-to-b from-black/65 via-black/25 to-black/90  →  vertical gradient
+ bg-linear-to-r from-black/30 via-transparent to-black/30  →  side vignette
```
The goal: image visible through the center, text readable at top and bottom.

### No grid overlays
The `linear-gradient` grid overlay pattern (`80px × 80px` crosshatch) has been removed from all pages. Do not reintroduce it.

---

## 9. Components

### Navigation
```
height: h-16 (64px)
background: bg-black/70 backdrop-blur-xl
border: border-b border-white/[0.06]
logo: text-base font-medium tracking-[0.3em]
links: text-[13px] text-white/50 hover:text-white (active: text-white)
contact CTA: border border-white/20 px-5 py-2 hover:bg-white hover:text-black
```

### Primary CTA button (dark background)
```
bg-white text-black px-10 py-3.5 text-sm font-medium tracking-wide
hover:bg-white/90 transition-all duration-300
```

### Secondary CTA button (dark background)
```
border border-white/30 px-10 py-3.5 text-sm font-medium tracking-wide
hover:border-white/60 hover:bg-white/[0.04] transition-all duration-300
inline-flex items-center justify-center gap-2
```
Include `<ArrowRight className="w-3.5 h-3.5" />` as trailing icon.

### Text link (inline)
```
inline-flex items-center text-sm font-medium border-b border-[color] pb-1
hover:border-[color]/40 transition-colors duration-200 gap-2
```

### Eyebrow label
```
text-[11px] font-medium tracking-[0.3em] text-white/30 mb-6 uppercase
```
Always placed directly above the section heading it belongs to.

### Stat block
```
Number:  text-[3.5rem] lg:text-[4.5rem] font-thin leading-none tracking-[-0.02em]
Label:   text-[11px] font-medium text-white/30 tracking-[0.2em] uppercase mt-3
```
Use `<CountUp>` for animated entry on all numeric stats.

### Three-layer card grid
```
grid lg:grid-cols-3 gap-1  →  deliberate 4px gap, appears as single unit
card 1 (Data):       bg-black text-white p-10 h-full
card 2 (Operations): bg-[#FF6B35] text-white p-10 h-full
card 3 (Intelligence): bg-[#2C3E50] text-white p-10 h-full
```

### Data table row (spec sheet style)
```
flex justify-between items-baseline border-b border-white/[0.07] py-5
label: text-[12px] text-white/35 tracking-wide
value: text-2xl font-thin tracking-[-0.01em]
```

---

## 10. Brand Don'ts

- ❌ `ALL CAPS` headlines or body copy
- ❌ Grid overlay patterns on hero images
- ❌ `font-light` as the single weight for everything — use the full weight system
- ❌ Extreme letter spacing (`tracking-[0.4em]` or more) on anything larger than eyebrow labels
- ❌ Fixed-width CTA buttons (`w-56`) — buttons should fit their content
- ❌ Multiple opacity tiers as a substitute for proper typographic hierarchy
- ❌ Rounded corners (`rounded-full`, `rounded-lg`) — the brand is sharp-edged
- ❌ Drop shadows, glows, or decorative effects
- ❌ The accent green (`#27AE60`) for decorative or brand purposes
- ❌ Stock photography or non-operational imagery

---

## 11. File Reference

| File | Purpose |
|------|---------|
| `src/app/globals.css` | Brand tokens, animation keyframes, scroll-reveal system |
| `src/app/layout.tsx` | Font loading (Geist Sans variable font), metadata |
| `src/components/FadeUp.tsx` | Scroll-reveal animation wrapper |
| `src/components/CountUp.tsx` | Animated numeric counter |
| `src/components/Nav.tsx` | Reusable navigation component |
| `src/app/page.tsx` | Homepage — primary design reference |
| `src/app/platform/page.tsx` | Platform page — secondary design reference |
| `public/images/dart/` | Approved photography assets |

---

*KAI Brand Guidelines — Last updated February 2026*
