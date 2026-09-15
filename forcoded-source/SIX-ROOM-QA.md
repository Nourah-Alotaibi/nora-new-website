# Six-room campus — implementation and QA

Date: September 15, 2026. Local production preview: http://127.0.0.1:4173/.

## Implemented

- Two-floor, six-room cutaway building with west staircase, landings, railings, floor construction and original room-specific interiors.
- Upstairs AI/App, Cybersecurity and Data Science rooms; downstairs Youth, Academy X and Juniors rooms.
- Stable building/floor/room controls, mobile room swipes, separate program entries and return-to-room state.
- Existing program activities, passport, matcher, shared campus areas and application handoffs retained.
- Meshy 5 robot and chair; Blender-cleaned desktop/mobile GLBs and editable source files.
- Articulated original learner characters, room story displays/signals and manual story progression.
- Studio environment reflections, lower campus ambient intensity, contact shadows and differentiated material values.
- Upgraded desk robot, original curved dallah spout, hollow finjan and animated liquid surface.
- Model-loading fallback/retry and native text-undo repair.

## Phase checks

| Checkpoint | Evidence |
|---|---|
| Baseline | Production build passed; 33 existing tests passed in 3.8 minutes |
| Architectural shell | Build passed; two new navigation checks passed at 390 and 1440 widths |
| Furnished interiors | Build passed; same two desktop/mobile checks passed |
| Characters and Meshy integration | Build passed; two campus navigation checks passed |
| Program integration and fallback | New room mapping, return state, failed-model navigation and text-undo checks exercised |
| Final regression | See final results below |

Inspection found and repaired a mobile shared-links overlap, a matcher-to-room selection issue, and low contrast on small room labels. A new test initially used a nonexistent spelling of After School; it was corrected to the existing program title. The older Back to the Dollhouse assertions were updated to the new Back to room control.

## Measured rendering and assets

The desktop campus sample recorded 353 draw calls, 157,382 triangles, 21 renderer textures and 347 geometry objects. These are renderer counters from the local browser, not a mobile performance guarantee. Test budgets are fewer than 600 draw calls and 400,000 triangles.

| Asset | Desktop | Mobile |
|---|---:|---:|
| Robot triangles | 10,343 | 4,343 |
| Robot GLB bytes | 603,076 | 265,180 |
| Chair triangles | 8,120 | 3,410 |
| Chair GLB bytes | 549,704 | 243,644 |
| Maximum texture dimension | 1024 | 512 |

Approved and consumed Meshy cost: 30 credits. Two geometry tasks at 5 credits each, two texture tasks at 10 credits each. No extra candidates, paid rigging or paid remeshing were performed.

## Final results

Production TypeScript/Vite build: passed. Full Edge run: 38 passed, one campus label-contrast failure, 4.4 minutes. After the focused CSS color fix, the remaining campus accessibility test passed on Edge (4.3 seconds). All 39 distinct checks therefore have passing verification across the full run and the focused repair rerun; a second full 39-test run was not performed after that CSS-only fix. Chrome: all six campus tests passed in 1.0 minute, including accessibility, room mappings, return state, model-failure recovery and text undo. A final mobile heading-offset fix was then verified by the Edge campus accessibility test plus a heading-bounds assertion (7.3 seconds). The final production build passed.

The final desk cadence sample was approximately 74.99 animation callbacks/second with a 13.5 ms p95 interval and seven initial resources. This is callback cadence, not a GPU or physical-mobile benchmark.

## Coverage and limits

Desktop/mobile browser sizes, program activities, touch emulation, keyboard flows, malformed storage, reduced motion, unavailable WebGL, model failure, room mappings and return state are covered by the automated suite. The campus receives its own automated accessibility check.

The robot GLB uses whole-model movement, not a skeletal rig. Learners use articulated original code geometry. Their short scripted stories are visual context; the actual exercises remain the existing interactive program modules. The campus uses a consistent structural bay system with different interiors rather than six independently modeled buildings.

No physical-mobile, Safari, Firefox, real screen-reader session, public deployment or cultural-expert review is claimed. The building is a concept headquarters, not a reconstruction of CODED's real facilities. Asset photographs were used as references only and were not redistributed.

Full asset provenance, source task IDs, actual optimization steps and reference links are in asset-sources/ASSET-MANIFEST.md. Original models, editable Blender files and the processing script are included.



## Publication verification
Final prepublication production run: all 39 tests passed in 4.5 minutes after the relative asset-path fix. Portfolio production build passed. The combined site's /forcoded/ check passed: all six room controls, story controls, program entry and return, both desktop GLB assets, and no browser errors or HTTP failures. Portfolio homepage returned 200 with its original title. An initial standalone Python preview check failed; verification on the actual combined Vite build passed.

