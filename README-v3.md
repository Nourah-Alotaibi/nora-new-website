# Version 3 — Bright studio

Independent copy of the approved local portfolio. The original remains in `../my-website`.
Default: bright mode. The “After hours” button opens the preserved purple design.
Theme preference uses a separate storage key. Nothing has been pushed or deployed.

## Design choices

- Cream editorial layout with matcha, clay, and iris pigment palettes.
- A procedural Three.js morning desk with draggable objects, a ceramic bowl and bamboo whisk. Whisk & pour fills the glass, Add ice drops ice cubes, and a welcome message completes the ritual. Keyboard controls can move and reset objects. The renderer sleeps when settled, offscreen, or in a hidden tab. Mobile caps pixel density. A CSS illustration appears if WebGL cannot initialize.
- An acrylic-inspired, procedurally drawn landscape. Mouse movement or touch strokes reveal textured color. Reveal all and Start fresh provide keyboard alternatives. Palette buttons recolor both the site and the landscape.
- A sliding gallery of framed project canvases supports buttons, arrow keys, and swipes. Original project media and descriptions remain available below the gallery.
- A ten-chapter story uses pastel postcards, short summaries, hover-tilting dimensional objects, and expandable original details.
- A skippable full-screen matcha-fill introduction reveals the site. It plays on every page refresh, can be replayed from the footer, and respects reduced motion. No invented loading percentage.
- Removed the inherited Manus runtime/debug/storage-proxy Vite plugins from this copy; the local portfolio does not need those services.

## Run

Use Node 22.12+ and the package-manager version in package.json.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm preview
```

The bright preview uses port 3003. The preserved version uses port 3000.

In this managed Windows environment, native esbuild cannot traverse one ancestor folder. Verification used a temporary drive mapping plus Vite's native config loader; this is an environment workaround, not a change required on a normal machine.

## References studied

Interaction principles were adapted, not source code or artwork.

- [Tomasz Szmajda — painted reveals from simple geometry](https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/)
- [Corentin Bernadou — editorial structure and interactive design tools](https://tympanus.net/codrops/2026/03/05/inside-corentin-bernadous-portfolio-swiss-inspired-layouts-webgl-geometry-and-thoughtful-motion/)
- [Oryzo AI](https://lusion.co/projects/oryzo_ai/) and [Lusion's design breakdown](https://blog.lusion.co/oryzo-bts-part-3-7-website-ux-ui-and-illustrations) — personality within a restrained interface.
- [Arnaud Rocca](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/) — quiet project presentation.
- [Soda Experience](https://lusion.co/projects/soda_experience/) — dimensional beverage interaction.
- [Of The Oak](https://lusion.co/projects/of_the_oak/) — efficient organic forms.
- [Merouane Bali](https://tympanus.net/codrops/2025/01/21/the-journey-of-creating-a-3d-portfolio/) — simpler mobile experiences.
- [Dash Creative](https://tympanus.net/codrops/2026/07/21/magnetic-commerce-building-the-dash-creative-website/) — motion driven by a material concept.
- [Roman Jean-Elie](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/) — bounded dimensional scenes.
- [Bruno Simon](https://bruno-simon.com/) — rewarding interaction, without adopting game navigation.

## Latest interaction refinements

- The enlarged board has a chocolate chip cookie with six visible bites and a refill action. Stirring blends the milk and tea into green matcha throughout the glass.
- Zoom, drag rotation, reset, and expandable fine rotation/tilt controls work alongside object movement.
- The selected gallery canvas connects to a matching animated exhibit panel containing its film and description. Werewolf Curse uses a wolf-face icon.
- All ten story chapters have distinct Three.js miniatures with multiple objects, from the campus and engineering gear to a telescope and research network. Pastel backgrounds are softened.

- Cookie refinement uses only procedural geometry and vertex colors: thicker uneven baked edges, varied embedded chocolate chips, light baked marks, and a fitted contact shadow. The board camera, composition, and lighting direction are preserved.
- Theme selection is now in the header in both modes; the floating switch is removed.
- Gallery and explanation share a continuous exhibit frame with an explicit selected-canvas connector. Chapter models now include contextual details and labels, including a dimensional Google-colored G for GDSC.
