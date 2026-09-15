# Six-room campus upgrade

The existing React / Three.js website has been edited in place. Its desk entry, program exercises, program data, passport and application handoffs remain in the same app.

## Explore

- Upstairs: AI & App Studio, Cybersecurity Lab, Data Science Lab.
- Downstairs: Youth Project Studio, Academy X Studio, Juniors Discovery Lab.
- Building overview, floor focus and individual room focus.
- Separate program choices for shared rooms.
- Return from a program to its originating room.
- Mobile room swipes, named room buttons and stable program controls.
- Room story progression, articulated learner animation and Meshy props.

## Assets and rendering

Two Meshy 5 assets were generated/textured for the approved 30 credits: robot and chair. Blender processing produced smaller desktop/mobile GLBs and editable sources. See asset-sources/ASSET-MANIFEST.md, model-stats.json and scripts/prepare_meshy_assets.py.

The architecture and character systems are original code models. Static architecture is merged by material. Studio environment reflections, softer campus lighting, local assets and device-specific model selection are implemented. The desk also gains the generated robot, a curved dallah spout and a hollow finjan with animated liquid level.

## Run

From this folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Production preview:

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4173
```

Tests:

```powershell
$env:TEST_BASE_URL='http://127.0.0.1:4173'
npm.cmd test
```

The default test browser is installed Microsoft Edge. Set TEST_BROWSER=chrome to use an installed Chrome channel.

## Scope notes

The building is an illustrative concept, not a measured reproduction of CODED's premises. Existing program activities remain browser demonstrations. No backend service or public deployment was added.

The Meshy robot is animated as a rigid model; it does not contain a skeletal animation rig. Campus learners have articulated code-built arms and heads. Story displays and signals are scripted visual demonstrations, while the existing program exercises retain their functional logic.

Test results and coverage limits are recorded in SIX-ROOM-QA.md. Do not interpret local browser emulation as proof of physical-mobile performance or a cultural-expert review.
