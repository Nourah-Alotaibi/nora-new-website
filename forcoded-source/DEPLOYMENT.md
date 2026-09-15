# CODED at /forcoded/

This independent React/Three.js experience is published inside the existing portfolio.
The compiled assets live in `client/public/forcoded/`. Vite copies them into the portfolio build.
Vercel redirects `/forcoded` to `/forcoded/` and serves its own index document.

To update it, run `npm ci` and `npm run build` in this directory, then replace the contents of `../client/public/forcoded/` with `dist/`. Keep relative asset paths and verify both the portfolio homepage and `/forcoded/` before pushing.

Editable Blender sources and original Meshy assets are included in the separate six-room delivery package. Only the optimized runtime models are deployed here.
