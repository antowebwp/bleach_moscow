# BLEACH MOSCOW: home prototype

## Context and goals

Design intent: adapt SOLE FRESH's monochrome, large product photography and bold sans-serif hierarchy to BLEACH MOSCOW while keeping the section sequence of home.php.

This is a local visual prototype, not a replacement WordPress theme. It must preserve the sequence: hero, results, benefits, services, process, client reviews, Yandex reviews, contacts. Header and footer surround this sequence. The original PHP files remain unchanged.

The user-supplied reference inventory reports cards (167), links (79), buttons (13), navigation (2). These counts describe the supplied reference report; they were not independently verified and must not be reproduced as a target density. The prototype uses six service cards and two navigation variants, with only the appropriate variant exposed at each breakpoint.

## Design tokens and foundations

styles.css :root is the source of truth. Components must use semantic variables for colors, space, radii, typography and transitions.

| Role | Token | Value |
|---|---|---|
| Primary font | --font-primary | Inter, Apple system fallbacks, Helvetica, Arial, sans-serif |
| Base type | --font-body | 16px, normal weight, 1.5 line height |
| Supporting type | --font-small | 13px |
| Section display | --font-title | clamp(36px,4.6vw,66px); mobile 38px |
| Page | --surface-base | #ffffff |
| Secondary surface | --surface-raised | #f5f5f7 |
| Photographic hero | --surface-dark | #101012 |
| Primary text | --text-primary | #1d1d1f |
| Secondary text | --text-secondary | #626268 |
| Inverse text | --text-on-dark | #ffffff |
| Separator | --line | #d8d8dc |
| Keyboard focus | --focus | #235bcc |
| Validation error | --error | #b42318 |
| Space | --space-1 through --space-13 | 6,8,10,12,14,16,21,24,32,48,64,96,128px |
| Radius | --radius-xs, --radius-sm, --radius-pill | 8,20,50px |
| Motion | --duration-instant, --duration-fast | 200,300ms |
| Modal shadow | --shadow-dialog | 0 8px 40px rgb(0 0 0 / .3) |

The supplied 12–16px scale should be used for supporting interface text, not large headlines. Display typography and section spacing must have explicit additional tokens. The supplied light gray #949494 must not be used for normal-sized body text on white. The supplied 980px radius should be treated as a pill intent, not a mandatory literal value.

## Component rules

All interactive components must define default, hover, focus-visible, active, disabled, loading and error handling. States that are not meaningful for a component must be explicitly inapplicable; they must not be faked with timers or false success feedback.

| Component | Anatomy and token rules | States and behavior |
|---|---|---|
| Navigation | Brand, semantic nav links, action, mobile toggle; --space-8 gap, --font-small | Default links use primary text; hover secondary; focus ring; active press feedback. Current page must use aria-current in WordPress. Disabled routes must be omitted or marked noninteractive. Loading/error are inapplicable to static anchors. Toggle must expose aria-expanded and aria-controls. Escape must close; touch and pointer activate the same action. |
| Action button | Label plus optional decorative arrow, --radius-pill, --space-5/8 | Dark/light/outline variants; hover changes surface; active scale .98; focus ring; :disabled and aria-disabled communicate unavailable action. Real asynchronous actions must set aria-busy and prevent repeat submission. Errors must appear next to the relevant action and be announced. Prototype actions open a dialog without simulated submission. |
| Service card | Image, h3, explanation, link; --radius-sm and --space-8 | Image hover gently scales; keyboard focus must remain visible; long names must wrap without truncation; description may grow and bottom action must remain aligned. Missing prices must be omitted, never invented. Empty service lists must show an honest availability message. Disabled/loading/error apply to the action or resource, not the entire informational card. |
| Before/after | Two complete images in an editorial diptych, captions below the images | The images must never be split with an overlay or drag slider. Each image opens the native image dialog through Enter/Space, pointer or touch. Focus must remain visible on each action. Missing either source must render a single image with an explanatory message. Comparison must not autoplay. On phones images remain side by side; full-size details open in the dialog. |
| Gallery | Image, previous/next buttons, live count | Previous/next must work with Enter/Space and pointer/touch. Count must announce changes. Rapid actions must overwrite fade tweens. An empty gallery must hide controls and explain missing examples; a single image must hide paging. Invalid images must provide alt text and fallback. |
| Contact dialog | Close, title, explanation, real contact links | Native dialog must trap focus and close on Escape. It must restore focus to its trigger. Backdrop click should close; clicks inside must not. Long content must scroll within the viewport. No submission/loading/error is claimed by this contact chooser. CF7 will supply real validation, loading and result states during migration. |
| Image dialog | Close and full image | Native dialog and same focus rules; image must fit 75dvh without distorting aspect ratio. Loading/error must remain honest if media cannot display. |
| Cookie notice | Original notice copy, privacy link, accept action | Dismissal must persist under cookiesAccepted when storage is available. Storage denial must not break the page. This purely local action has no loading/error flow. All interactive states must follow button rules. |

