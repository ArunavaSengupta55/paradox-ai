# Paradox.ai Design System

**Tone**: Futuristic, professional, utilitarian. Clean surfaces with strategic accent colors for key interactions and insights. Dark mode primary.

**Differentiation**: Cyan-teal accent palette with minimal rounding creates a tech-forward, information-dense AI assistant interface. Mode selector highlights active state with vivid cyan. Response insights use gradient accent text for visual hierarchy.

## Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Background | 0.99 0 0 | 0.12 0 0 | Page background, deep charcoal in dark |
| Foreground | 0.12 0 0 | 0.95 0 0 | Text, white in dark mode |
| Primary (Cyan) | 0.7 0.18 200 | 0.7 0.18 200 | Active mode indicators, focus ring |
| Accent (Teal) | 0.75 0.16 190 | 0.75 0.16 190 | Key insights, gradient text highlights |
| Card | 0.97 0 0 | 0.16 0 0 | Response containers, modal backgrounds |
| Muted | 0.88 0 0 | 0.20 0 0 | Sidebar alternating rows, subtle divisions |
| Border | 0.85 0 0 | 0.25 0 0 | Card edges, input outlines |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Error alerts only |

## Typography

- **Display**: Geist Mono (monospace, tech-forward header labels)
- **Body**: DM Sans (refined, readable body text and inputs)
- **Mono**: Geist Mono (code snippets, reasoning output)
- **Scale**: 12px (caption) → 14px (body) → 16px (heading) → 20px (title) → 28px (hero)

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|---------|
| Top Navigation | `bg-card` with cyan border-bottom, mode selector buttons | 5 mode tabs (Text/Image/Video/Music/Analytics) |
| Left Sidebar | `bg-sidebar` with alternating `bg-muted/20` for history items | Conversation history, past sessions |
| Main Content | `bg-background` with card-based responses | Prompt input, response display, reasoning settings |
| Response Card | `bg-card` with `accent-border-left` (3px cyan) | AI response with key insights highlighted |
| Input Field | `bg-input` with cyan focus ring, rounded-sm | Prompt entry, clear visual affordance |
| Settings Panel | `bg-popover` slide-in from right | Reasoning style selector, preferences |

## Spacing & Rhythm

- **Grid**: 0.375rem base (compact, information-dense)
- **Padding**: 0.5rem (card), 1rem (section), 1.5rem (container)
- **Gap**: 0.5rem (elements), 1rem (sections)
- **Margin**: 0 (adjacent cards), 1rem (section breaks)

## Component Patterns

- **Mode Buttons**: `mode-button-active` (cyan bg, white text) / `mode-button-inactive` (subtle hover)
- **Response Cards**: Left cyan border, `accent-text` gradient on key phrases
- **Input Fields**: Border on focus only (no outline), cyan ring
- **History Items**: Alternating muted backgrounds, hover state lightens
- **Settings Toggle**: Smooth slide-in/out animation from right edge

## Motion & Interaction

- **Transition Default**: `transition-smooth` (0.3s cubic-bezier, all properties)
- **Mode Switch**: `slide-in` (0.3s, 8px translateX from left)
- **Response Appear**: `fade-in` (0.3s opacity)
- **Hover States**: Muted background lightens, text accent strengthens
- **Focus Indicators**: Cyan ring (0.5px, no offset)

## Constraints

- Max 2 font families (display + body, shared mono)
- 3 core colors (primary cyan, accent teal, destructive red)
- No background gradients—accent text only
- No decorative shadows—`shadow-subtle` for elevation, `shadow-elevated` for modals
- Border radius: 0.375rem default, 0 for buttons (sharp), 0.5rem for inputs (slightly rounded)