Responsive behavior must use the documented 600/900/1180px transitions. On phones, hero actions become stacked, services become one column and process becomes a vertical sequence. Content must remain usable with long Cyrillic text and 200% text enlargement. Cards should rely on intrinsic height rather than fixed text heights.

## Accessibility requirements and testable acceptance criteria

- Normal text must reach contrast 4.5:1; large text must reach 3:1. Focus and essential component boundaries must meet 3:1 against adjacent colors. Automated checks and photographic-background inspection must both pass before production.
- Every meaningful image must have descriptive alt text. Decorative arrows must not form the accessible label.
- Every action must be reachable with Tab and operable with keyboard. Focus must remain visible and not be covered by the sticky header or cookie banner.
- Touch buttons must have at least a 44px hit area; adjacent targets should have 8px clearance.
- Document must contain one h1, ordered headings, semantic landmarks and a working skip link.
- At 375,390,768,1024,1440px, document scrollWidth must not exceed its viewport width.
- Dialog Escape, focus containment and restoration must pass real keyboard testing.
- Reduced motion must remove GSAP reveals and scrub effects and disable smooth scrolling. All content must remain visible if GSAP fails to load.
- External embeds must have descriptive titles. The reviews section must retain a direct Yandex link if the embed is unavailable.

Target: WCAG 2.2 AA. This target is not a certification; a full accessibility audit remains necessary before release.

## Content and tone

Writing should be concise, factual and specific. A CTA must describe its action: «Вызвать курьера», «Рассчитать стоимость», «Позвонить». Content must not introduce false ratings, fabricated testimonials or unconfirmed prices. Prototype process descriptions are demonstration copy and must be replaced with the original ACF repeater content when integrating.

## Anti-patterns, migration and edge cases

- Components must not introduce raw color exceptions, hidden focus indicators, unlabelled controls or arbitrary shadow stacks.
- Animations must not hijack scrolling, run indefinitely or conceal content when dependencies fail.
- Existing URLs, analytics goals, legal copy, CF7 identifiers and ACF field names must remain intact when integrating.
- WordPress integration must replace demo arrays with before_after_slider_1, category 2 gallery posts, category 4 service posts, how_use_repeater, category 5 reviews and category 12 additional addresses. Service query offsets must be retained unless explicitly changed.
- Contact options must come from ACF option values; missing messenger values must not be replaced with guessed links.
- Production styles should replace the relevant old component styles; they must not become another layer of global !important overrides.
- The initial template's service pricing, reviews and additional addresses are database-backed. They are not available in this local prototype. The real CF7 form must be connected in WordPress, not emulated by a success message.

## QA checklist

- [x] Eight main sections retain original order.
- [x] Local original photos, locally hosted Inter and GSAP/ScrollTrigger 3.15.0.
- [x] JavaScript syntax check.
- [x] Browser check: menu, Escape closure, before/after image dialogs and gallery cycling.
- [x] Measured overflow at 390px and initial desktop viewport.
- [x] Measured overflow at 375,390,768,1024,1440px; dialog Escape and focus restoration.
- [ ] Independent contrast audit and 200% enlargement.
- [ ] Full ACF/CF7 integration and real form submission on staging.
- [ ] Verify external pages and embeds on the target host.


## Motion revision

References: https://archilite.ru/ and https://www.awwwards.com/sites/new-york-shoe-maker-website (Express Shoe Repair). Adapted patterns: staggered masked typography, image scale and depth on scrolling, sequential service and process reveals.

The hero content and product move at different rates on desktop. Section headlines reveal word by word; before/after images appear in sequence; services reveal the image, text and action in order; process steps reveal their content sequentially; mobile menu items enter as a finite cascade; the footer has a staggered entry.

All animations must be created within gsap.matchMedia and revert when reduced motion is enabled. Parallax must be desktop-only. Content must remain visible with missing GSAP. No scroll hijacking. The opt-in user-requested offer ticker is the only continuous motion and must expose pause controls. Brand PNG whitespace is removed from its displayed viewport with CSS, preserving the original mark. Visible mark widths: header 180px, mobile 148px, footer 260px / mobile 220px.

## Fullscreen scenes and editorial service panels

The four benefit topics now form one full-width cinematic stage below the header. On desktop (>900px width and >699px height), GSAP pins the stage and reveals successive scenes with a vertical clip-path transition. Images scale and shift with scrolling. Numbered keyboard-operable controls scroll to the corresponding scene. Only the current scene is interactive; inactive scenes are inert. Cleanup restores all scenes to document flow and removes inert/aria-hidden.

On phones, short viewports and reduced motion, every scene remains readable in ordinary document flow. Services use asymmetric 7/5, 5/7 and 6/6 column spans on desktop, two columns on tablets and one on phones. Original six service URLs remain intact. Text overlays must retain adequate contrast.

The single ticker contains existing free consultation, photo assessment and MKAD delivery information. Discount claims require supplied conditions. The ticker must pause via its button, hover, focus, visibility and reduced motion. Duplicated text remains aria-hidden with a static accessible equivalent.

Verified: full-width stage equals viewport content width, scene selection, zero console errors in a fresh preview, and 390px layout without horizontal overflow. Screenshot saving is currently blocked by zero free disk space on C:.

## Typography and scroll progress update
Headings use locally hosted Cormorant Garamond (400/500/600), Cyrillic included; body and controls retain Inter. Font license: assets/Cormorant-OFL.txt. Accent tokens: --accent, --accent-hover, --accent-soft. Every main section and footer must use --section-space (clamp(32px,5vw,80px)) with --gutter. Full-bleed scene photography uses negative margins while its text uses the same padding. Process steps fill sequentially and reverse with scrolling; reduced motion shows all completed, without animation. Resize must reconstruct desktop/mobile step triggers. Pin initialization precedes downstream triggers to preserve correct positions.

## Shared scene inset and button inversion
Care-copy must share the section content maximum and gutter; photos remain full bleed. Scene controls must use --content-inset and --section-space. Filled buttons invert white/gold through a finite 500ms fill transition on hover and keyboard focus. Disabled controls must not animate. Reduced motion disables the transition.

## Mobile cinematic care scenes
The care stage pins on all widths when viewport height is at least 540px and motion is allowed. Pin start derives from actual header height, scroll duration from stable stage height. Mobile retains four scene buttons and compact typography, with reserved space below copy for controls. Very short landscape screens and reduced motion use ordinary readable document flow.

## ScrollTrigger refresh regression fix
Reveal triggers use play/none/none/none rather than once:true, to avoid self-removal during nested pin refresh at restored scroll or deep anchors. The full care timeline must be built before attaching its standalone ScrollTrigger. Font/load refreshes are coalesced and use safe refresh. Regression checks: load at contacts/services/work/care anchors, reload below pin, resize desktop-mobile-desktop, verify scene buttons and progress.
